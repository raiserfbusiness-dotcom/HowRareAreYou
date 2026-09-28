export type AnalyticsEventName =
  | 'homepage_view'
  | 'quiz_started'
  | 'question_answered'
  | 'quiz_completed'
  | 'result_viewed'
  | 'share_clicked'
  | 'share_completed'
  | 'challenge_created'
  | 'challenge_completed'
  | 'rarity_upgrade_started'
  | 'rarity_upgrade_completed';

export interface AnalyticsEvent {
  eventId: string;
  name: AnalyticsEventName;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AnalyticsProvider {
  track: (event: AnalyticsEvent) => void;
}

function generateAnonymousEventId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timePart = Date.now().toString(36).slice(-4);
  return `evt_${timePart}_${randomPart}`;
}

class DefaultPrivacySafeAnalytics implements AnalyticsProvider {
  private history: AnalyticsEvent[] = [];

  track(event: AnalyticsEvent): void {
    // Store in memory only (up to 50 anonymous events); never logs raw sensitive answers
    this.history.push(event);
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  getRecentEvents(): readonly AnalyticsEvent[] {
    return this.history;
  }
}

let activeProvider: AnalyticsProvider = new DefaultPrivacySafeAnalytics();

export function setAnalyticsProvider(provider: AnalyticsProvider): void {
  activeProvider = provider;
}

/**
 * Privacy-first event tracking abstraction.
 * Strips any raw answer values if accidentally passed.
 */
export function trackEvent(
  name: AnalyticsEventName,
  metadata?: Record<string, string | number | boolean>
): AnalyticsEvent {
  const safeMetadata: Record<string, string | number | boolean> = {};

  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      // Never record raw personal answers
      if (key === 'rawAnswer' || key === 'answers' || key === 'email' || key === 'name') {
        continue;
      }
      safeMetadata[key] = value;
    }
  }

  const event: AnalyticsEvent = {
    eventId: generateAnonymousEventId(),
    name,
    timestamp: new Date().toISOString(),
    metadata: Object.keys(safeMetadata).length > 0 ? safeMetadata : undefined,
  };

  try {
    activeProvider.track(event);
  } catch {
    // Fail silently so analytics never interrupts UX
  }

  return event;
}
