import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Share2 } from 'lucide-react';
import { RarityResult, SharePayload } from '../types/rarity';
import { buildChallengeShareUrl, encodeShareToken } from '../lib/share';
import { trackEvent } from '../lib/analytics';
import {
  formatRarityLocalized,
  formatShortRarityLocalized,
  useI18n,
} from '../lib/i18n';

interface ChallengeCreatorProps {
  result: RarityResult;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ result }) => {
  const { language, t } = useI18n();
  const [alias, setAlias] = useState('');
  const [copied, setCopied] = useState(false);

  const token = encodeShareToken(result, alias);
  const challengeUrl = buildChallengeShareUrl(token, language);
  const localizedRarity = formatRarityLocalized(result.oneInX, language, true);

  const handleCopyChallenge = async () => {
    trackEvent('challenge_created', { hasAlias: Boolean(alias.trim()), lang: language });
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3500);
    } catch {
      // Fallback if clipboard denied
    }
  };

  const handleNativeChallengeShare = async () => {
    trackEvent('challenge_created', { method: 'native_share', lang: language });
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: t.result.challengeShareTitle,
          text: t.result.challengeShareText(localizedRarity),
          url: challengeUrl,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    await handleCopyChallenge();
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-3">
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.challengeTag}
          </p>
          <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            {t.result.thinkYoureRarer}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {t.result.challengeDescription}
          </p>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div>
            <label
              htmlFor="challenger-alias-input"
              className="block font-mono-tabular text-xs text-[var(--text-secondary)] mb-2"
            >
              {t.result.optionalDisplayName}
            </label>
            <input
              id="challenger-alias-input"
              type="text"
              maxLength={24}
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder={t.result.aliasPlaceholder}
              className="w-full border border-[var(--border)] bg-[var(--surface-inset)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleNativeChallengeShare}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-xs font-semibold tracking-widest text-white transition-all duration-150 hover:bg-[var(--accent-bright)] whitespace-nowrap"
            >
              <Share2 className="h-4 w-4" />
              <span>{t.result.challengeAFriend}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyChallenge}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-[var(--border)] bg-[var(--surface-inset)] px-5 py-3 text-xs font-medium tracking-wider text-[var(--text-primary)] transition-colors hover:border-white/30 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[var(--accent-bright)]" />
                  <span>{t.result.challengeLinkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span>{t.result.copyLink}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChallengeLandingProps {
  challengerPayload: SharePayload | null;
  onAcceptChallenge: () => void;
}

export const ChallengeLanding: React.FC<ChallengeLandingProps> = ({
  challengerPayload,
  onAcceptChallenge,
}) => {
  const { language, t, localeCode } = useI18n();

  if (!challengerPayload) {
    return (
      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
          {t.result.incomingChallengeTag}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {t.result.challengedYou(t.result.someone)}
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)]">
          {t.result.incompleteChallengeBody}
        </p>
        <button
          type="button"
          onClick={onAcceptChallenge}
          className="mt-8 inline-flex min-h-[52px] items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-[var(--accent-bright)] whitespace-nowrap"
        >
          <span>{t.hero.ctaPrimary}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const challengerName = challengerPayload.n ? challengerPayload.n : t.result.someone;

  return (
    <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-3xl flex-col justify-center px-5 py-16 sm:px-8">
      <div className="space-y-8">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
            {t.result.incomingChallengeTag}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
            {t.result.challengedYou(challengerName)}
          </h1>
          <p className="mt-3 font-display text-2xl font-medium text-[var(--text-secondary)] sm:text-3xl">
            {t.result.thinkYoureRarer}
          </p>
        </div>

        {/* Challenger Summary Card (Privacy-Safe) */}
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-baseline">
            <span className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              {t.result.theirEstimatedRarity}
            </span>
            <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
              ~{challengerPayload.t.toLocaleString(localeCode)} {t.result.estimatedStatisticalTwins.toLowerCase()}
            </span>
          </div>

          <p className="mt-5 font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
            ~{formatShortRarityLocalized(challengerPayload.o, language)}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {t.result.estimatedOccurrenceLabel}{' '}
            {formatRarityLocalized(challengerPayload.o, language, true)}
          </p>

          {challengerPayload.l.length > 0 && (
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
              <span className="block font-mono-tabular text-xs uppercase tracking-widest text-[var(--text-muted)]">
                {t.result.theirRarestCombination}
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-primary)]">
                {challengerPayload.l.map((label, idx) => (
                  <React.Fragment key={`${label}-${idx}`}>
                    {idx > 0 && (
                      <span className="font-mono-tabular text-[var(--accent-bright)]">+</span>
                    )}
                    <span>{label}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onAcceptChallenge}
            className="group inline-flex min-h-[54px] items-center gap-4 border border-[var(--accent)] bg-[var(--accent)] px-9 py-4 text-sm font-semibold tracking-widest text-white transition-all duration-150 hover:bg-[var(--accent-bright)] whitespace-nowrap"
          >
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {t.result.challengeTakes60s}
          </p>
        </div>
      </div>
    </section>
  );
};
