"use client";

/**
 * [L3 契约] 全站滚动引擎（跨模块）
 * [INPUT]  无外部依赖；由 PortfolioExperience 包裹全站
 * [OUTPUT] window.__lenis —— 全局唯一 Lenis 实例。
 *          任何组件的程序化滚动都必须走它，不要用 window.scrollTo。
 *          消费方：IntroSequence(stop/start)、FixedNavigation(scrollTo)、
 *                 GlitchTransition(scrollTo)、AboutSection 等
 * [POS]    位于所有滚动动画之下；ScrollTrigger 依赖它的 scroll 事件同步。
 *          卸载时必须 destroy 并 delete window.__lenis，否则热更新会留下多个 RAF 循环。
 */

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    const sync = () => ScrollTrigger.update();

    lenis.on("scroll", sync);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;

    return () => {
      lenis.off("scroll", sync);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
