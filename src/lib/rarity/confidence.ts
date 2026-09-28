import { ConfidenceLevel, TraitContribution, UncertaintyInterval } from '../../types/rarity';
import { formatRarity } from './rarityEngine';

export function evaluateConfidence(
  traits: TraitContribution[],
  correlationsCount: number
): ConfidenceLevel {
  if (traits.length === 0) return 'LOW CONFIDENCE';

  let score = 0;
  for (const t of traits) {
    if (t.confidence === 'high') score += 3;
    else if (t.confidence === 'medium') score += 2;
    else score += 1;
  }

  const averageScore = score / traits.length;

  // If many low-confidence behavioral traits or very high dimensionality, confidence is medium or low
  if (traits.length < 5) {
    return 'LOW CONFIDENCE';
  }

  if (averageScore >= 2.35 && traits.length <= 10) {
    return 'HIGH CONFIDENCE';
  }

  if (averageScore >= 1.65 && correlationsCount <= 4) {
    return 'MEDIUM CONFIDENCE';
  }

  return 'LOW CONFIDENCE';
}

export function computeUncertaintyInterval(
  oneInX: number,
  confidence: ConfidenceLevel,
  traitsCount: number
): UncertaintyInterval {
  // Uncertainty widens as more traits are multiplied or confidence decreases
  const baseSpread =
    confidence === 'HIGH CONFIDENCE'
      ? 0.25
      : confidence === 'MEDIUM CONFIDENCE'
      ? 0.38
      : 0.52;

  const dimensionalitySpread = Math.min(0.25, Math.max(0, (traitsCount - 6) * 0.02));
  const totalSpread = Math.min(0.65, baseSpread + dimensionalitySpread);

  const lowerOneInX = Math.max(1, Math.round(oneInX * (1 - totalSpread)));
  const upperOneInX = Math.max(lowerOneInX + 1, Math.round(oneInX * (1 + totalSpread * 1.35)));

  const lowerClean = formatRarity(lowerOneInX, false);
  const upperClean = formatRarity(upperOneInX, false);

  const explanation =
    confidence === 'HIGH CONFIDENCE'
      ? 'Anchored primarily by broad demographic distributions with established baseline frequencies.'
      : confidence === 'MEDIUM CONFIDENCE'
      ? 'Your estimate has moderate statistical uncertainty because some characteristics rely on broad population approximations.'
      : 'This estimate spans a wider interval because multi-trait behavioral intersections carry higher statistical variance.';

  return {
    lowerOneInX,
    upperOneInX,
    formattedRange: `${lowerClean} – ${upperClean}`,
    explanation,
  };
}
