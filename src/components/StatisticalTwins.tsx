import React from 'react';
import { RarityResult } from '../types/rarity';
import { useI18n } from '../lib/i18n';

interface StatisticalTwinsProps {
  result: RarityResult;
}

export const StatisticalTwins: React.FC<StatisticalTwinsProps> = ({ result }) => {
  const { t, localeCode } = useI18n();

  const totalDots = 120;
  const activeDots =
    result.oneInX >= 100_000
      ? 1
      : result.oneInX >= 10_000
      ? 2
      : result.oneInX >= 1_000
      ? 4
      : 8;

  const localizedHowMany = result.howManyOfYou.toLocaleString(localeCode);
  const localizedTwins = `~${result.statisticalTwins.toLocaleString(localeCode)}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* #20: "HOW MANY OF YOU?" FEATURE */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10 flex flex-col justify-between">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {t.result.howManyTitle}
          </p>

          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {t.result.howManyIntroLine1}
            <br />
            {t.result.howManyIntroLine2}
          </p>

          <div className="my-8">
            <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl md:text-7xl font-mono-tabular">
              ~{localizedHowMany}
            </span>
          </div>

          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            {t.result.howManyOutro}
          </p>
        </div>

        <p className="mt-8 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
          {t.result.howManyFooter}
        </p>
      </div>

      {/* #19: STATISTICAL TWIN FEATURE */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10 flex flex-col justify-between">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.somewhereOnEarth}
          </p>

          <h3 className="mt-3 font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {t.result.twinsHeadline}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {t.result.twinsSubtext}
          </p>

          <div className="mt-7 border-t border-b border-[var(--border-subtle)] py-6">
            <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {t.result.estimatedStatisticalTwins}
            </span>
            <span className="mt-2 block font-mono-tabular text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
              {localizedTwins}
            </span>
          </div>

          {/* Visual Scarcity Matrix */}
          <div
            aria-hidden="true"
            className="mt-6 grid grid-cols-15 gap-1.5 sm:grid-cols-20"
          >
            {Array.from({ length: totalDots }).map((_, i) => {
              const isHighlighted = i < activeDots;
              return (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    isHighlighted
                      ? 'bg-[var(--accent-bright)] shadow-[0_0_8px_rgba(167,139,250,0.9)]'
                      : 'bg-white/15'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-[var(--text-muted)]">
          {t.result.twinsDisclaimer}
        </p>
      </div>
    </div>
  );
};
