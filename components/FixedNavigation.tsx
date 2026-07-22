"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SoundControl } from "./SoundControl";
import { site } from "@/data/site";

const LINKS = [
  { id: "about", label: "About", num: "01" },
  { id: "projects", label: "Projects", num: "02" },
  { id: "contact", label: "Contact", num: "03" },
] as const;

export function FixedNavigation() {
  const navRef = useRef<HTMLElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");

  // 当前视口里在读哪一段 → 高亮对应导航项
  useEffect(() => {
    let ticking = false;
    const probe = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const link of LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = link.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(probe);
    };

    probe();
    const lenis = window.__lenis;
    lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      lenis?.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 导航栏入场：整块淡入，链接自上而下逐条滑入
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".nav-links li, .nav-monogram, .sound-control", {
        y: -12,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      });
    }, nav);
    return () => ctx.revert();
  }, []);

  const goto = useCallback((event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target == null) return;

    // 顶部扫光过场：一条强调色细线随滚动扫过，落位后淡出
    const sweep = sweepRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sweep && !reduced) {
      gsap.killTweensOf(sweep);
      gsap.set(sweep, { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" });
      gsap
        .timeline()
        .to(sweep, { scaleX: 1, duration: 0.7, ease: "power2.inOut" })
        .set(sweep, { transformOrigin: "100% 50%" })
        .to(sweep, { scaleX: 0, duration: 0.45, ease: "power2.in" }, ">-0.05")
        .set(sweep, { opacity: 0 });
    }

    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(target as HTMLElement | number, {
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else if (typeof target !== "number") {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div ref={sweepRef} className="nav-sweep" aria-hidden="true" />
      <header ref={navRef} className="site-nav" aria-label="Primary navigation">
        <nav className="nav-links">
          <ul>
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  className={`nav-link focus-ring ${active === link.id ? "is-active" : ""}`}
                  href={`#${link.id}`}
                  onClick={(event) => goto(event, link.id)}
                  data-cursor={link.id === "contact" ? "MAIL" : "GO"}
                  aria-current={active === link.id ? "true" : undefined}
                >
                  <span className="nav-marker" aria-hidden="true" />
                  <span className="nav-num" aria-hidden="true">{link.num}</span>
                  <span className="nav-text">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#top"
          className="nav-monogram focus-ring"
          aria-label="Back to the top"
          onClick={(event) => goto(event, "top")}
          data-cursor="GO"
        >
          {site.initials}
        </a>

        <SoundControl />
      </header>
    </>
  );
}
