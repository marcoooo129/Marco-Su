"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { PixelTrail } from "./PixelTrail";

const HOLD_MS = 2000;
const DELETE_MS = 45;
const TYPE_MS = 75;

function DynamicWord({ active }: { active: boolean }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(site.manifesto.words[0].length);
  const [phase, setPhase] = useState<"hold" | "deleting" | "typing">("hold");

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const word = site.manifesto.words[wordIndex];
    let timer: number;

    if (phase === "hold") {
      timer = window.setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (charCount > 0) {
        timer = window.setTimeout(() => setCharCount(charCount - 1), DELETE_MS);
      } else {
        setWordIndex((wordIndex + 1) % site.manifesto.words.length);
        setPhase("typing");
      }
    } else {
      if (charCount < word.length) {
        timer = window.setTimeout(() => setCharCount(charCount + 1), TYPE_MS);
      } else {
        setPhase("hold");
      }
    }

    return () => window.clearTimeout(timer);
  }, [active, phase, charCount, wordIndex]);

  return (
    <span className="dynamic-word" aria-hidden="true">
      {site.manifesto.words[wordIndex].slice(0, charCount)}
      <span className={`dynamic-caret ${phase === "hold" ? "is-blinking" : ""}`} />
    </span>
  );
}

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isActive, setIsActive] = useState(false);

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
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      gsap.from(".manifesto-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true,
        },
      });

      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 65%",
            scrub: true,
          },
        });
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="manifesto-section grid-surface" aria-labelledby="manifesto-title">
      <PixelTrail />
      <div className="manifesto-top manifesto-reveal">
        <span>{site.manifesto.eyebrow}</span>
        <span>FIELD NOTES / 01</span>
      </div>

      <div className="manifesto-layout">
        <h1 id="manifesto-title" className="manifesto-title manifesto-reveal">
          <span className="manifesto-title-sizer" aria-hidden="true">
            {site.manifesto.heading}{" "}
            <span className="dynamic-word">
              {site.manifesto.words.reduce((a, b) => (b.length > a.length ? b : a))}
            </span>
          </span>
          <span className="manifesto-title-live">
            {site.manifesto.heading} <DynamicWord active={isActive} />
          </span>
          <span className="sr-only">{site.manifesto.words.join(", ")}</span>
        </h1>

        <ol className="process-list manifesto-reveal" aria-label="Product process">
          <li>[1] Discover</li>
          <li>[2] Frame</li>
          <li>[3] Build</li>
          <li>[4] Iterate</li>
        </ol>

        <svg className="manifesto-path" viewBox="0 0 360 250" aria-hidden="true">
          <path ref={pathRef} d="M12 22H122V74H176V132H230V190H348" />
        </svg>

        <p className="manifesto-body text-pretty manifesto-reveal">{site.manifesto.body}</p>
      </div>
    </section>
  );
}
