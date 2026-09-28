export type QuestionTier = 'core' | 'bonus';

export interface QuestionOption {
  id: string;
  label: string;
  shortTag: string; // Used in "YOUR RAREST COMBINATION" & Share Card (e.g., "LEFT-HANDED", "NOVEMBER")
  cardLabel: string; // Used in bullet list on Rarity Card (e.g., "Born in November", "Left-handed")
  subtext?: string;
}

export interface Question {
  id: string;
  tier: QuestionTier;
  numberLabel: string;
  prompt: string;
  subtitle?: string;
  category: 'demographics' | 'biology' | 'chronobiology' | 'behavior' | 'culture';
  options: QuestionOption[];
}

export type QuizAnswers = Record<string, string>;
