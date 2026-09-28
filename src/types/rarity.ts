export type ConfidenceLevel = 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';

export type RarityTier =
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'VERY RARE'
  | 'EXTREMELY RARE';

export interface DistributionMetadata {
  attribute: string;
  label: string;
  prevalence: Record<string, number>;
  source: string;
  year: number;
  population: string;
  geography: string;
  methodology: string;
  confidence: 'high' | 'medium' | 'low';
  isDemoEstimate?: boolean;
}

export interface TraitContribution {
  questionId: string;
  questionPrompt: string;
  optionId: string;
  optionLabel: string;
  shortTag: string;
  cardLabel: string;
  rawProbability: number;
  adjustedProbability: number;
  oneInTrait: number;
  confidence: 'high' | 'medium' | 'low';
  correlationNote?: string;
  source: string;
}

export interface RarestCombinationResult {
  traits: TraitContribution[];
  combinedProbability: number;
  oneInX: number;
  formattedOccurrence: string;
  explanation: string;
}

export interface UncertaintyInterval {
  lowerOneInX: number;
  upperOneInX: number;
  formattedRange: string;
  explanation: string;
}

export interface RarityNarrative {
  tier: RarityTier;
  headline: string;
  summary: string;
}

export interface RarityResult {
  isValid: boolean;
  invalidReason?: string;
  referencePopulation: number;
  answeredCount: number;
  coreAnsweredCount: number;
  bonusAnsweredCount: number;
  combinedProbability: number;
  oneInX: number;
  formattedRarity: string; // e.g., "~1 in 2.7 million"
  shortRarityValue: string; // e.g., "1 IN 2.7 MILLION"
  percentile: number | null; // e.g., 99.963
  formattedPercentile: string | null; // e.g., "99.96%"
  statisticalTwins: number; // Estimated people on Earth with a similar profile
  formattedTwins: string; // e.g., "~2,184"
  howManyOfYou: number; // Cleanly rounded estimate for the "HOW MANY OF YOU?" feature
  formattedHowMany: string; // e.g., "2,700"
  confidence: ConfidenceLevel;
  uncertainty: UncertaintyInterval;
  rarestCombination: RarestCombinationResult;
  narrative: RarityNarrative;
  traitBreakdown: TraitContribution[];
  correlationAdjustmentsApplied: string[];
  isDemoMode: boolean;
}

export interface SharePayload {
  v: number; // schema version
  o: number; // oneInX (rounded)
  t: number; // statisticalTwins
  c: ConfidenceLevel;
  r: string[]; // up to 4 shortTags for rarest combination
  l: string[]; // up to 4 cardLabels for rarest combination
  rO: number; // rarest combination oneInX
  n?: string; // optional challenger alias (non-sensitive)
}
