"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/data/site";
import DecryptedText from "./DecryptedText";

const SEEN_KEY = "marco-intro-seen";

type IntroSequenceProps = {
  runId: number;
  short?: boolean;
};

const copy = `${site.tagline}\n${site.introLine}`;

export function IntroSequence({ runId, short = false }: IntroSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const unlockRef = useRef<(() => void) | null>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  // 本会话已看过开场、且不是手动 back-to-top 重播 → 直接跳过，
  // 从文章页 Back 回来时就不会再重播「Not trained…」。用 layout effect
  // 在浏览器绘制前就隐藏，不会闪一帧
  useLayoutEffect(() => {
    if (runId === 0 && sessionStorage.getItem(SEEN_KEY) === "1") {
      setVisible(false);
    }
  }, [runId]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    // 收起动画播完再解锁滚动：丢弃切换瞬间的滚轮惯性，
    // 电视页先安静落定，用户再滚动才开始推进（用 setTimeout 不依赖 rAF）
    window.setTimeout(() => unlockRef.current?.(), 700);
    const root = rootRef.current;
    if (!root) {
      setVisible(false);
      return;
    }

    gsap.to(root, {
      yPercent: -102,
      duration: 0.62,
      ease: "power3.inOut",
      onComplete: () => setVisible(false),
    });
  }, []);

  useEffect(() => {
    // 已看过且非重播：不播放、不锁滚动，直接让位给首页
    if (runId === 0 && sessionStorage.getItem(SEEN_KEY) === "1") {
      setVisible(false);
      return;
    }

    closingRef.current = false;
    setVisible(true);
    // 一旦开始播放就记为已看，之后本会话不再重播
    sessionStorage.setItem(SEEN_KEY, "1");

    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { yPercent: 0 });
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // 开场期间锁住页面滚动，滚动动作只作为"进入"的信号
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      document.documentElement.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
    unlockRef.current = unlock;

    const closeAndUnlock = () => close();

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 8) closeAndUnlock();
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      if (touchStartY - y > 24) closeAndUnlock();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(event.key)) closeAndUnlock();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    root.addEventListener("pointerdown", closeAndUnlock);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("pointerdown", closeAndUnlock);
      unlock();
    };
  }, [close, runId]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="intro-sequence" aria-label="Site introduction">
      <div className="intro-noise" aria-hidden="true" />
      <p className="intro-copy text-balance" aria-live="polite">
        {reduced ? (
          copy.split("\n").map((line, index) => (
            <span key={index} className="block">{line}</span>
          ))
        ) : (
          <DecryptedText
            key={runId}
            text={copy}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={short ? 10 : 26}
            encryptedClassName="intro-encrypted"
          />
        )}
      </p>
      <div className="intro-hint" aria-hidden="true">
        SCROLL DOWN TO ENTER <b>■</b>
      </div>
      <button type="button" className="intro-skip" onClick={close}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
