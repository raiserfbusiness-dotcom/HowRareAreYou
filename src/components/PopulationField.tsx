import React, { useEffect, useRef } from 'react';

interface PopulationFieldProps {
  density?: 'normal' | 'subtle';
}

interface PulseDot {
  x: number;
  y: number;
  progress: number;
  speed: number;
  isAccent: boolean;
}

export const PopulationField: React.FC<PopulationFieldProps> = ({ density = 'normal' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const spacing = density === 'normal' ? 30 : 40;
    let cols = Math.ceil(width / spacing);
    let rows = Math.ceil(height / spacing);

    // Pre-render static population grid to an offscreen canvas for 60fps zero-CPU overhead
    const offscreen = document.createElement('canvas');
    const buildStaticGrid = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      offscreen.width = width;
      offscreen.height = height;
      cols = Math.ceil(width / spacing);
      rows = Math.ceil(height / spacing);

      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;
      offCtx.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const seed = (r * 131 + c * 73) % 100;
          if (seed < 12) continue;
          const x = c * spacing + ((seed % 7) - 3);
          const y = r * spacing + (((seed * 3) % 7) - 3);
          const alpha = seed > 88 ? 0.20 : 0.09;

          offCtx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
          offCtx.beginPath();
          offCtx.arc(x, y, 1.1, 0, Math.PI * 2);
          offCtx.fill();
        }
      }
    };

    buildStaticGrid();

    if (prefersReducedMotion) {
      ctx.drawImage(offscreen, 0, 0);
      return;
    }

    const activePulses: PulseDot[] = [];
    const maxPulses = density === 'normal' ? 6 : 3;

    const spawnPulse = () => {
      const c = Math.floor(Math.random() * cols);
      const r = Math.floor(Math.random() * rows);
      const seed = (r * 131 + c * 73) % 100;
      const x = c * spacing + ((seed % 7) - 3);
      const y = r * spacing + (((seed * 3) % 7) - 3);
      activePulses.push({
        x,
        y,
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        isAccent: Math.random() > 0.35,
      });
    };

    for (let i = 0; i < maxPulses; i++) {
      spawnPulse();
      activePulses[i].progress = Math.random();
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0);

      for (let i = activePulses.length - 1; i >= 0; i--) {
        const p = activePulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          activePulses.splice(i, 1);
          spawnPulse();
          continue;
        }

        const intensity = Math.sin(p.progress * Math.PI);
        const radius = 1.7 + intensity * 1.5;

        if (p.isAccent) {
          ctx.fillStyle = `rgba(167, 139, 250, ${0.9 * intensity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(139, 92, 246, ${0.22 * intensity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${0.8 * intensity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    const handleResize = () => {
      buildStaticGrid();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-85"
    />
  );
};
