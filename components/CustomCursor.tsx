"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return;

    document.body.classList.add("has-custom-cursor");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });

    const move = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      if (!cursor.classList.contains("is-visible")) cursor.classList.add("is-visible");
    };

    const hover = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const value = target?.dataset.cursor ?? "";
      label.textContent = value;
      cursor.classList.toggle("is-active", Boolean(value));
    };

    const leave = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", hover, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", hover);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="cursor-horizontal" />
      <span className="cursor-vertical" />
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
