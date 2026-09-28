import React from 'react';
import { Language, SUPPORTED_LANGUAGES, useI18n } from '../lib/i18n';
import { RouteView } from './Navbar';

interface FooterProps {
  onNavigate: (view: RouteView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="relative z-20 mt-auto border-t border-[var(--border-subtle)] bg-[var(--background-alt)]/95 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-sm font-bold tracking-wider text-[var(--text-primary)] hover:opacity-80 transition-opacity"
            >
              {t.brand.name}
            </button>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {t.footer.privacyNote}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)]"
          >
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-[var(--text-primary)] hover:underline underline-offset-4 transition-colors"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-[var(--text-primary)] hover:underline underline-offset-4 transition-colors"
            >
              {t.nav.privacy}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('methodology')}
              className="hover:text-[var(--text-primary)] hover:underline underline-offset-4 transition-colors"
            >
              {t.nav.methodology}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-[var(--text-primary)] hover:underline underline-offset-4 transition-colors"
            >
              {t.nav.contact}
            </button>
          </nav>
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>{t.footer.disclaimer}</p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 font-mono-tabular">
              {SUPPORTED_LANGUAGES.map((item, idx) => (
                <React.Fragment key={item.code}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <button
                    type="button"
                    onClick={() => setLanguage(item.code as Language)}
                    lang={item.code}
                    className={`transition-colors hover:text-[var(--text-primary)] ${
                      language === item.code
                        ? 'text-[var(--accent-bright)] font-semibold underline underline-offset-4'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {item.nativeName}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <span aria-hidden="true" className="hidden sm:inline">
              |
            </span>
            <p className="font-mono-tabular">{t.footer.modelMeta}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
