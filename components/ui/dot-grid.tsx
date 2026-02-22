"use client";

import { useEffect, useRef } from "react";

interface Dot {
  ox: number; oy: number;
  x: number;  y: number;
  vx: number; vy: number;
}

export function DotGrid({
  spacing = 36,
  radius = 1.2,
  repelRadius = 100,
  repelStrength = 5,
}: {
  spacing?: number;
  radius?: number;
  repelRadius?: number;
  repelStrength?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let dots: Dot[] = [];

    function build() {
      if (!canvas) return;
      dots = [];
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const ox = c * spacing, oy = r * spacing;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      build();
    }

    function frame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouse.current;

      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repelRadius && dist > 0) {
          const f = (1 - dist / repelRadius) * repelStrength;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }

        d.vx += (d.ox - d.x) * 0.1;
        d.vy += (d.oy - d.y) * 0.1;
        d.vx *= 0.78; d.vy *= 0.78;
        d.x += d.vx;  d.y += d.vy;

        const disp = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
        const alpha = 0.1 + Math.min(disp / 5, 0.28);

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onLeave() {
      mouse.current = { x: -9999, y: -9999 };
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [spacing, radius, repelRadius, repelStrength]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}
