import React from 'react';
import { RarityResult } from '../types/rarity';
import { formatShortRarityLocalized, useI18n } from '../lib/i18n';
import { ShareButton } from './ShareButton';

interface RarityCardProps {
  result: RarityResult;
}

export const RarityCard: React.FC<RarityCardProps> = ({ result }) => {
  const { language, t, localeCode } = useI18n();
  const combinationTraits = result.rarestCombination.traits.slice(0, 4);

  const localizedHeroRarity = formatShortRarityLocalized(result.oneInX, language);
  const localizedTwins = `~${result.statisticalTwins.toLocaleString(localeCode)}`;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
      {/* Vertical Mobile-Screenshot-Ready Rarity Card */}
      <div className="lg:col-span-5 flex justify-center">
        <article
          aria-label="Shareable Rarity Summary Card"
          className="relative w-full max-w-[380px] border border-[var(--border)] bg-[var(--surface-inset)] p-7 sm:p-8 shadow-[0_0_60px_rgba(139,92,246,0.12)]"
        >
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <span className="font-display text-xs font-bold tracking-wider text-[var(--text-primary)]">
              {t.brand.name}
            </span>
            <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
              {result.isDemoMode ? 'DEMO' : t.result.estimatedLabel}
            </span>
          </div>

          {/* Primary Rarity Figure */}
          <div className="py-7 border-b border-[var(--border-subtle)]">
            <span className="block font-mono-tabular text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
              {t.result.yourEstimatedRarity}
            </span>
            <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              ~{localizedHeroRarity}
            </p>
          </div>

          {/* Rarest Combination List */}
          <div className="py-6 border-b border-[var(--border-subtle)]">
            <span className="block font-mono-tabular text-[11px] uppercase tracking-widest text-[var(--accent-bright)]">
              {t.result.yourRarestCombination}
            </span>
            <ul className="mt-3.5 space-y-2 text-sm font-medium text-[var(--text-primary)]">
              {combinationTraits.map((trait, index) => {
                const localizedCardLabel =
                  t.questions[trait.questionId]?.options[trait.optionId]?.cardLabel ??
                  trait.cardLabel;
                return (
                  <li key={trait.questionId} className="flex items-center gap-2.5">
                    <span className="font-mono-tabular text-xs text-[var(--accent-bright)]">
                      {index === 0 ? '•' : '+'}
                    </span>
                    <span>{localizedCardLabel}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Statistical Twins */}
          <div className="py-6 border-b border-[var(--border-subtle)]">
            <span className="block font-mono-tabular text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
              {t.result.estimatedStatisticalTwins}
            </span>
            <p className="mt-1.5 font-mono-tabular text-2xl font-bold text-[var(--text-primary)]">
              {localizedTwins}
            </p>
          </div>

          {/* Card Footer */}
          <div className="pt-4 flex items-center justify-between text-[11px] font-mono-tabular text-[var(--text-muted)]">
            <span>howrareareyou.com</span>
            <span>{t.result.noPiiStored}</span>
          </div>
        </article>
      </div>

      {/* Share Controls & Context */}
      <div className="lg:col-span-7 space-y-6">
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
          {t.result.shareCardTag}
        </p>
        <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          {t.result.shareCardHeadline}
        </h3>
        <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
          {t.result.shareCardBody}
        </p>

        <div className="pt-2">
          <ShareButton result={result} />
        </div>
      </div>
    </div>
  );
};
