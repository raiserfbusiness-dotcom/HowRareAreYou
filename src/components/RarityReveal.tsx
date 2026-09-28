import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { QuizAnswers } from '../types/quiz';
import { RarityResult, SharePayload } from '../types/rarity';
import {
  formatRarityLocalized,
  formatShortRarityLocalized,
  useI18n,
} from '../lib/i18n';
import { StatisticalTwins } from './StatisticalTwins';
import { BecomeRarerGame } from './BecomeRarerGame';
import { RarityCard } from './RarityCard';
import { ChallengeCreator } from './Challenge';

interface RarityRevealProps {
  result: RarityResult;
  answers: QuizAnswers;
  challengerPayload?: SharePayload | null;
  sharedViewPayload?: SharePayload | null;
  onUpdateAnswer: (questionId: string, optionId: string) => void;
  onRetakeQuiz: () => void;
  onEditQuizAnswers: () => void;
  onNavigateMethodology: () => void;
}

export const RarityReveal: React.FC<RarityRevealProps> = ({
  result,
  answers,
  challengerPayload,
  sharedViewPayload,
  onUpdateAnswer,
  onRetakeQuiz,
  onEditQuizAnswers,
  onNavigateMethodology,
}) => {
  const { language, t, localeCode } = useI18n();
  const [displayedOneInX, setDisplayedOneInX] = useState<number>(1);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const targetOneInX = sharedViewPayload ? sharedViewPayload.o : result.oneInX;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || targetOneInX <= 1) {
      setDisplayedOneInX(targetOneInX);
      return;
    }

    const durationMs = 1450;
    const startTime = performance.now();
    const logTarget = Math.log10(Math.max(1, targetOneInX));
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(Math.pow(10, logTarget * eased));
      setDisplayedOneInX(progress >= 1 ? targetOneInX : currentVal);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [targetOneInX]);

  // If viewing someone else's shared result URL (/result/[id]) without having taken the quiz yet
  if (sharedViewPayload) {
    const sharedRarityText = formatRarityLocalized(sharedViewPayload.o, language, false);
    const sharedTwinsText = `~${sharedViewPayload.t.toLocaleString(localeCode)}`;

    return (
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24 space-y-12">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12">
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.sharedEstimateTag}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-6xl">
            ~{formatShortRarityLocalized(displayedOneInX, language)}
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg">
            {t.result.sharedProfileSummary(sharedRarityText, sharedTwinsText)}
          </p>

          {sharedViewPayload.r.length > 0 && (
            <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
                {t.result.rarestInThisProfile}
              </span>
              <div className="mt-4 flex flex-wrap items-center gap-3 font-display text-lg font-bold text-[var(--text-primary)] sm:text-xl">
                {sharedViewPayload.r.map((tag, i) => (
                  <React.Fragment key={`${tag}-${i}`}>
                    {i > 0 && (
                      <span className="font-mono-tabular text-[var(--accent-bright)]">+</span>
                    )}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-[var(--text-primary)]">
                {t.result.sharedCtaTitle}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {t.result.sharedCtaSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="inline-flex min-h-[50px] items-center justify-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-7 py-3.5 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap shrink-0"
            >
              <span>{t.result.findOutYourRarity}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty / Edge State (#38): If insufficient valid answers
  if (!result.isValid) {
    return (
      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {t.result.insufficientDataTag}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {t.result.insufficientDataHeadline}
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">
          {t.result.insufficientDataSubtext}
        </p>
        <button
          type="button"
          onClick={onEditQuizAnswers}
          className="mt-8 inline-flex min-h-[50px] items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap"
        >
          <span>{t.result.answerMoreQuestions}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const formattedLiveHero = `~${formatShortRarityLocalized(displayedOneInX, language)}`;
  const localizedCleanRarity = formatRarityLocalized(result.oneInX, language, false);
  const localizedRange = `${formatRarityLocalized(
    result.uncertainty.lowerOneInX,
    language,
    false
  )} – ${formatRarityLocalized(result.uncertainty.upperOneInX, language, false)}`;
  const localizedSubComboOccurrence = formatRarityLocalized(
    result.rarestCombination.oneInX,
    language,
    true
  );
  const localizedNarrative = t.narratives[result.narrative.tier] ?? result.narrative;
  const localizedConfidenceLabel =
    t.confidenceLabels[result.confidence] ?? result.confidence;
  const localizedConfidenceExplanation =
    t.confidenceExplanations[result.confidence] ?? result.uncertainty.explanation;

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20 space-y-20">
      {/* Optional Friend Challenge Comparison Banner */}
      {challengerPayload && (
        <div className="border border-[var(--accent)]/40 bg-[var(--surface)] p-6 sm:p-8">
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.challengeComparisonTag}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:divide-x sm:divide-[var(--border-subtle)]">
            <div>
              <span className="block font-mono-tabular text-xs text-[var(--text-secondary)]">
                {t.result.yourEstimatedRarity}
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">
                ~{formatShortRarityLocalized(result.oneInX, language)}
              </span>
            </div>
            <div className="sm:pl-6">
              <span className="block font-mono-tabular text-xs text-[var(--text-secondary)]">
                {t.result.challengersRarity(challengerPayload.n)}
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-[var(--text-secondary)] sm:text-3xl">
                ~{formatShortRarityLocalized(challengerPayload.o, language)}
              </span>
            </div>
          </div>
          <p className="mt-4 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-secondary)]">
            {result.oneInX > challengerPayload.o
              ? t.result.comparisonRarer
              : result.oneInX < challengerPayload.o
              ? t.result.comparisonLessRare
              : t.result.comparisonTie}
          </p>
        </div>
      )}

      {/* 1. Primary Progressive Rarity Reveal (#15, #16, #17) */}
      <section className="relative border-b border-[var(--border-subtle)] pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-0 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular tracking-widest text-[var(--text-secondary)]">
          <span className="text-[var(--accent-bright)]">{t.result.weFoundSomething}</span>
          <span aria-hidden="true">·</span>
          <span>{t.result.yourEstimatedRarity}</span>
          {result.isDemoMode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--text-muted)]">{t.result.demoEstimateModel}</span>
            </>
          )}
        </div>

        <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-[var(--text-primary)] sm:text-7xl md:text-8xl lg:text-[92px] font-mono-tabular">
          {formattedLiveHero}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-primary)] sm:text-2xl">
          {t.result.occurrenceExplanationPrefix}{' '}
          <span className="text-[var(--accent-bright)] font-semibold">
            {localizedCleanRarity}
          </span>{' '}
          {t.result.occurrenceExplanationSuffix}
        </p>

        {/* Narrative Layer (#55) */}
        <div className="mt-8 border-l-2 border-[var(--accent)] pl-5 py-1">
          <p className="font-display text-xl font-bold text-[var(--text-primary)]">
            {localizedNarrative.headline}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)] sm:text-base max-w-xl">
            {localizedNarrative.summary}
          </p>
        </div>

        {/* Percentile & Uncertainty Metadata (#17, #27) */}
        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-3">
          {result.formattedPercentile && (
            <div>
              <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
                {t.result.estimatedPercentileLabel}
              </span>
              <p className="mt-1.5 font-mono-tabular text-2xl font-bold text-[var(--text-primary)]">
                ~{result.formattedPercentile}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {t.result.percentileExplanation(result.formattedPercentile)}
              </p>
            </div>
          )}

          <div>
            <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {t.result.estimatedRangeLabel}
            </span>
            <p className="mt-1.5 font-mono-tabular text-lg font-semibold text-[var(--text-primary)]">
              {localizedRange}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {localizedConfidenceExplanation}
            </p>
          </div>

          <div>
            <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {t.result.modelConfidenceLabel}
            </span>
            <p className="mt-1.5 font-mono-tabular text-sm font-semibold tracking-wider text-[var(--accent-bright)]">
              {localizedConfidenceLabel}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {t.result.confidenceSummary(
                result.answeredCount,
                result.correlationAdjustmentsApplied.length
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 2. YOUR RAREST COMBINATION (#18) */}
      <section aria-labelledby="rarest-combo-heading" className="space-y-6">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.intersectionHighlight}
          </p>
          <h2
            id="rarest-combo-heading"
            className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl"
          >
            {t.result.yourRarestCombination}
          </h2>
          <p className="mt-2 max-w-2xl text-base text-[var(--text-secondary)]">
            {t.result.rarestComboExplanation}
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            {result.rarestCombination.traits.map((trait, idx) => {
              const localizedShortTag =
                t.questions[trait.questionId]?.options[trait.optionId]?.shortTag ??
                trait.shortTag;
              const localizedOneInTrait = formatRarityLocalized(
                trait.oneInTrait,
                language,
                true
              );

              return (
                <React.Fragment key={trait.questionId}>
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className="font-mono-tabular text-2xl font-bold text-[var(--accent)]"
                    >
                      +
                    </span>
                  )}
                  <div className="border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-5 py-4">
                    <span className="block font-display text-xl font-extrabold tracking-wide text-[var(--text-primary)] sm:text-2xl">
                      {localizedShortTag}
                    </span>
                    <span className="mt-1 block font-mono-tabular text-xs text-[var(--text-muted)]">
                      {t.result.individualEstPrefix} {localizedOneInTrait}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-baseline">
            <span className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              {t.result.subComboOccurrence}
            </span>
            <span className="font-mono-tabular text-2xl font-bold text-[var(--accent-bright)]">
              {localizedSubComboOccurrence}
            </span>
          </div>
        </div>
      </section>

      {/* 3. HOW MANY OF YOU? & STATISTICAL TWINS (#19, #20) */}
      <section aria-label="Statistical Twins and Population Count">
        <StatisticalTwins result={result} />
      </section>

      {/* 4. CAN YOU GET RARER? (#24) */}
      <section aria-label="Can You Get Rarer Upgrade Loop">
        <BecomeRarerGame
          answers={answers}
          result={result}
          onUpdateAnswer={onUpdateAnswer}
        />
      </section>

      {/* 5. SHAREABLE RARITY CARD (#21, #22) */}
      <section aria-label="Shareable Rarity Card" className="border-t border-[var(--border-subtle)] pt-16">
        <RarityCard result={result} />
      </section>

      {/* 6. FRIEND CHALLENGE (#23) */}
      <section aria-label="Friend Challenge">
        <ChallengeCreator result={result} />
      </section>

      {/* 7. TRANSPARENT BREAKDOWN & ACTIONS */}
      <section className="border-t border-[var(--border-subtle)] pt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setShowBreakdown((prev) => !prev)}
            aria-expanded={showBreakdown}
            className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <span>
              {showBreakdown
                ? t.result.hideBreakdown(result.traitBreakdown.length)
                : t.result.showBreakdown(result.traitBreakdown.length)}
            </span>
            {showBreakdown ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onEditQuizAnswers}
              className="text-xs font-mono-tabular text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
            >
              {t.result.changeAnswers}
            </button>
            <button
              type="button"
              onClick={onNavigateMethodology}
              className="text-xs font-mono-tabular text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
            >
              {t.result.howIsThisCalculated}
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-mono-tabular text-[var(--text-primary)] transition-colors hover:border-white/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.result.startOver}</span>
            </button>
          </div>
        </div>

        {showBreakdown && (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                {t.result.modelInputBreakdown}
              </h3>
              <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                {t.result.showingPrevalenceNote}
              </span>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {result.traitBreakdown.map((item) => {
                const qTrans = t.questions[item.questionId];
                const localizedCardLabel =
                  qTrans?.options[item.optionId]?.cardLabel ?? item.cardLabel;
                const localizedPrompt = qTrans?.prompt ?? item.questionPrompt;
                const localizedOneInTrait = formatRarityLocalized(
                  item.oneInTrait,
                  language,
                  true
                );

                return (
                  <div
                    key={item.questionId}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {localizedCardLabel}{' '}
                        <span className="text-xs text-[var(--text-muted)]">
                          ({localizedPrompt})
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {item.source} · {t.result.confidenceWord}: {item.confidence}
                      </p>
                      {item.correlationNote && (
                        <p className="mt-1 text-xs text-[var(--accent-bright)]">
                          {t.result.correlationNotePrefix} {item.correlationNote}
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right font-mono-tabular shrink-0">
                      <span className="block text-sm font-semibold text-[var(--text-primary)]">
                        ~{(item.rawProbability * 100).toFixed(1)}% {t.result.baselineSuffix}
                      </span>
                      <span className="block text-xs text-[var(--text-secondary)]">
                        {localizedOneInTrait}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
