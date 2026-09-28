import React, { useState } from 'react';
import { Check, Copy, Download, Share2 } from 'lucide-react';
import { RarityResult } from '../types/rarity';
import {
  buildResultShareUrl,
  encodeShareToken,
  generateRarityCardDataUrl,
} from '../lib/share';
import { trackEvent } from '../lib/analytics';
import { formatRarityLocalized, useI18n } from '../lib/i18n';

interface ShareButtonProps {
  result: RarityResult;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ result }) => {
  const { language, t, localeCode } = useI18n();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const shareToken = encodeShareToken(result);
  const shareUrl = buildResultShareUrl(shareToken, language);

  const localizedRarity = formatRarityLocalized(result.oneInX, language, true);
  const localizedTwins = `~${result.statisticalTwins.toLocaleString(localeCode)}`;

  const handleCopyLink = async () => {
    trackEvent('share_clicked', { method: 'copy_link', lang: language });
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareStatus(t.result.statusLinkCopied);
      trackEvent('share_completed', { method: 'copy_link', lang: language });
      window.setTimeout(() => {
        setCopied(false);
        setShareStatus(null);
      }, 3000);
    } catch {
      setShareStatus(t.result.statusClipboardError);
    }
  };

  const handleWebShare = async () => {
    trackEvent('share_clicked', { method: 'web_share', lang: language });

    const shareData = {
      title: t.brand.name,
      text: t.result.shareText(localizedRarity, localizedTwins),
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        trackEvent('share_completed', { method: 'web_share', lang: language });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    await handleCopyLink();
  };

  const handleDownloadCard = async () => {
    setDownloading(true);
    trackEvent('share_clicked', { method: 'download_card', lang: language });
    try {
      const localizedCardLabels = result.rarestCombination.traits.map((tr) => {
        const qTrans = t.questions[tr.questionId]?.options[tr.optionId];
        return qTrans?.cardLabel ?? tr.cardLabel;
      });

      const dataUrl = await generateRarityCardDataUrl({
        oneInX: result.oneInX,
        statisticalTwins: result.statisticalTwins,
        cardLabels: localizedCardLabels,
        isDemoMode: result.isDemoMode,
        language,
      });

      const link = document.createElement('a');
      link.download = `how-rare-are-you-${result.oneInX}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShareStatus(t.result.statusCardDownloaded);
      trackEvent('share_completed', { method: 'download_card', lang: language });
      window.setTimeout(() => setShareStatus(null), 3000);
    } catch {
      setShareStatus(t.result.statusCardError);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleWebShare}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-xs font-semibold tracking-widest text-white transition-all duration-150 hover:bg-[var(--accent-bright)] hover:border-[var(--accent-bright)] whitespace-nowrap"
        >
          <Share2 className="h-4 w-4" />
          <span>{t.result.shareMyResult}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-xs font-medium tracking-wider text-[var(--text-primary)] transition-colors hover:border-white/30 hover:bg-[var(--surface-elevated)] whitespace-nowrap"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-[var(--accent-bright)]" />
              <span>{t.result.linkCopied}</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[var(--text-secondary)]" />
              <span>{t.result.copyShareLink}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={downloading}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-xs font-medium tracking-wider text-[var(--text-primary)] transition-colors hover:border-white/30 hover:bg-[var(--surface-elevated)] disabled:opacity-50 whitespace-nowrap"
        >
          <Download className="h-4 w-4 text-[var(--text-secondary)]" />
          <span>
            {downloading ? t.result.renderingCard : t.result.downloadRarityCard}
          </span>
        </button>
      </div>

      {shareStatus && (
        <p role="status" className="font-mono-tabular text-xs text-[var(--accent-bright)]">
          {shareStatus}
        </p>
      )}
    </div>
  );
};
