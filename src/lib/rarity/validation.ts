import { QuizAnswers } from '../../types/quiz';
import { ALL_QUESTIONS, CORE_QUESTIONS } from './questions';
import { DISTRIBUTIONS } from './distributions';

export interface ValidationResult {
  isValid: boolean;
  validAnswers: QuizAnswers;
  coreCount: number;
  bonusCount: number;
  totalCount: number;
  reason?: string;
}

export const MIN_REQUIRED_QUESTIONS = 3;

export function validateQuizAnswers(answers: QuizAnswers | null | undefined): ValidationResult {
  if (!answers || typeof answers !== 'object') {
    return {
      isValid: false,
      validAnswers: {},
      coreCount: 0,
      bonusCount: 0,
      totalCount: 0,
      reason: "You're unusual in ways we can't reliably measure yet. We need a little more information.",
    };
  }

  const validAnswers: QuizAnswers = {};
  let coreCount = 0;
  let bonusCount = 0;

  for (const question of ALL_QUESTIONS) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId || typeof selectedOptionId !== 'string') continue;

    const optionExists = question.options.some((opt) => opt.id === selectedOptionId);
    const distribution = DISTRIBUTIONS[question.id];
    const prevalenceExists =
      distribution && typeof distribution.prevalence[selectedOptionId] === 'number';

    if (optionExists && prevalenceExists) {
      validAnswers[question.id] = selectedOptionId;
      if (question.tier === 'core') {
        coreCount++;
      } else {
        bonusCount++;
      }
    }
  }

  const totalCount = coreCount + bonusCount;

  if (totalCount < MIN_REQUIRED_QUESTIONS) {
    return {
      isValid: false,
      validAnswers,
      coreCount,
      bonusCount,
      totalCount,
      reason: "You're unusual in ways we can't reliably measure yet. We need a little more information.",
    };
  }

  return {
    isValid: true,
    validAnswers,
    coreCount,
    bonusCount,
    totalCount,
  };
}

export function isCoreQuizComplete(answers: QuizAnswers): boolean {
  return CORE_QUESTIONS.every((q) => Boolean(answers[q.id]));
}
