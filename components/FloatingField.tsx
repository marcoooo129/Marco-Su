import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const artifacts = [
  { top: '11%', left: '6%', size: 88, duration: 11, delay: 0, variant: 0, mobileHidden: false },
  { top: '20%', left: '73%', size: 132, duration: 14, delay: 0.7, variant: 1, mobileHidden: true },
  { top: '64%', left: '10%', size: 118, duration: 13, delay: 1.1, variant: 2, mobileHidden: true },
  { top: '70%', left: '76%', size: 92, duration: 10, delay: 0.2, variant: 0, mobileHidden: false },
  { top: '46%', left: '23%', size: 62, duration: 9, delay: 1.6, variant: 1, mobileHidden: true },
  { top: '13%', left: '42%', size: 56, duration: 8, delay: 0.4, variant: 2, mobileHidden: false },
];

const facets = [
  ['#ff5a36', '#d74326', '#ff8b72', '#8f2b19'],
  ['#315cff', '#1f3aaa', '#6f8cff', '#17235d'],
  ['#20201e', '#42423e', '#6a6a64', '#0d0d0c'],
];

const Artifact: React.FC<{ variant: number }> = ({ variant }) => {
  const colors = facets[variant];
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      <polygon points="18,13 67,5 94,40 78,84 31,94 5,58" fill={colors[0]} />
      <polygon points="18,13 53,37 5,58" fill={colors[1]} />
      <polygon points="18,13 67,5 53,37" fill={colors[2]} />
      <polygon points="67,5 94,40 53,37" fill={colors[3]} />
      <polygon points="53,37 94,40 78,84" fill={colors[1]} />
      <polygon points="53,37 78,84 31,94" fill={colors[0]} />
      <polygon points="5,58 53,37 31,94" fill={colors[3]} />
    </svg>
  );
};

export const FloatingField: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '120px' });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = isInView && !reduceMotion;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {artifacts.map((artifact, index) => (
        <motion.div
          key={`${artifact.top}-${artifact.left}`}
          className={artifact.mobileHidden ? 'absolute hidden sm:block' : 'absolute'}
          style={{ top: artifact.top, left: artifact.left, width: artifact.size, height: artifact.size }}
          animate={shouldAnimate ? {
            x: [0, index % 2 === 0 ? 18 : -14, 0],
            y: [0, index % 3 === 0 ? -22 : 16, 0],
            rotate: [0, index % 2 === 0 ? 22 : -28, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ duration: artifact.duration, delay: artifact.delay, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          <Artifact variant={artifact.variant} />
        </motion.div>
      ))}
    </div>
  );
};
