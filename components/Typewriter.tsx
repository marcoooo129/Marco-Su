import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface TypewriterProps {
  phrases: string[];
  accessibleText: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ phrases, accessibleText }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: '80px' });
  const reduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setPhraseIndex(0);
    setVisibleText(reduceMotion ? phrases[0] : '');
    setIsDeleting(false);
  }, [phrases, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !isInView) return;

    const phrase = phrases[phraseIndex];
    const isComplete = visibleText === phrase;
    const isEmpty = visibleText.length === 0;
    const delay = isComplete && !isDeleting ? 1400 : isDeleting ? 42 : 78;

    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setVisibleText((text) => isDeleting ? phrase.slice(0, Math.max(0, text.length - 1)) : phrase.slice(0, text.length + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, isInView, phraseIndex, phrases, reduceMotion, visibleText]);

  return (
    <>
      <span className="sr-only">{accessibleText}</span>
      <span ref={ref} aria-hidden="true" className="inline-flex min-h-[1.05em] items-baseline">
        {visibleText}
        <span className="ml-1 inline-block h-[0.82em] w-[0.08em] bg-signal" />
      </span>
    </>
  );
};
