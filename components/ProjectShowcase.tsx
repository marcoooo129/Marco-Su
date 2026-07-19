import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Translation } from '../content';
import { cn } from '../lib/cn';
import { ProjectVisual } from './ProjectVisual';

interface ProjectShowcaseProps {
  content: Translation;
}

const visualSurface = {
  dimmi: 'bg-ink text-white',
  florence: 'bg-signal text-ink',
  anime: 'bg-[#cda273] text-ink',
  spend: 'bg-cobalt text-white',
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ content }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const project = content.projects[activeIndex];

  const goPrevious = () => setActiveIndex((index) => (index - 1 + content.projects.length) % content.projects.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % content.projects.length);

  return (
    <section id="work" className="scroll-mt-20 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-line pb-10 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase text-signal">{content.work.eyebrow}</p>
            <h2 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.95] md:text-7xl">{content.work.title}</h2>
          </div>
          <p className="max-w-xl text-pretty text-sm leading-7 text-quiet md:justify-self-end">{content.work.intro}</p>
        </div>

        <div className={cn('mt-8 min-h-[76dvh] overflow-hidden rounded-[2rem] p-5 md:p-10', visualSurface[project.visual])}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={project.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="grid min-h-[calc(76dvh-2.5rem)] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center"
              aria-live="polite"
            >
              <div className="flex h-full flex-col justify-between py-2 md:py-5">
                <div>
                  <div className="flex items-center gap-4 font-mono text-[11px] opacity-65"><span>{project.year}</span><span>·</span><span>{project.type}</span></div>
                  <h3 className="mt-6 text-balance font-display text-5xl font-semibold leading-none md:text-7xl">{project.title}</h3>
                  <p className="mt-5 max-w-lg text-balance font-display text-2xl leading-tight md:text-3xl">{project.tagline}</p>
                  <p className="mt-6 max-w-lg text-pretty text-sm leading-7 opacity-75">{project.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.tools.map((tool) => <span key={tool} className="rounded-full border border-current/25 px-3 py-2 font-mono text-[10px]">{tool}</span>)}
                  </div>
                </div>

                <div className="mt-10">
                  <p className="font-mono text-[10px] uppercase opacity-55">{content.work.status}</p>
                  <p className="mt-2 text-sm font-medium">{project.status}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-canvas px-5 text-xs font-semibold text-ink transition-transform duration-150 hover:-translate-y-0.5">{content.work.live} ↗</a>}
                    {project.source && <a href={project.source} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-current/35 px-5 text-xs font-semibold transition-transform duration-150 hover:-translate-y-0.5">{content.work.source} ↗</a>}
                  </div>
                </div>
              </div>

              <ProjectVisual visual={project.visual} />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label={content.work.choose}>
            {content.projects.map((item, index) => (
              <button key={item.id} type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index} className={cn('flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 font-mono text-xs transition-colors duration-150', activeIndex === index ? 'border-ink bg-ink text-canvas' : 'border-line hover:border-ink')} aria-label={`${content.work.project} ${index + 1}: ${item.title}`}>
                {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={goPrevious} className="flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-150 hover:border-ink" aria-label={content.work.previous}>←</button>
            <button type="button" onClick={goNext} className="flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-150 hover:border-ink" aria-label={content.work.next}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
};
