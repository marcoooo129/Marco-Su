import React from 'react';
import type { Translation } from '../content';

export const AboutSection: React.FC<{ content: Translation }> = ({ content }) => (
  <section id="about" className="scroll-mt-20 border-t border-line px-4 py-24 md:px-8 md:py-32">
    <div className="mx-auto max-w-7xl">
      <p className="font-mono text-[11px] uppercase text-signal">{content.about.eyebrow}</p>
      <div className="mt-6 grid gap-14 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.95] md:text-7xl">{content.about.title}</h2>
          <div className="mt-10 max-w-2xl space-y-6 text-pretty text-base leading-8 text-quiet">
            {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>

        <div className="grid gap-10 lg:pt-24">
          <div>
            <p className="font-mono text-[10px] uppercase text-quiet">{content.about.education}</p>
            <dl className="mt-4 border-t border-line">
              <div className="border-b border-line py-5"><dt className="font-display text-xl font-semibold">{content.about.florence}</dt><dd className="mt-2 text-sm leading-6 text-quiet">{content.about.florenceDegree}</dd></div>
              <div className="border-b border-line py-5"><dt className="font-display text-xl font-semibold">{content.about.guilin}</dt><dd className="mt-2 text-sm leading-6 text-quiet">{content.about.guilinDegree}</dd></div>
            </dl>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-quiet">{content.about.focus}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {content.about.focusItems.map((item) => <li key={item} className="rounded-2xl border border-line p-4 text-sm leading-6">{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
