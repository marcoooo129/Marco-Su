"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FuzzyText from "./FuzzyText";

const FLASH_HOLD_MS = 560;
const FLASH_FADE_MS = 240;
const JUMP_AT_MS = 150;

export function GlitchTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const hero = document.querySelector<HTMLElement>(".hero-section");
    if (!overlay || !canvas || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let busy = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / 4);
      canvas.height = Math.ceil(window.innerHeight / 4);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawStatic = () => {
      const { width, height } = canvas;
      const image = ctx.createImageData(width, height);
      const data = image.data;

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.14) {
          // 绿色系星点
          const value = 90 + Math.random() * 165;
          data[i] = value * 0.72;
          data[i + 1] = value;
          data[i + 2] = value * 0.8;
          data[i + 3] = 255;
        } else {
          // 暗绿底色
          data[i] = 6;
          data[i + 1] = 20;
          data[i + 2] = 12;
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);

      const tears = 2 + Math.floor(Math.random() * 3);
      for (let t = 0; t < tears; t += 1) {
        const y = Math.floor(Math.random() * height);
        const bandHeight = 2 + Math.floor(Math.random() * 5);
        const shift = Math.floor((Math.random() - 0.5) * width * 0.3);
        ctx.drawImage(canvas, 0, y, width, bandHeight, shift, y, width, bandHeight);
      }
    };

    const noiseLoop = () => {
      drawStatic();
      rafId = requestAnimationFrame(noiseLoop);
    };

    const playFlash = () => {
      if (busy) return;
      busy = true;
      setFlashing(true);
      overlay.classList.add("is-on");
      overlay.classList.remove("is-fading");
      noiseLoop();

      // 全屏噪点盖住的瞬间，把页面直接跳到 Manifesto 顶部
      timeouts.push(
        setTimeout(() => {
          const manifesto = document.querySelector<HTMLElement>(".manifesto-section");
          if (manifesto) {
            const top = manifesto.getBoundingClientRect().top + window.scrollY + 2;
            if (window.__lenis) {
              window.__lenis.scrollTo(top, { immediate: true, force: true });
            } else {
              window.scrollTo({ top, behavior: "auto" });
            }
            ScrollTrigger.update();
          }
        }, JUMP_AT_MS),
      );

      timeouts.push(
        setTimeout(() => {
          overlay.classList.add("is-fading");
        }, FLASH_HOLD_MS),
      );

      timeouts.push(
        setTimeout(() => {
          overlay.classList.remove("is-on", "is-fading");
          cancelAnimationFrame(rafId);
          rafId = 0;
          setFlashing(false);
          busy = false;
        }, FLASH_HOLD_MS + FLASH_FADE_MS),
      );
    };

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom 102%",
      onEnter: (self) => {
        // 锚点/程序化长距离跳转时不劫持（比如导航点 About）
        if (window.scrollY > self.start + window.innerHeight * 1.2) return;
        playFlash();
      },
    });

    return () => {
      trigger.kill();
      timeouts.forEach(clearTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={overlayRef} className="glitch-flash" aria-hidden="true">
      <canvas ref={canvasRef} className="glitch-flash-noise" />
      {flashing && (
        <div className="glitch-flash-text">
          <FuzzyText
            fontSize="clamp(2.5rem, 7vw, 6.5rem)"
            fontWeight={700}
            fontFamily="'Space Mono', monospace"
            color="#f1f0ed"
            enableHover={false}
            baseIntensity={0.45}
            fuzzRange={34}
            direction="horizontal"
          >
            MARCO_OS
          </FuzzyText>
        </div>
      )}
    </div>
  );
}
