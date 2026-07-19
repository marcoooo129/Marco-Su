import React, { useState } from 'react';
import type { Locale, Translation } from '../content';
import { cn } from '../lib/cn';

interface HeaderProps {
  locale: Locale;
  content: Translation;
  onLocaleChange: (locale: Locale) => void;
}

const localeLabels: Record<Locale, string> = { zh: '中', en: 'EN', it: 'IT' };

const LanguageButtons: React.FC<Pick<HeaderProps, 'locale' | 'onLocaleChange' | 'content'>> = ({ locale, onLocaleChange, content }) => (
  <div className="flex items-center gap-1" aria-label={content.nav.language}>
    {(Object.keys(localeLabels) as Locale[]).map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onLocaleChange(option)}
        aria-pressed={locale === option}
        lang={option === 'zh' ? 'zh-CN' : option}
        className={cn(
          'flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 font-mono text-[11px] font-medium transition-colors duration-150',
          locale === option ? 'bg-ink text-canvas' : 'text-quiet hover:bg-ink/5 hover:text-ink',
        )}
      >
        {localeLabels[option]}
      </button>
    ))}
  </div>
);

export const Header: React.FC<HeaderProps> = ({ locale, content, onLocaleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
  <header className="safe-top fixed inset-x-0 top-0 z-50 px-4 md:px-8">
    <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-ink/10 bg-canvas px-2 py-1 shadow-sm">
      <a href="#top" className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-signal font-display text-sm font-bold text-white" aria-label="Marco Su, home">
        MS
      </a>

      <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary navigation">
        <a href="#work" className="transition-colors duration-150 hover:text-signal">{content.nav.work}</a>
        <a href="#about" className="transition-colors duration-150 hover:text-signal">{content.nav.about}</a>
        <a href="#contact" className="transition-colors duration-150 hover:text-signal">{content.nav.contact}</a>
      </nav>

      <div className="hidden md:block">
        <LanguageButtons locale={locale} onLocaleChange={onLocaleChange} content={content} />
      </div>

      <div className="relative md:hidden">
        <button type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-expanded={isMenuOpen} aria-controls="mobile-menu" className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium">
          {isMenuOpen ? content.nav.close : content.nav.menu}
        </button>
        {isMenuOpen && <div id="mobile-menu" className="absolute right-0 top-14 w-56 rounded-3xl border border-ink/10 bg-canvas p-4 shadow-lg">
          <nav className="grid text-lg" aria-label="Mobile navigation">
            <a href="#work" onClick={() => setIsMenuOpen(false)} className="flex min-h-11 items-center border-b border-line">{content.nav.work}</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="flex min-h-11 items-center border-b border-line">{content.nav.about}</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="flex min-h-11 items-center">{content.nav.contact}</a>
          </nav>
          <div className="mt-4 border-t border-line pt-3">
            <LanguageButtons locale={locale} onLocaleChange={onLocaleChange} content={content} />
          </div>
        </div>}
      </div>
    </div>
  </header>
  );
};
