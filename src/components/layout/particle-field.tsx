"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle constellation backdrop: drifting blue dots that link with thin lines
 * when near each other. Canvas-drawn (so it stays within the strict CSP — no
 * inline script), fixed behind content, masked to fade out toward the bottom.
 * Pauses entirely under prefers-reduced-motion, the accessibility "stop
 * animations" toggle, or when the tab is hidden.
 */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 130;
    let w = 0;
    let h = 0;
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    let raf = 0;

    function stopped() {
      const html = document.documentElement;
      return (
        reduce.matches ||
        !html.classList.contains("dark") || // dark-mode-only backdrop
        html.classList.contains("a11y-no-motion") ||
        document.hidden
      );
    }

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.floor((w * h) / 15000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const c = "96,165,250"; // blue-400
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.7)`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(${c},${0.45 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!stopped()) draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    draw(); // paint one frame even if motion is disabled
    if (!reduce.matches) raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="particle-field" aria-hidden />;
}
