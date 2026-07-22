"use client";

import { useCallback, useEffect, useState } from "react";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { CustomCursor } from "./CustomCursor";
import { FixedNavigation } from "./FixedNavigation";
import { GlitchTransition } from "./GlitchTransition";
import { HeroTerminal } from "./HeroTerminal";
import { IntroSequence } from "./IntroSequence";
import { ManifestoSection } from "./ManifestoSection";
import { NoiseOverlay } from "./NoiseOverlay";
import { ProjectsRail } from "./ProjectsRail";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { TypeTransition } from "./TypeTransition";

type Theme = "dark" | "light";

export function PortfolioExperience() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [introRun, setIntroRun] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("marco-theme");
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("marco-theme", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  const backToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setIntroRun((run) => run + 1), 520);
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="site-shell">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <IntroSequence key={introRun} runId={introRun} short={introRun > 0} />
        <FixedNavigation />
        <CustomCursor />
        <NoiseOverlay />
        <main id="main-content">
          <HeroTerminal theme={theme} onThemeToggle={toggleTheme} />
          <GlitchTransition />
          <ManifestoSection />
          <ProjectsRail />
          <TypeTransition />
          <AboutSection />
          <ContactSection onBackToTop={backToTop} />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
