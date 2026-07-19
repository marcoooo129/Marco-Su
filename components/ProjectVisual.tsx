import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { ProjectVisual as VisualType } from '../content';

interface ProjectVisualProps {
  visual: VisualType;
}

const DimmiVisual: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="relative mx-auto aspect-[4/3] w-full max-w-xl rounded-[2rem] bg-[#dce8ff] p-5 text-ink shadow-xl md:p-8">
    <div className="flex items-center gap-2 border-b border-ink/15 pb-4">
      <span className="size-2 rounded-full bg-signal" /><span className="size-2 rounded-full bg-ink/20" /><span className="size-2 rounded-full bg-ink/20" />
      <span className="ml-auto font-mono text-[10px]">dimmi · beta</span>
    </div>
    <motion.div className="absolute left-[8%] top-[28%] w-[64%] rounded-3xl bg-white p-5 shadow-lg" animate={animate ? { y: [0, -8, 0] } : { y: 0 }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
      <p className="font-mono text-[10px] text-quiet">ITALIANO</p>
      <p className="mt-2 font-display text-2xl font-semibold md:text-4xl">Ci sentiamo presto.</p>
    </motion.div>
    <motion.div className="absolute bottom-[9%] right-[7%] w-[58%] rounded-3xl bg-ink p-5 text-white shadow-lg" animate={animate ? { y: [0, 9, 0] } : { y: 0 }} transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
      <p className="font-mono text-[10px] text-white/55">中文 · 自然表达</p>
      <p className="mt-2 font-display text-xl font-semibold md:text-3xl">回头联系。</p>
      <p className="mt-3 text-xs text-white/60">保持联系、之后再聊的自然说法</p>
    </motion.div>
  </div>
);

const FlorenceVisual: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] bg-[#fff3db] p-5 text-ink shadow-xl md:p-8">
    <div className="flex items-center justify-between">
      <div><p className="font-mono text-[10px]">UNIFI · STUDENT GUIDE</p><p className="mt-2 font-display text-2xl font-semibold">Find your next course.</p></div>
      <span className="flex size-12 items-center justify-center rounded-full bg-signal text-lg font-bold text-white">FS</span>
    </div>
    <div className="mt-8 grid gap-3">
      {[
        ['Sociologia della comunicazione', '4.8'],
        ['Etica della società digitale', '4.6'],
        ['Linguaggio e cognizione', '4.7'],
      ].map(([course, score], index) => (
        <motion.div key={course} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-4 shadow-sm" animate={animate ? { x: [0, index % 2 ? 7 : -7, 0] } : { x: 0 }} transition={{ duration: 6 + index, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
          <div><p className="text-sm font-semibold md:text-base">{course}</p><p className="mt-1 font-mono text-[9px] text-quiet">12 reviews · 6 CFU</p></div>
          <span className="font-mono text-sm font-medium">★ {score}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const AnimeVisual: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] bg-[#17120e] text-white shadow-xl">
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 font-mono text-[10px] text-white/55"><span>ANIMELEGNO</span><span>FIRENZE</span></div>
    <motion.svg viewBox="0 0 300 300" className="absolute left-1/2 top-1/2 size-[68%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" animate={animate ? { rotate: [0, 9, -7, 0], scale: [1, 1.03, 0.98, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
      <polygon points="62,33 225,18 282,122 244,254 83,276 19,167" fill="#bb7747" />
      <polygon points="62,33 149,117 19,167" fill="#754127" />
      <polygon points="62,33 225,18 149,117" fill="#e0a06d" />
      <polygon points="225,18 282,122 149,117" fill="#9a5a34" />
      <polygon points="149,117 282,122 244,254" fill="#5a321f" />
      <polygon points="149,117 244,254 83,276" fill="#c78351" />
      <polygon points="19,167 149,117 83,276" fill="#40251a" />
    </motion.svg>
    <p className="absolute inset-x-0 bottom-7 text-center font-display text-2xl font-semibold">Wood becomes character.</p>
  </div>
);

const SpendVisual: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] bg-mint p-5 text-ink shadow-xl md:p-8">
    <div className="flex items-center justify-between"><p className="font-display text-2xl font-semibold">VibeSpend</p><span className="rounded-full bg-ink px-3 py-2 font-mono text-[10px] text-white">LISTENING</span></div>
    <div className="absolute inset-x-[8%] top-[30%] flex h-20 items-center justify-center gap-2" aria-hidden="true">
      {[30, 54, 76, 44, 86, 62, 34, 68, 48].map((height, index) => (
        <motion.span key={`${height}-${index}`} className="w-2 rounded-full bg-cobalt" style={{ height }} animate={animate ? { scaleY: [0.45, 1, 0.6] } : { scaleY: 0.75 }} transition={{ duration: 1.6 + index * 0.08, repeat: Number.POSITIVE_INFINITY, repeatType: 'mirror', ease: 'easeInOut' }} />
      ))}
    </div>
    <motion.div className="absolute inset-x-[8%] bottom-[8%] rounded-3xl bg-white p-5 shadow-lg" animate={animate ? { y: [0, -7, 0] } : { y: 0 }} transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
      <p className="font-mono text-[10px] text-quiet">“Coffee with friends, twelve euros.”</p>
      <div className="mt-4 flex items-end justify-between"><div><p className="text-xs text-quiet">Food & drinks</p><p className="font-display text-2xl font-semibold">€12.00</p></div><span className="rounded-full bg-mint px-3 py-2 text-xs font-medium">Saved</span></div>
    </motion.div>
  </div>
);

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ visual }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '100px' });
  const reduceMotion = useReducedMotion();
  const animate = isInView && !reduceMotion;

  return (
    <div ref={ref} className="w-full" aria-hidden="true">
      {visual === 'dimmi' && <DimmiVisual animate={animate} />}
      {visual === 'florence' && <FlorenceVisual animate={animate} />}
      {visual === 'anime' && <AnimeVisual animate={animate} />}
      {visual === 'spend' && <SpendVisual animate={animate} />}
    </div>
  );
};
