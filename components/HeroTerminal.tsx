"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LocalClock } from "./LocalClock";
import { site } from "@/data/site";

const CRTScene = dynamic(() => import("./CRTScene"), { ssr: false });

type HeroTerminalProps = {
  theme: "dark" | "light";
  onThemeToggle: () => void;
};

export function HeroTerminal({ theme, onThemeToggle }: HeroTerminalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const computerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const diveProgressRef = useRef(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // 只有桌面 + 允许动效时才加载 3D 场景。
    // 用实际元素宽度判断：挂载瞬间 innerWidth 可能还是 0，matchMedia 会误判成移动端。
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 手机端也用真 3D 电视（和 PC 一致），只有明确要求减动效时才降级
    const sync = () => setUse3D(!reduced.matches);

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(section);
    reduced.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 3D 模式下 CSS 电视屏不渲染，轮换 projectIndex 只会白白触发重渲染
    if (!isActive || use3D) return;
    const timer = window.setInterval(() => {
      setProjectIndex((current) => (current + 1) % site.projects.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [isActive, use3D]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            diveProgressRef.current = self.progress;
          },
        },
      });

      timeline.to(".hero-interface", { opacity: 0, duration: 0.16, ease: "none" }, 0.08);

      // 3D 场景自己处理缩放和推进，这里只喂进度；CSS 版本才需要补这段
      if (!use3D) {
        const computer = computerRef.current;
        const tilt = tiltRef.current;
        const portal = portalRef.current;
        if (computer && tilt && portal) {
          timeline
            .to(tilt, { rotationX: 0, rotationY: 0, duration: 0.14, ease: "none" }, 0.1)
            .to(
              computer,
              { scale: 6.1, yPercent: -2, transformOrigin: "50% 37%", duration: 0.84, ease: "none" },
              0.12,
            )
            .to(portal, { opacity: 1, duration: 0.26, ease: "none" }, 0.68)
            .to(".crt-screen-content", { opacity: 0.14, duration: 0.22, ease: "none" }, 0.69);
        }
      }
    }, section);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [use3D]);

  const project = site.projects[projectIndex];

  return (
    <section ref={sectionRef} id="top" className={`hero-section ${isActive ? "is-active" : ""}`} aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div className="hero-halo" aria-hidden="true" />
        <div className="hero-interface hero-side-copy">
          <p id="hero-title" className="text-pretty">{site.positioning}</p>
          <span>{site.location}</span>
        </div>

        {use3D ? (
          <div className="crt-3d" aria-label="A retro CRT computer displaying Marco Su's projects">
            <CRTScene progressRef={diveProgressRef} theme={theme} onThemeToggle={onThemeToggle} />
          </div>
        ) : (
        <div ref={computerRef} className="crt-computer" aria-label="A retro computer displaying Marco Su's projects">
          <div ref={tiltRef} className="crt-tilt">
          <div className="crt-depth crt-depth-top" aria-hidden="true" />
          <div className="crt-depth crt-depth-left" aria-hidden="true" />
          <div className="crt-depth crt-depth-right" aria-hidden="true" />
          <div className="crt-shell">
            <div className="crt-bezel">
              <div className="crt-screen">
                <div className="crt-screen-content" key={project.slug}>
                  <div className="screen-topline">
                    <span>MARCO_OS</span>
                    <span className="screen-signal" aria-hidden="true">●</span>
                  </div>
                  <div className="screen-project">
                    <span className="screen-index">PROJECT {project.number}</span>
                    <strong>{project.title}</strong>
                    <span>{project.category}</span>
                  </div>
                  <div className="screen-command">&gt; open /work/{project.slug}<span className="screen-caret" /></div>
                </div>
                <div ref={portalRef} className="screen-portal" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="crt-controls">
              <div className="crt-brand">M/01</div>
              <button
                type="button"
                className="theme-knob focus-ring"
                onClick={onThemeToggle}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                aria-pressed={theme === "light"}
                data-cursor="GO"
              >
                <span className={theme === "light" ? "is-light" : ""} aria-hidden="true" />
              </button>
              <div className="crt-slots" aria-hidden="true"><i /><i /><i /><i /></div>
            </div>
          </div>
          <div className="crt-foot" aria-hidden="true" />
          </div>
          <div className="theme-note" aria-hidden="true">
            <svg viewBox="0 0 128 50" role="presentation">
              <path d="M2 44C40 44 59 37 72 11M66 17l6-6 5 7" />
            </svg>
            <span>Switch Day ’N’ Night</span>
          </div>
        </div>
        )}

        <div className="hero-interface hero-bottom">
          <span>SCROLL DOWN <b aria-hidden="true">■</b></span>
          <span className="hero-clock"><LocalClock /> / LOCAL</span>
        </div>
        <div className="hero-floor" aria-hidden="true" />
      </div>
    </section>
  );
}
