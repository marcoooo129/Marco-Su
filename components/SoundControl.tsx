"use client";

import { useEffect, useRef, useState } from "react";

type AudioNodes = {
  context: AudioContext;
  gain: GainNode;
  oscillators: OscillatorNode[];
};

export function SoundControl() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<AudioNodes | null>(null);

  useEffect(() => {
    setEnabled(localStorage.getItem("marco-sound") === "on");
  }, []);

  useEffect(() => {
    if (!enabled) {
      audioRef.current?.oscillators.forEach((oscillator) => oscillator.stop());
      void audioRef.current?.context.close();
      audioRef.current = null;
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.004;
    gain.connect(context.destination);

    const frequencies = [54, 81];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start();
      return oscillator;
    });

    audioRef.current = { context, gain, oscillators };

    return () => {
      oscillators.forEach((oscillator) => oscillator.stop());
      void context.close();
      audioRef.current = null;
    };
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("marco-sound", next ? "on" : "off");
  };

  return (
    <button
      type="button"
      className="sound-control focus-ring"
      onClick={toggle}
      aria-label={`${enabled ? "Disable" : "Enable"} ambient sound`}
      aria-pressed={enabled}
      data-cursor="GO"
    >
      Sound
      <span className={`sound-status ${enabled ? "is-on" : ""}`} aria-hidden="true">
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}
