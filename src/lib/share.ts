import { RarityResult, SharePayload } from '../types/rarity';
import { formatRarity, formatShortRarity } from './rarity/rarityEngine';
import {
  formatRarityLocalized,
  formatShortRarityLocalized,
  Language,
  TRANSLATIONS,
} from './i18n';

/**
 * Encodes a non-sensitive summary of the rarity result into a compact URL-safe token.
 * Does not include raw questionnaire answers or personally identifying data.
 */
export function encodeShareToken(result: RarityResult, challengerAlias?: string): string {
  const payload: SharePayload = {
    v: 1,
    o: Math.round(result.oneInX),
    t: Math.round(result.statisticalTwins),
    c: result.confidence,
    r: result.rarestCombination.traits.slice(0, 4).map((tr) => tr.shortTag),
    l: result.rarestCombination.traits.slice(0, 4).map((tr) => tr.cardLabel),
    rO: Math.round(result.rarestCombination.oneInX),
  };

  if (challengerAlias && challengerAlias.trim().length > 0) {
    payload.n = challengerAlias.trim().slice(0, 24);
  }

  try {
    const json = JSON.stringify(payload);
    const base64 = btoa(encodeURIComponent(json))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64;
  } catch {
    return 'est_default';
  }
}

/**
 * Decodes a URL-safe token back into a validated SharePayload.
 * Returns null if the token is malformed or invalid.
 */
export function decodeShareToken(token: string | null | undefined): SharePayload | null {
  if (!token || typeof token !== 'string' || token.length < 4 || token.length > 2048) {
    return null;
  }

  try {
    const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + '='.repeat(padLength);
    const json = decodeURIComponent(atob(padded));
    const parsed = JSON.parse(json) as Partial<SharePayload>;

    if (
      parsed.v !== 1 ||
      typeof parsed.o !== 'number' ||
      !Number.isFinite(parsed.o) ||
      parsed.o < 1 ||
      typeof parsed.t !== 'number' ||
      !Array.isArray(parsed.r) ||
      !Array.isArray(parsed.l)
    ) {
      return null;
    }

    return {
      v: 1,
      o: Math.max(1, Math.round(parsed.o)),
      t: Math.max(1, Math.round(parsed.t)),
      c:
        parsed.c === 'HIGH CONFIDENCE' ||
        parsed.c === 'MEDIUM CONFIDENCE' ||
        parsed.c === 'LOW CONFIDENCE'
          ? parsed.c
          : 'MEDIUM CONFIDENCE',
      r: parsed.r.slice(0, 4).map((s) => String(s).slice(0, 40)),
      l: parsed.l.slice(0, 4).map((s) => String(s).slice(0, 50)),
      rO: typeof parsed.rO === 'number' && parsed.rO >= 1 ? Math.round(parsed.rO) : parsed.o,
      n: typeof parsed.n === 'string' ? parsed.n.slice(0, 24) : undefined,
    };
  } catch {
    return null;
  }
}

export function buildResultShareUrl(token: string, lang?: Language): string {
  const query = lang && lang !== 'en' ? `?lang=${lang}` : '';
  if (typeof window === 'undefined') {
    return `https://howrareareyou.com/result/${token}${query}`;
  }
  return `${window.location.origin}/result/${token}${query}`;
}

export function buildChallengeShareUrl(token: string, lang?: Language): string {
  const query = lang && lang !== 'en' ? `?lang=${lang}` : '';
  if (typeof window === 'undefined') {
    return `https://howrareareyou.com/challenge/${token}${query}`;
  }
  return `${window.location.origin}/challenge/${token}${query}`;
}

/**
 * Generates a downloadable vertical PNG image of the Rarity Card (1080x1350)
 * optimized for mobile screenshots and social sharing.
 */
export async function generateRarityCardDataUrl(payload: {
  oneInX: number;
  statisticalTwins: number;
  cardLabels: string[];
  isDemoMode?: boolean;
  language?: Language;
}): Promise<string> {
  const lang: Language = payload.language ?? 'en';
  const t = TRANSLATIONS[lang];
  const locale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US';

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Lighter Slate-Charcoal Background
  ctx.fillStyle = '#1A1B23';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle violet radial glow behind the main rarity figure
  const glow = ctx.createRadialGradient(540, 440, 20, 540, 440, 480);
  glow.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
  glow.addColorStop(0.6, 'rgba(139, 92, 246, 0.07)');
  glow.addColorStop(1, 'rgba(26, 27, 35, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle dot field in background
  ctx.fillStyle = 'rgba(248, 250, 252, 0.08)';
  for (let x = 80; x < 1000; x += 48) {
    for (let y = 80; y < 1270; y += 48) {
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer card frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, 952, 1222);

  // Top Header
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 28px "Syne", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(t.brand.name, 120, 145);

  if (payload.isDemoMode) {
    ctx.fillStyle = '#B8BCC8';
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(t.result.estimatedLabel, 960, 145);
    ctx.textAlign = 'left';
  }

  // Hairline divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 185);
  ctx.lineTo(960, 185);
  ctx.stroke();

  // Section Label: YOUR ESTIMATED RARITY
  ctx.fillStyle = '#B8BCC8';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText(t.result.yourEstimatedRarity, 120, 275);

  // Main Figure
  const heroString = `~${
    lang === 'en'
      ? formatShortRarity(payload.oneInX)
      : formatShortRarityLocalized(payload.oneInX, lang)
  }`;
  ctx.fillStyle = '#F8FAFC';
  ctx.font =
    heroString.length > 16
      ? '800 66px "Syne", sans-serif'
      : '800 84px "Syne", sans-serif';
  ctx.fillText(heroString, 120, 390);

  // Sub-explanation
  const occurrenceStr =
    lang === 'en'
      ? formatRarity(payload.oneInX, true)
      : formatRarityLocalized(payload.oneInX, lang, true);
  ctx.fillStyle = '#B8BCC8';
  ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `${t.result.estimatedOccurrenceLabel} ${occurrenceStr}`,
    120,
    455
  );

  // Divider
  ctx.beginPath();
  ctx.moveTo(120, 520);
  ctx.lineTo(960, 520);
  ctx.stroke();

  // RAREST COMBINATION
  ctx.fillStyle = '#A78BFA';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText(t.result.yourRarestCombination, 120, 590);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
  let yPos = 665;
  for (const label of payload.cardLabels.slice(0, 4)) {
    ctx.fillStyle = '#8B5CF6';
    ctx.fillText('+', 120, yPos);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(label, 165, yPos);
    yPos += 68;
  }

  // Divider
  ctx.beginPath();
  ctx.moveTo(120, 965);
  ctx.lineTo(960, 965);
  ctx.stroke();

  // ESTIMATED STATISTICAL TWINS
  ctx.fillStyle = '#B8BCC8';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText(t.result.estimatedStatisticalTwins, 120, 1035);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 64px "JetBrains Mono", monospace';
  ctx.fillText(`~${payload.statisticalTwins.toLocaleString(locale)}`, 120, 1120);

  // Footer
  ctx.fillStyle = '#888D9E';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText('howrareareyou.com', 120, 1225);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#888D9E';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(t.result.noPiiStored, 960, 1225);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
