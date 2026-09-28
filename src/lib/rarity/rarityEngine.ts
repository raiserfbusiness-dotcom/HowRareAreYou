import { QuizAnswers } from '../../types/quiz';
import {
  RarityNarrative,
  RarityResult,
  RarestCombinationResult,
  TraitContribution,
} from '../../types/rarity';
import {
  CORRELATION_RULES,
  DISTRIBUTIONS,
  WORLD_POPULATION_ESTIMATE,
} from './distributions';
import { ALL_QUESTIONS } from './questions';
import { validateQuizAnswers } from './validation';
import { computeUncertaintyInterval, evaluateConfidence } from './confidence';

/**
 * Formats a "1 in X" rarity figure into human-readable, honest language
 * without false decimal precision.
 * Examples:
 * - 842 -> "~1 in 840"
 * - 125432 -> "~1 in 125,000"
 * - 2738492 -> "~1 in 2.7 million"
 * - 31400000 -> "~1 in 31 million"
 * - 1240000000 -> "~1 in 1.2 billion"
 */
export function formatRarity(oneInX: number, includeTilde = true): string {
  const prefix = includeTilde ? '~1 in ' : '1 in ';
  if (!Number.isFinite(oneInX) || oneInX <= 1) {
    return `${prefix}1`;
  }

  const val = Math.round(oneInX);

  if (val < 100) {
    return `${prefix}${val.toLocaleString('en-US')}`;
  }

  if (val < 1_000) {
    const rounded = Math.round(val / 10) * 10;
    return `${prefix}${rounded.toLocaleString('en-US')}`;
  }

  if (val < 10_000) {
    const rounded = Math.round(val / 50) * 50;
    return `${prefix}${rounded.toLocaleString('en-US')}`;
  }

  if (val < 100_000) {
    const rounded = Math.round(val / 500) * 500;
    return `${prefix}${rounded.toLocaleString('en-US')}`;
  }

  if (val < 1_000_000) {
    const rounded = Math.round(val / 1_000) * 1_000;
    return `${prefix}${rounded.toLocaleString('en-US')}`;
  }

  if (val < 1_000_000_000) {
    const millions = val / 1_000_000;
    const formatted =
      millions >= 10
        ? Math.round(millions).toLocaleString('en-US')
        : millions.toFixed(1).replace(/\.0$/, '');
    return `${prefix}${formatted} million`;
  }

  const billions = val / 1_000_000_000;
  const formatted =
    billions >= 10
      ? Math.round(billions).toLocaleString('en-US')
      : billions.toFixed(1).replace(/\.0$/, '');
  return `${prefix}${formatted} billion`;
}

/**
 * Formats an uppercase hero display string, e.g. "1 IN 2.7 MILLION"
 */
export function formatShortRarity(oneInX: number): string {
  return formatRarity(oneInX, false).toUpperCase();
}

/**
 * Cleans and rounds estimated population twin counts to avoid false precision.
 */
export function roundPopulationEstimate(count: number): number {
  if (count <= 0) return 1;
  if (count < 50) return Math.round(count);
  if (count < 500) return Math.round(count / 5) * 5;
  if (count < 10_000) return Math.round(count / 10) * 10;
  if (count < 100_000) return Math.round(count / 100) * 100;
  if (count < 1_000_000) return Math.round(count / 1_000) * 1_000;
  return Math.round(count / 10_000) * 10_000;
}

/**
 * Generates honest, non-exaggerated narrative copy based on rarity range.
 * Never claims the user is "objectively unique" or "one of a kind".
 */
export function generateRarityNarrative(oneInX: number): RarityNarrative {
  if (oneInX < 2_500) {
    return {
      tier: 'COMMON',
      headline: "You're surprisingly typical.",
      summary:
        'Individually and in combination, your selected traits align closely with broad global majorities.',
    };
  }

  if (oneInX < 50_000) {
    return {
      tier: 'UNCOMMON',
      headline: "You're less common than you might expect.",
      summary:
        'While most of your individual answers are shared by millions, their overlap narrows the field considerably.',
    };
  }

  if (oneInX < 750_000) {
    return {
      tier: 'RARE',
      headline: 'Your combination starts getting unusual.',
      summary:
        'Only a small fraction of the reference population is estimated to share this specific intersection of traits.',
    };
  }

  if (oneInX < 15_000_000) {
    return {
      tier: 'VERY RARE',
      headline: "That's a remarkably uncommon combination.",
      summary:
        'A few key overlaps in your profile filter out the vast majority of the global reference population.',
    };
  }

  return {
    tier: 'EXTREMELY RARE',
    headline: 'Your combination is difficult to find.',
    summary:
      'Across an estimated 8.1 billion people, this particular intersection of characteristics is statistically sparse.',
  };
}

