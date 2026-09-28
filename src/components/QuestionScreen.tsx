import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Question } from '../types/quiz';
import { localizeQuestion, useI18n } from '../lib/i18n';
import { ProgressBar } from './ProgressBar';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectAnswer,
  onBack,
  canGoBack,
}) => {
  const { language, t } = useI18n();
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);

  const localizedQuestion = localizeQuestion(question, language);
  const categoryLabel =
    t.questions[question.id]?.categoryLabel ?? localizedQuestion.category;

  useEffect(() => {
    setPendingOptionId(null);
  }, [question.id]);

  const handleChoose = (optionId: string) => {
    if (pendingOptionId) return;
    setPendingOptionId(optionId);
    onSelectAnswer(question.id, optionId);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Backspace' && canGoBack) {
        e.preventDefault();
        onBack();
        return;
      }

      const numIdx = parseInt(e.key, 10);
      if (
        !Number.isNaN(numIdx) &&
        numIdx >= 1 &&
        numIdx <= localizedQuestion.options.length
      ) {
        e.preventDefault();
        handleChoose(localizedQuestion.options[numIdx - 1].id);
        return;
      }

      const code = e.key.toUpperCase().charCodeAt(0) - 65;
      if (e.key.length === 1 && code >= 0 && code < localizedQuestion.options.length) {
        e.preventDefault();
        handleChoose(localizedQuestion.options[code].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const isCompactGrid = localizedQuestion.options.length > 6;

  return (
    <section
      aria-labelledby={`question-heading-${localizedQuestion.id}`}
      className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-4xl flex-col justify-between px-5 py-8 sm:px-8 sm:py-12"
    >
      {/* Top Progress & Back Control */}
      <div className="space-y-6">
        <ProgressBar currentIndex={currentIndex} totalCount={totalQuestions} />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className={`inline-flex items-center gap-2 py-1.5 text-xs font-mono-tabular tracking-wider transition-colors ${
              canGoBack
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.quiz.previous}</span>
          </button>

          <span className="text-xs font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Main Question Prompt & Interactive Options */}
      <div className="my-auto py-8 sm:py-12">
        <h1
          id={`question-heading-${localizedQuestion.id}`}
          className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-[52px]"
        >
          {localizedQuestion.prompt}
        </h1>

        {localizedQuestion.subtitle && (
          <p className="mt-3 max-w-xl text-sm text-[var(--text-secondary)] sm:text-base">
            {localizedQuestion.subtitle}
          </p>
        )}

        <div
          className={`mt-10 grid gap-3 ${
            isCompactGrid
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
              : localizedQuestion.options.length >= 5
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {localizedQuestion.options.map((option, idx) => {
            const isSelected =
              pendingOptionId === option.id ||
              (!pendingOptionId && selectedOptionId === option.id);
            const keyHint =
              idx < 9 ? String(idx + 1) : String.fromCharCode(65 + idx);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChoose(option.id)}
                aria-pressed={isSelected}
                className={`group relative flex min-h-[58px] w-full items-center justify-between gap-4 border px-5 py-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-bright)] ${
                  isSelected
                    ? 'border-[var(--accent-bright)] bg-[var(--accent)]/20 text-[var(--text-primary)] scale-[0.99]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-white/35 hover:bg-[var(--surface-elevated)] active:scale-[0.99]'
                }`}
              >
                <div className="flex items-baseline gap-3.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className={`font-mono-tabular text-xs transition-colors shrink-0 ${
                      isSelected
                        ? 'text-[var(--accent-bright)]'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {keyHint}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-base font-medium sm:text-lg">
                      {option.label}
                    </span>
                    {option.subtext && (
                      <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                        {option.subtext}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                    isSelected
                      ? 'border-[var(--accent-bright)] bg-[var(--accent)] text-white'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Keyboard & Privacy Microcopy */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
        <span className="hidden sm:inline font-mono-tabular">
          {t.quiz.keyboardHint(Math.min(9, localizedQuestion.options.length))}
        </span>
        <span>{t.quiz.localCalculationNote}</span>
      </div>
    </section>
  );
};
