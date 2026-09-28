import React from 'react';
import { Globe } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, useI18n } from '../lib/i18n';

export type RouteView =
  | 'home'
  | 'quiz'
  | 'calculating'
  | 'result'
  | 'challenge'
  | 'about'
  | 'methodology'
  | 'privacy'
  | 'contact';

interface NavbarProps {
  currentView: RouteView;
  onNavigate: (view: RouteView) => void;
  onStartQuiz: () => void;
  hasSavedProgress?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onStartQuiz,
}) => {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="relative z-20 w-full border-b border-[var(--border-subtle)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-sm font-bold tracking-wider text-[var(--text-primary)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] whitespace-nowrap shrink-0"
        >
          {t.brand.name}
        </button>

        {/* Zone 2: Minimal navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm text-[var(--text-secondary)]"
        >
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className={`transition-colors hover:text-[var(--text-primary)] hover:underline underline-offset-4 whitespace-nowrap ${
              currentView === 'about' ? 'text-[var(--text-primary)] underline' : ''
            }`}
          >
            {t.nav.about}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('methodology')}
            className={`transition-colors hover:text-[var(--text-primary)] hover:underline underline-offset-4 whitespace-nowrap ${
              currentView === 'methodology' ? 'text-[var(--text-primary)] underline' : ''
            }`}
          >
            {t.nav.methodology}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('privacy')}
            className={`transition-colors hover:text-[var(--text-primary)] hover:underline underline-offset-4 whitespace-nowrap ${
              currentView === 'privacy' ? 'text-[var(--text-primary)] underline' : ''
            }`}
          >
            {t.nav.privacy}
          </button>
        </nav>

        {/* Zone 3: Language Switcher & Single Primary Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher (EN / ES / DE) */}
          <div
            role="group"
            aria-label={t.nav.languageLabel}
            className="inline-flex items-center border border-[var(--border)] bg-[var(--surface-inset)] p-0.5 text-xs font-mono-tabular"
          >
            <Globe
              aria-hidden="true"
              className="ml-2 mr-1 hidden h-3.5 w-3.5 text-[var(--text-muted)] sm:inline"
            />
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isCurrent = language === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => setLanguage(langItem.code as Language)}
                  aria-pressed={isCurrent}
                  title={langItem.nativeName}
                  className={`px-2 py-1 text-[11px] font-medium transition-colors ${
                    isCurrent
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {langItem.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              currentView === 'about' ? onNavigate('home') : onNavigate('about')
            }
            className="md:hidden text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
          >
            {currentView === 'about' ? t.nav.home : t.nav.about}
          </button>

          {currentView !== 'quiz' && currentView !== 'calculating' && (
            <button
              type="button"
              onClick={onStartQuiz}
              className="hidden sm:inline-flex border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium tracking-wider text-[var(--text-primary)] transition-all duration-150 hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] whitespace-nowrap shrink-0"
            >
              {t.nav.findOut}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
