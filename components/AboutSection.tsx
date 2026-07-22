"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // 动画期间才裁切（挡住从下方滑入的整行），结束后撤掉，
      // 静止状态下字母下降部才不会被切
      const title = section.querySelector<HTMLElement>(".about-title");
      if (title) gsap.set(title, { overflow: "hidden" });
      gsap.from(".about-title span", {
        yPercent: 108,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-title", start: "top 86%", once: true },
        onComplete: () => {
          if (title) gsap.set(title, { overflow: "visible" });
        },
      });

      gsap.utils.toArray<HTMLElement>(".story-row").forEach((row) => {
        gsap.from(row, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".note-row").forEach((row) => {
        gsap.from(row, {
          y: 22,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-intro">
        <p className="section-kicker">
          <span>About</span>
          <span>Marco Su / MS</span>
        </p>
        <h2 id="about-title" className="about-title text-balance">
          <span>A non-linear</span>
          <span>path to building.</span>
        </h2>
        <p className="about-statement text-pretty">{site.aboutStatement}</p>
      </div>

      <div className="story-block">
        <div className="block-head">
          <span>How I got here</span>
          <span>Three turns / 01—03</span>
        </div>
        <div className="story-list">
          {site.story.map((item) => (
            <article key={item.title} className="story-row">
              <span className="story-index">{item.index}</span>
              <div className="story-head">
                <h3 className="text-balance">{item.short}</h3>
                <span className="story-tag">
                  {item.title}
                  <i>{item.meta}</i>
                </span>
              </div>
              <p className="text-pretty">{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="notes-block">
        <div className="block-head">
          <span>Notes</span>
          <span>Writing / recent</span>
        </div>
        <ul className="note-list">
          {site.writing.map((post) => (
            <li key={post.slug} className="note-row">
              <Link href={`/notes/${post.slug}`} className="note-link focus-ring" data-cursor="READ">
                <span className="note-index">{post.index}</span>
                <div className="note-main">
                  <h3 className="text-balance">{post.title}</h3>
                  <p className="text-pretty">{post.excerpt}</p>
                </div>
                <div className="note-meta">
                  <span className="note-tag">{post.tag}</span>
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                  <span className="note-arrow" aria-hidden="true">
                    Read ↗
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="notes-foot">Each note is a full read — open one. More are on the way.</p>
      </div>

      <div className="about-facts">
        <div>
          <span className="fact-label">Education</span>
          {site.education.map((item) => (
            <p key={item.school}>
              <strong>{item.school}</strong>
              <span>{item.program}</span>
              <small>
                {item.period} / {item.location}
              </small>
            </p>
          ))}
        </div>
        <div>
          <span className="fact-label">Languages</span>
          {site.languages.map((language) => (
            <p key={language}>{language}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
