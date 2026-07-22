"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, type Project } from "@/data/site";

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const projectTotal = total.toString().padStart(2, "0");

  return (
    <article className={`project-card project-card-${index + 1}`}>
      <a
        href={project.externalUrl}
        target="_blank"
        rel="noreferrer"
        className="project-link focus-ring"
        aria-label={`View ${project.title} project (opens in a new tab)`}
        data-cursor="VIEW"
      >
        <div className="project-meta">
          <span>{project.number} / {projectTotal}</span>
          <span>{project.year}</span>
          <span>{project.category}</span>
        </div>
        <div className="project-media">
          <Image
            className="project-image"
            src={project.cover}
            alt={`${project.title} interface preview`}
            fill
            sizes="(max-width: 899px) 92vw, 62vw"
            priority={index < 2}
          />
          <span className="project-status">{project.status}</span>
        </div>
        <div className="project-copy">
          <h2 className="text-balance">{project.title}</h2>
          <p className="text-pretty">{project.description}</p>
          <span className="project-view">View project ↗</span>
        </div>
      </a>
    </article>
  );
}

export function ProjectsRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const projectTotal = site.projects.length.toString().padStart(2, "0");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const context = gsap.context(() => {
      const matchMedia = gsap.matchMedia();

      matchMedia.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(distance(), window.innerHeight * 2.4)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(".projects-header", {
          y: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          gsap.from(card, {
            y: 30,
            rotationY: 4,
            opacity: 0.36,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontal,
              start: "left 94%",
              end: "center 64%",
              scrub: true,
            },
          });

          const image = card.querySelector(".project-image");
          if (image) {
            gsap.fromTo(
              image,
              { xPercent: -5, scale: 1.08 },
              {
                xPercent: 5,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontal,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }
        });
      });

      return () => matchMedia.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="projects-header">
        <span>SELECTED WORK / 2025—26</span>
        <h2 id="projects-title">Products built while finding the path.</h2>
        <span className="projects-count">{projectTotal} PROJECTS</span>
      </div>
      <div ref={trackRef} className="projects-track">
        {site.projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} total={site.projects.length} />
        ))}
        <div className="rail-end" aria-hidden="true">
          <span>OPEN ENDED</span>
          <i />
        </div>
      </div>
    </section>
  );
}
