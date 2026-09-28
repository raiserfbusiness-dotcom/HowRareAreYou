import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, useI18n } from '../lib/i18n';

interface HeroProps {
  onStartQuiz: () => void;
  onResumeQuiz?: () => void;
  onViewLastResult?: () => void;
  savedAnswerCount?: number;
  hasPreviousResult?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onStartQuiz,
  onResumeQuiz,
  onViewLastResult,
  savedAnswerCount = 0,
  hasPreviousResult = false,
}) => {
  const { language, setLanguage, t } = useI18n();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(4);

  const cascadeSteps = t.hero.cascadeSteps;

  return (
    <div className="relative z-10 flex flex-col">
      {/* Primary Viewport Hero */}
      <section className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-5xl flex-col justify-center px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl font-extrabold leading-[0.96] tracking-tight text-[var(--text-primary)] sm:text-7xl md:text-8xl lg:text-[96px]">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
          </h1>

          <div className="mt-8 max-w-xl space-y-2 text-lg leading-relaxed text-[var(--text-secondary)] sm:text-2xl">
            <p className="text-[var(--text-primary)] font-medium">
              {t.hero.subtitleLine1}
            </p>
            <p>{t.hero.subtitleLine2}</p>
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStartQuiz}
              className="group relative inline-flex min-h-[52px] items-center justify-center gap-4 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-sm font-semibold tracking-widest text-white transition-all duration-150 hover:bg-[var(--accent-bright)] hover:border-[var(--accent-bright)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-bright)] whitespace-nowrap"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            {savedAnswerCount > 0 && savedAnswerCount < 12 && onResumeQuiz && (
              <button
                type="button"
                onClick={onResumeQuiz}
                className="inline-flex min-h-[52px] items-center justify-center border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-xs font-medium tracking-wider text-[var(--text-secondary)] transition-colors hover:border-white/30 hover:text-[var(--text-primary)] whitespace-nowrap"
              >
                {t.hero.ctaResume(savedAnswerCount)}
              </button>
            )}

            {hasPreviousResult && onViewLastResult && (
              <button
                type="button"
                onClick={onViewLastResult}
                className="inline-flex min-h-[52px] items-center justify-center border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-xs font-medium tracking-wider text-[var(--text-secondary)] transition-colors hover:border-white/30 hover:text-[var(--text-primary)] whitespace-nowrap"
              >
                {t.hero.ctaLastResult}
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            {t.hero.noAccountNote}
          </p>
        </div>
      </section>

      {/* Editorial Narrative & Interactive Combination Demonstration */}
      <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)]/85 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
                {t.hero.section01Tag}
              </p>
              <div className="space-y-3 font-display text-3xl font-bold leading-tight text-[var(--text-secondary)] sm:text-4xl">
                <p className="text-[var(--text-primary)]">{t.hero.commonBirthday}</p>
                <p className="text-[var(--text-primary)]">{t.hero.commonHeight}</p>
                <p className="text-[var(--text-primary)]">{t.hero.commonHabits}</p>
                <p className="pt-2 text-[var(--accent-bright)]">
                  {t.hero.combineQuestion}
                </p>
              </div>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-prose">
                {t.hero.combineBody}
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="inline-flex min-h-[48px] items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-xs font-semibold tracking-widest text-[var(--text-primary)] transition-all duration-150 hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] whitespace-nowrap"
                >
                  <span>{t.hero.ctaSecondary}</span>
                  <ArrowRight className="h-4 w-4 text-[var(--accent-bright)]" />
                </button>
              </div>
            </div>

            {/* Interactive Filtering Funnel Preview */}
            <div className="lg:col-span-6">
              <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <span className="text-xs font-mono-tabular text-[var(--text-secondary)]">
                    {t.hero.cascadeHeader}
                  </span>
                  <span className="text-xs font-mono-tabular text-[var(--accent-bright)]">
                    {cascadeSteps[activeStepIndex]?.oneIn}
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  {cascadeSteps.map((step, idx) => {
                    const isActive = idx <= activeStepIndex;
                    return (
                      <button
                        key={step.trait}
                        type="button"
                        onClick={() => setActiveStepIndex(idx)}
                        className={`w-full text-left p-3.5 transition-colors border ${
                          idx === activeStepIndex
                            ? 'border-[var(--accent)] bg-[var(--surface-elevated)]'
                            : isActive
                            ? 'border-[var(--border-subtle)] bg-[var(--surface-inset)]'
                            : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {step.trait}
                          </span>
                          <span className="font-mono-tabular text-xs text-[var(--text-secondary)] shrink-0">
                            {step.remaining} {t.hero.cascadePeopleSuffix}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-5 text-xs text-[var(--text-muted)]">
                  {t.hero.cascadeHint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concise Keyword Grouping & International SEO Discovery */}
      <section
        aria-label="Related Topics and Discovery"
        className="border-t border-[var(--border-subtle)] bg-[var(--background)] py-12"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
              {t.hero.seoSectionTitle}
            </p>

            {/* Quick Language Switcher Pill Links for International SEO */}
            <div className="flex items-center gap-3 font-mono-tabular text-[11px] text-[var(--text-muted)]">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  lang={item.code}
                  onClick={() => setLanguage(item.code as Language)}
                  className={`transition-colors hover:text-[var(--text-primary)] ${
                    language === item.code
                      ? 'text-[var(--accent-bright)] font-semibold'
                      : ''
                  }`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs leading-relaxed text-[var(--text-muted)]">
            <div>
              <h2 className="font-mono-tabular text-[11px] font-medium text-[var(--text-secondary)]">
                {t.hero.seoGroup1Title}
              </h2>
              <p className="mt-1.5">{t.hero.seoGroup1Body}</p>
            </div>

            <div>
              <h2 className="font-mono-tabular text-[11px] font-medium text-[var(--text-secondary)]">
                {t.hero.seoGroup2Title}
              </h2>
              <p className="mt-1.5">{t.hero.seoGroup2Body}</p>
            </div>

            <div>
              <h2 className="font-mono-tabular text-[11px] font-medium text-[var(--text-secondary)]">
                {t.hero.seoGroup3Title}
              </h2>
              <p className="mt-1.5">{t.hero.seoGroup3Body}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
