import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CORRELATION_RULES, DISTRIBUTIONS } from '../lib/rarity/distributions';
import { useI18n } from '../lib/i18n';

interface EditorialPageProps {
  onStartQuiz: () => void;
}

export const AboutPage: React.FC<EditorialPageProps> = ({ onStartQuiz }) => {
  const { t } = useI18n();
  const c = t.pages.about;

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24 space-y-12">
      <div>
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {c.tag}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          {c.title}
        </h1>
      </div>

      <div className="space-y-6 text-lg leading-relaxed text-[var(--text-secondary)]">
        <p className="text-[var(--text-primary)] font-medium text-xl">
          {c.lead}
        </p>

        <div className="border-l-2 border-[var(--accent)] pl-6 py-1 space-y-2 text-[var(--text-primary)]">
          <p>{c.bullet1}</p>
          <p>{c.bullet2}</p>
          <p>{c.bullet3}</p>
        </div>

        <p>{c.combinationsDifferent}</p>
        <p>{c.body1}</p>
        <p>{c.body2}</p>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-3">
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
          {c.honestyTag}
        </p>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {c.honestyBody}
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onStartQuiz}
          className="inline-flex min-h-[50px] items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap"
        >
          <span>{c.cta}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export const MethodologyPage: React.FC<EditorialPageProps> = ({ onStartQuiz }) => {
  const { t } = useI18n();
  const c = t.pages.methodology;
  const distributionList = Object.values(DISTRIBUTIONS);

  return (
    <article className="relative z-10 mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24 space-y-16">
      <div>
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {c.tag}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          {c.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
          {c.subtitle}
        </p>
      </div>

      {/* 4 Core Methodology Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <span className="font-mono-tabular text-xs text-[var(--accent-bright)]">
            {c.card1Tag}
          </span>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            {c.card1Title}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {c.card1Body}
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <span className="font-mono-tabular text-xs text-[var(--accent-bright)]">
            {c.card2Tag}
          </span>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            {c.card2Title}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {c.card2Body}
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <span className="font-mono-tabular text-xs text-[var(--accent-bright)]">
            {c.card3Tag}
          </span>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            {c.card3Title}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {c.card3Body}
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <span className="font-mono-tabular text-xs text-[var(--accent-bright)]">
            {c.card4Tag}
          </span>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            {c.card4Title}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {c.card4Body}
          </p>
        </div>
      </div>

      {/* Active Correlation Adjustments Table */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {c.rulesTitle}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">{c.rulesSubtitle}</p>
        <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border)] bg-[var(--surface)]">
          {CORRELATION_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-mono-tabular text-xs text-[var(--accent-bright)]">
                  {rule.primaryQuestionId} → {rule.dependentQuestionId}
                </p>
                <p className="mt-1 text-sm text-[var(--text-primary)]">
                  {rule.explanation}
                </p>
              </div>
              <span className="font-mono-tabular text-xs text-[var(--text-muted)] shrink-0">
                {rule.conditionalProbabilityMultiplier}
                {c.conditionalAdjustmentSuffix}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution Metadata Explorer */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {c.distributionsTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {distributionList.map((dist) => (
            <div
              key={dist.attribute}
              className="border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono-tabular text-xs">
                  <span className="text-[var(--text-secondary)]">
                    {dist.label.toUpperCase()}
                  </span>
                  <span className="text-[var(--accent-bright)]">
                    {dist.confidence.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {dist.source} ({dist.year}) · {dist.geography}
                </p>

                <div className="mt-4 space-y-1.5">
                  {Object.entries(dist.prevalence).map(([key, val]) => {
                    const localizedOptLabel =
                      t.questions[dist.attribute]?.options[key]?.label ?? key;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between font-mono-tabular text-xs gap-2"
                      >
                        <span className="text-[var(--text-secondary)] truncate">
                          {localizedOptLabel}
                        </span>
                        <span className="text-[var(--text-primary)] shrink-0">
                          {(val * 100).toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-muted)]">
                {dist.methodology}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4">
        <button
          type="button"
          onClick={onStartQuiz}
          className="inline-flex min-h-[50px] items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap"
        >
          <span>{c.cta}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export const PrivacyPage: React.FC<EditorialPageProps> = ({ onStartQuiz }) => {
  const { t } = useI18n();
  const c = t.pages.privacy;

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24 space-y-10">
      <div>
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {c.tag}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          {c.title}
        </h1>
        <p className="mt-4 text-xl font-medium text-[var(--text-primary)]">
          {c.quote}
        </p>
      </div>

      <div className="space-y-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {c.card1Title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{c.card1Body}</p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {c.card2Title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{c.card2Body}</p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {c.card3Title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{c.card3Body}</p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {c.card4Title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{c.card4Body}</p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onStartQuiz}
          className="inline-flex min-h-[50px] items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap"
        >
          <span>{c.cta}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export const ContactPage: React.FC<EditorialPageProps> = ({ onStartQuiz }) => {
  const { t } = useI18n();
  const c = t.pages.contact;

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24 space-y-10">
      <div>
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {c.tag}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          {c.title}
        </h1>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10 space-y-6">
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          {c.body}
        </p>

        <div className="space-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono-tabular text-sm">
          <div>
            <span className="block text-xs text-[var(--text-muted)]">
              {c.editorialLabel}
            </span>
            <span className="text-[var(--text-primary)]">research@howrareareyou.com</span>
          </div>
          <div className="pt-2">
            <span className="block text-xs text-[var(--text-muted)]">
              {c.generalLabel}
            </span>
            <span className="text-[var(--text-primary)]">hello@howrareareyou.com</span>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onStartQuiz}
          className="inline-flex min-h-[50px] items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-xs font-semibold tracking-widest text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] whitespace-nowrap"
        >
          <span>{c.cta}</span>
          <ArrowRight className="h-4 w-4 text-[var(--accent-bright)]" />
        </button>
      </div>
    </article>
  );
};
