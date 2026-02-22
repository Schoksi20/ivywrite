"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number; y: number;
  vx: number; vy: number;
  r: number; g: number; b: number; a: number;
}

export function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const pts: Point[] = [
      { x: 0.1,  y: 0.15, vx:  0.00035, vy:  0.00025, r: 99,  g: 102, b: 241, a: 0.14 },
      { x: 0.85, y: 0.1,  vx: -0.0003,  vy:  0.0004,  r: 139, g: 92,  b: 246, a: 0.11 },
      { x: 0.5,  y: 0.75, vx:  0.0002,  vy: -0.0003,  r: 165, g: 180, b: 252, a: 0.09 },
      { x: 0.25, y: 0.85, vx:  0.0004,  vy: -0.0002,  r: 99,  g: 102, b: 241, a: 0.08 },
      { x: 0.75, y: 0.55, vx: -0.0003,  vy: -0.0002,  r: 124, g: 58,  b: 237, a: 0.10 },
      { x: 0.4,  y: 0.3,  vx: -0.00025, vy:  0.0003,  r: 167, g: 139, b: 250, a: 0.07 },
    ];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function frame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const R = Math.max(W, H) * 0.52;

      ctx.globalCompositeOperation = "lighter";
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const grd = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, R);
        grd.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${p.a})`);
        grd.addColorStop(0.45, `rgba(${p.r},${p.g},${p.b},${p.a * 0.25})`);
        grd.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, R, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    frame();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
