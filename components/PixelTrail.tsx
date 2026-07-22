"use client";

import { useEffect, useRef } from "react";

const CELL = 22;
const LIFETIME = 620;

type TrailCell = {
  x: number;
  y: number;
  born: number;
  bright: boolean;
};

export function PixelTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cells = new Map<string, TrailCell>();
    let rafId = 0;
    let lastGx = -1;
    let lastGy = -1;

    const resize = () => {
      canvas.width = host.clientWidth;
      canvas.height = host.clientHeight;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const addCell = (gx: number, gy: number) => {
      cells.set(`${gx}:${gy}`, {
        x: gx * CELL,
        y: gy * CELL,
        born: performance.now(),
        bright: Math.random() < 0.18,
      });
    };

    const loop = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [key, cell] of cells) {
        const age = (now - cell.born) / LIFETIME;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        // 分档量化透明度，得到跳变的像素感而不是平滑淡出
        const alpha = Math.ceil((1 - age) * 4) / 4;
        ctx.fillStyle = cell.bright
          ? `rgba(224, 250, 232, ${alpha * 0.85})`
          : `rgba(33, 163, 92, ${alpha * 0.75})`;
        ctx.fillRect(cell.x + 1, cell.y + 1, CELL - 1, CELL - 1);
      }

      if (cells.size > 0) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const gx = Math.floor(x / CELL);
      const gy = Math.floor(y / CELL);
      if (gx === lastGx && gy === lastGy) return;

      // 在上一格和当前格之间补齐中间格，快速划过时不断线
      if (lastGx !== -1) {
        const steps = Math.max(Math.abs(gx - lastGx), Math.abs(gy - lastGy));
        for (let i = 1; i <= steps; i += 1) {
          addCell(
            Math.round(lastGx + ((gx - lastGx) * i) / steps),
            Math.round(lastGy + ((gy - lastGy) * i) / steps),
          );
        }
      } else {
        addCell(gx, gy);
      }
      lastGx = gx;
      lastGy = gy;

      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    const onPointerLeave = () => {
      lastGx = -1;
      lastGy = -1;
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);

    return () => {
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pixel-trail" aria-hidden="true" />;
}
