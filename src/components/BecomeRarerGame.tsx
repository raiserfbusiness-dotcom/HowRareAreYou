import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { QuizAnswers } from '../types/quiz';
import { RarityResult } from '../types/rarity';
import { BONUS_QUESTIONS } from '../lib/rarity/questions';
import { trackEvent } from '../lib/analytics';
import {
  formatRarityLocalized,
  localizeQuestion,
  useI18n,
} from '../lib/i18n';

interface BecomeRarerGameProps {
  answers: QuizAnswers;
  result: RarityResult;
  onUpdateAnswer: (questionId: string, optionId: string) => void;
}

export const BecomeRarerGame: React.FC<BecomeRarerGameProps> = ({
  answers,
  result,
  onUpdateAnswer,
}) => {
  const { language, t, localeCode } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const answeredBonusCount = BONUS_QUESTIONS.filter((q) => Boolean(answers[q.id])).length;

  const handleOpenUpgrade = () => {
    setIsExpanded(true);
    trackEvent('rarity_upgrade_started', { currentBonusCount: answeredBonusCount });
  };

  const handleSelectBonus = (questionId: string, optionId: string) => {
    const wasAlreadyAnswered = Boolean(answers[questionId]);
    onUpdateAnswer(questionId, optionId);

    const nextCount = wasAlreadyAnswered ? answeredBonusCount : answeredBonusCount + 1;
    if (nextCount === BONUS_QUESTIONS.length) {
      trackEvent('rarity_upgrade_completed', { totalBonus: nextCount });
    }
  };

  const localizedLiveRarity = formatRarityLocalized(
    result.oneInX,
    language,
    true
  ).toUpperCase();
  const localizedTwins = `~${result.statisticalTwins.toLocaleString(localeCode)}`;

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.upgradeLoopTag(answeredBonusCount, BONUS_QUESTIONS.length)}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            {t.result.canYouGetRarer}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {t.result.upgradeDescription(BONUS_QUESTIONS.length)}
          </p>
        </div>

        {!isExpanded && (
          <button
            type="button"
            onClick={handleOpenUpgrade}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-[var(--accent)] bg-[var(--accent)]/20 px-6 py-3 text-xs font-semibold tracking-widest text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:text-white whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t.result.keepGoing}</span>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-8 space-y-8 border-t border-[var(--border-subtle)] pt-8">
          {/* Live Inline Rarity Readout */}
          <div className="flex flex-col justify-between gap-4 border border-[var(--accent)]/40 bg-[var(--surface-inset)] p-5 sm:flex-row sm:items-center">
            <div>
              <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                {t.result.currentLiveEstimate(result.answeredCount)}
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-[var(--accent-bright)] sm:text-3xl">
                {localizedLiveRarity}
              </span>
            </div>
            <div className="text-left sm:text-right font-mono-tabular text-xs text-[var(--text-secondary)]">
              <span>{t.result.estimatedStatisticalTwins}: </span>
              <strong className="text-[var(--text-primary)]">{localizedTwins}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {BONUS_QUESTIONS.map((rawQ) => {
              const q = localizeQuestion(rawQ, language);
              const currentSelection = answers[q.id];
              return (
                <div
                  key={q.id}
                  className="border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular text-[var(--text-muted)]">
                      <span>{t.result.bonusCharacteristic}</span>
                      {currentSelection && (
                        <span className="text-[var(--accent-bright)]">
                          {t.result.activeInModel}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                      {q.prompt}
                    </h4>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = currentSelection === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectBonus(q.id, opt.id)}
                          aria-pressed={isSelected}
                          className={`flex items-center justify-between border px-3.5 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'border-[var(--accent-bright)] bg-[var(--accent)]/20 text-[var(--text-primary)] font-medium'
                              : 'border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-white/30 hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-[var(--accent-bright)] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            {t.result.upgradeDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