/**
 * Selects the 4 traits that create the most compelling "Rarest Combination" highlight.
 */
function computeRarestCombination(traits: TraitContribution[]): RarestCombinationResult {
  if (traits.length === 0) {
    return {
      traits: [],
      combinedProbability: 1,
      oneInX: 1,
      formattedOccurrence: '~1 in 1',
      explanation: 'Insufficient traits provided to isolate a combination.',
    };
  }

  // Sort traits from lowest adjusted probability (rarest) to highest
  const sorted = [...traits].sort((a, b) => a.adjustedProbability - b.adjustedProbability);
  const selected = sorted.slice(0, Math.min(4, sorted.length));

  const combinedProbability = selected.reduce(
    (acc, item) => acc * item.adjustedProbability,
    1
  );
  const oneInX = Math.max(1, Math.round(1 / combinedProbability));

  return {
    traits: selected,
    combinedProbability,
    oneInX,
    formattedOccurrence: formatRarity(oneInX, true),
    explanation:
      'Your rarest subset of overlapping answers creates one of the most statistically uncommon intersections in your profile.',
  };
}

/**
 * Calculates the complete statistical rarity estimate from a user's answers.
 */
export function calculateRarity(answers: QuizAnswers): RarityResult {
  const validation = validateQuizAnswers(answers);
  const isDemoMode =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_DEMO_MODE !== 'false';

  if (!validation.isValid) {
    const emptyConfidence = 'LOW CONFIDENCE';
    return {
      isValid: false,
      invalidReason:
        validation.reason ||
        "You're unusual in ways we can't reliably measure yet. We need a little more information.",
      referencePopulation: WORLD_POPULATION_ESTIMATE,
      answeredCount: validation.totalCount,
      coreAnsweredCount: validation.coreCount,
      bonusAnsweredCount: validation.bonusCount,
      combinedProbability: 1,
      oneInX: 1,
      formattedRarity: '~1 in 1',
      shortRarityValue: '1 IN 1',
      percentile: null,
      formattedPercentile: null,
      statisticalTwins: WORLD_POPULATION_ESTIMATE,
      formattedTwins: `~${WORLD_POPULATION_ESTIMATE.toLocaleString('en-US')}`,
      howManyOfYou: WORLD_POPULATION_ESTIMATE,
      formattedHowMany: WORLD_POPULATION_ESTIMATE.toLocaleString('en-US'),
      confidence: emptyConfidence,
      uncertainty: {
        lowerOneInX: 1,
        upperOneInX: 1,
        formattedRange: '1 in 1',
        explanation: 'We need a few more answers to calculate an interval.',
      },
      rarestCombination: {
        traits: [],
        combinedProbability: 1,
        oneInX: 1,
        formattedOccurrence: '~1 in 1',
        explanation: '',
      },
      narrative: {
        tier: 'COMMON',
        headline: "You're unusual in ways we can't reliably measure yet.",
        summary: 'We need a little more information.',
      },
      traitBreakdown: [],
      correlationAdjustmentsApplied: [],
      isDemoMode,
    };
  }

  const validAnswers = validation.validAnswers;
  const traitBreakdown: TraitContribution[] = [];
  const correlationAdjustmentsApplied: string[] = [];

  for (const question of ALL_QUESTIONS) {
    const optionId = validAnswers[question.id];
    if (!optionId) continue;

    const option = question.options.find((o) => o.id === optionId);
    const dist = DISTRIBUTIONS[question.id];
    if (!option || !dist) continue;

    const rawProbability = dist.prevalence[optionId] ?? 0.25;
    let adjustedProbability = rawProbability;
    let correlationNote: string | undefined;

    // Check if any correlation rule applies where this question is the dependent variable
    for (const rule of CORRELATION_RULES) {
      if (
        rule.dependentQuestionId === question.id &&
        rule.dependentOptions.includes(optionId)
      ) {
        const primaryAnswer = validAnswers[rule.primaryQuestionId];
        if (primaryAnswer && rule.primaryOptions.includes(primaryAnswer)) {
          // Dampen rarity by increasing conditional probability (capped at 0.88)
          adjustedProbability = Math.min(
            0.88,
            adjustedProbability * rule.conditionalProbabilityMultiplier
          );
          correlationNote = rule.explanation;
          if (!correlationAdjustmentsApplied.includes(rule.explanation)) {
            correlationAdjustmentsApplied.push(rule.explanation);
          }
        }
      }
    }

    // Apply a mild dimensionality shrinkage for 9+ traits so high-dimensional profiles
    // do not artificially explode due to unobserved covariance
    const questionIndex = traitBreakdown.length;
    if (questionIndex >= 8) {
      adjustedProbability = Math.pow(adjustedProbability, 0.86);
    }

    traitBreakdown.push({
      questionId: question.id,
      questionPrompt: question.prompt,
      optionId,
      optionLabel: option.label,
      shortTag: option.shortTag,
      cardLabel: option.cardLabel,
      rawProbability,
      adjustedProbability,
      oneInTrait: Math.max(1, Math.round(1 / rawProbability)),
      confidence: dist.confidence,
      correlationNote,
      source: dist.source,
    });
  }

  const combinedProbability = traitBreakdown.reduce(
    (acc, t) => acc * t.adjustedProbability,
    1
  );

  // Clamp oneInX between 1 and reference population so we never claim 1 in 500 billion
  const rawOneInX = 1 / Math.max(combinedProbability, 1 / WORLD_POPULATION_ESTIMATE);
  const oneInX = Math.max(2, Math.min(WORLD_POPULATION_ESTIMATE, Math.round(rawOneInX)));

  // Calculate percentile only when mathematically meaningful (oneInX >= 10)
  let percentile: number | null = null;
  let formattedPercentile: string | null = null;

  if (oneInX >= 10) {
    const rawPercentile = (1 - 1 / oneInX) * 100;
    percentile = rawPercentile;
    if (rawPercentile >= 99.999) {
      formattedPercentile = '99.999%';
    } else if (rawPercentile >= 99.99) {
      formattedPercentile = `${rawPercentile.toFixed(3)}%`;
    } else if (rawPercentile >= 99.9) {
      formattedPercentile = `${rawPercentile.toFixed(2)}%`;
    } else if (rawPercentile >= 99) {
      formattedPercentile = `${rawPercentile.toFixed(1)}%`;
    } else {
      formattedPercentile = `${Math.round(rawPercentile)}%`;
    }
  }

  // Raw statistical twins = World Population * Combined Probability
  const exactTwins = Math.max(1, Math.round(WORLD_POPULATION_ESTIMATE / oneInX));
  // For "Statistical Twins" (people overlapping across most characteristics with slight variance)
  const statisticalTwins = Math.max(1, Math.round(exactTwins * 0.81));
  const howManyOfYou = roundPopulationEstimate(exactTwins);

  const confidence = evaluateConfidence(
    traitBreakdown,
    correlationAdjustmentsApplied.length
  );
  const uncertainty = computeUncertaintyInterval(
    oneInX,
    confidence,
    traitBreakdown.length
  );
  const rarestCombination = computeRarestCombination(traitBreakdown);
  const narrative = generateRarityNarrative(oneInX);

  return {
    isValid: true,
    referencePopulation: WORLD_POPULATION_ESTIMATE,
    answeredCount: validation.totalCount,
    coreAnsweredCount: validation.coreCount,
    bonusAnsweredCount: validation.bonusCount,
    combinedProbability,
    oneInX,
    formattedRarity: formatRarity(oneInX, true),
    shortRarityValue: formatShortRarity(oneInX),
    percentile,
    formattedPercentile,
    statisticalTwins,
    formattedTwins: `~${statisticalTwins.toLocaleString('en-US')}`,
    howManyOfYou,
    formattedHowMany: howManyOfYou.toLocaleString('en-US'),
    confidence,
    uncertainty,
    rarestCombination,
    narrative,
    traitBreakdown,
    correlationAdjustmentsApplied,
    isDemoMode,
  };
}
