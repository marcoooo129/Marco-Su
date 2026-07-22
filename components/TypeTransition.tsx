"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 整句只出现一次，从右向左穿过视口，读完即走
const LINE = "THERE WAS NO MAP";
const LINE_ACCENT = "SO I MADE ONE";

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((character, index) => (
        <i key={`${character}-${index}`}>{character === " " ? " " : character}</i>
      ))}
    </>
  );
}

export function TypeTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const track = section.querySelector<HTMLElement>(".type-track");
      const stage = section.querySelector<HTMLElement>(".type-stage");
      if (!track || !stage) return;

      // 起点让句首停在右边缘外，终点让句尾退到左边缘外，正好走完一趟
      const distance = () => track.scrollWidth + stage.clientWidth;

      gsap.fromTo(
        track,
        { x: () => stage.clientWidth },
        {
          x: () => stage.clientWidth - distance(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="type-transition" aria-label={`${LINE}. ${LINE_ACCENT}.`}>
      <div className="type-stage">
        <div className="type-rule" aria-hidden="true">
          <span className="type-rule-tick" />
        </div>

        <div className="type-track" aria-hidden="true">
          <span className="type-line">
            <Letters text={LINE} />
          </span>
          <b className="type-sep">·</b>
          <span className="type-line type-line-accent">
            <Letters text={LINE_ACCENT} />
          </span>
        </div>

        <p>Every project here started without instructions.</p>
      </div>
    </section>
  );
}
