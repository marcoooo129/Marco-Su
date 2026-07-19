import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { FloatingField } from './components/FloatingField';
import { Typewriter } from './components/Typewriter';
import { ProjectShowcase } from './components/ProjectShowcase';
import { AboutSection } from './components/AboutSection';
import { translations, type Locale } from './content';

const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = window.localStorage.getItem('marco-locale');
    return saved === 'en' || saved === 'it' || saved === 'zh' ? saved : 'zh';
  });
  const content = translations[locale];

  useEffect(() => {
    window.localStorage.setItem('marco-locale', locale);
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = content.meta.title;

    const setMeta = (selector: string, value: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', content.meta.description);
    setMeta('meta[property="og:locale"]', content.meta.locale);
    setMeta('meta[property="og:title"]', content.meta.title);
    setMeta('meta[property="og:description"]', content.meta.socialDescription);
    setMeta('meta[name="twitter:title"]', content.meta.title);
    setMeta('meta[name="twitter:description"]', content.meta.socialDescription);
  }, [content.meta, locale]);

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <Header locale={locale} content={content} onLocaleChange={setLocale} />

      <main>
        <section id="top" className="relative flex min-h-dvh scroll-mt-20 items-center justify-center overflow-hidden px-5 pb-16 pt-32 text-center md:px-8">
          <FloatingField />
          <div className="relative z-10 mx-auto max-w-5xl">
            <p className="font-mono text-[11px] uppercase text-quiet">{content.hero.eyebrow}</p>
            <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.95] sm:text-6xl md:text-8xl">
              <Typewriter phrases={content.hero.phrases} accessibleText={content.hero.accessibleHeadline} />
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-quiet md:text-lg md:leading-8">{content.hero.intro}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-2 font-mono text-[10px] text-quiet sm:flex-row sm:gap-4">
              <span>{content.hero.role}</span><span className="hidden sm:inline">·</span><span>{content.hero.location}</span>
            </div>
            <a href="#work" className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 text-xs font-semibold text-canvas transition-transform duration-150 hover:-translate-y-0.5">
              {content.hero.explore} ↓
            </a>
          </div>
        </section>

        <ProjectShowcase content={content} />
        <AboutSection content={content} />

        <section id="contact" className="scroll-mt-20 bg-ink px-4 py-24 text-canvas md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] uppercase text-signal">{content.contact.eyebrow}</p>
            <h2 className="mt-5 max-w-5xl text-balance font-display text-5xl font-semibold leading-[0.95] md:text-8xl">{content.contact.title}</h2>
            <p className="mt-8 max-w-xl text-pretty text-base leading-8 text-white/60">{content.contact.body}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="mailto:marco.su@edu.unifi.it" className="inline-flex min-h-12 items-center justify-center rounded-full bg-canvas px-6 text-xs font-semibold text-ink transition-transform duration-150 hover:-translate-y-0.5">{content.contact.email} ↗</a>
              <a href="https://github.com/marcoooo129" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-xs font-semibold transition-transform duration-150 hover:-translate-y-0.5">{content.contact.github} ↗</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="safe-bottom bg-ink px-4 text-canvas md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/15 py-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Marco Su · {content.footer.note}</p>
          <a href="#top" className="inline-flex min-h-11 items-center hover:text-white">{content.footer.backToTop} ↑</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
