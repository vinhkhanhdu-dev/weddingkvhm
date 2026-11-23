import React, { useEffect, useRef } from 'react';

export interface FireworkTrigger {
  id: number;
  variant: 'grand' | 'celebration';
}

interface FireworksCanvasProps {
  trigger: FireworkTrigger | null;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  hueColor: string;
  accentColor: string;
  trail: Array<{ x: number; y: number }>;
  particleCount: number;
}

interface Spark {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  twinkle: boolean;
  phase: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const PALETTES: Array<{ primary: string; accent: string }> = [
  { primary: '#C88D2B', accent: '#FFE6A3' }, // Champagne Gold
  { primary: '#88292F', accent: '#E5989B' }, // Burgundy Crimson & Blush
  { primary: '#B87333', accent: '#F7D794' }, // Antique Bronze
  { primary: '#A8323A', accent: '#FFD6A5' }, // Royal Rose & Amber
  { primary: '#D4A039', accent: '#FFF4D2' }, // Warm Sunlit Gold
];

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const ringsRef = useRef<Shockwave[]>([]);
  const rafRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!trigger) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    const spawnBurst = (cx: number, cy: number, paletteIdx: number, count: number) => {
      const palette = PALETTES[paletteIdx % PALETTES.length];
      ringsRef.current.push({
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: 68 + Math.random() * 28,
        alpha: 0.45,
        color: palette.primary,
      });

      // Outer chrysanthemum ring + inner willow core
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.14;
        const speed = i % 3 === 0 ? 1.8 + Math.random() * 2.2 : 3.2 + Math.random() * 3.8;
        const color = i % 4 === 0 ? palette.accent : palette.primary;
        sparksRef.current.push({
          x: cx,
          y: cy,
          prevX: cx,
          prevY: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.009,
          color,
          size: i % 4 === 0 ? 1.8 : 2.3 + Math.random() * 1.1,
          twinkle: Math.random() > 0.35,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const launchRocket = (
      startXRatio: number,
      targetXRatio: number,
      targetYRatio: number,
      paletteIdx: number,
      particleCount: number
    ) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const startX = w * startXRatio;
      const startY = h * 0.92;
      const targetX = w * targetXRatio;
      const targetY = h * targetYRatio;
      const travelFrames = 26 + Math.random() * 10;
      const palette = PALETTES[paletteIdx % PALETTES.length];

      rocketsRef.current.push({
        x: startX,
        y: startY,
        vx: (targetX - startX) / travelFrames,
        vy: (targetY - startY) / travelFrames - 0.5 * 0.12 * travelFrames,
        targetY,
        hueColor: palette.primary,
        accentColor: palette.accent,
        trail: [],
        particleCount,
      });
    };

    const runLoop = () => {
      if (rafRef.current !== null) return;

      const tick = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        // Update & draw rising shells
        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i];
          r.trail.push({ x: r.x, y: r.y });
          if (r.trail.length > 10) r.trail.shift();

          r.x += r.vx;
          r.y += r.vy;
          r.vy += 0.12;

          // Draw rising golden trail
          if (r.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(r.trail[0].x, r.trail[0].y);
            for (let t = 1; t < r.trail.length; t++) {
              ctx.lineTo(r.trail[t].x, r.trail[t].y);
            }
            ctx.strokeStyle = r.hueColor;
            ctx.globalAlpha = 0.72;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = r.accentColor;
          ctx.globalAlpha = 0.95;
          ctx.fill();

          if (r.vy >= -0.8 || r.y <= r.targetY) {
            spawnBurst(r.x, r.y, i + Math.floor(Math.random() * PALETTES.length), r.particleCount);
            rocketsRef.current.splice(i, 1);
          }
        }

        // Update & draw shockwaves
        for (let i = ringsRef.current.length - 1; i >= 0; i--) {
          const ring = ringsRef.current[i];
          ring.radius += (ring.maxRadius - ring.radius) * 0.14;
          ring.alpha -= 0.022;
          if (ring.alpha <= 0) {
            ringsRef.current.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color;
          ctx.globalAlpha = ring.alpha;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }

        // Update & draw sparks
        for (let i = sparksRef.current.length - 1; i >= 0; i--) {
          const s = sparksRef.current[i];
          s.prevX = s.x;
          s.prevY = s.y;
          s.vx *= 0.962;
          s.vy *= 0.962;
          s.vy += 0.068;
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= s.decay;
          s.phase += 0.35;

          if (s.alpha <= 0.02) {
            sparksRef.current.splice(i, 1);
            continue;
          }

          const flicker = s.twinkle ? 0.65 + 0.35 * Math.sin(s.phase) : 1;
          const opacity = Math.max(0, Math.min(1, s.alpha * flicker));

          ctx.beginPath();
          ctx.moveTo(s.prevX, s.prevY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = opacity * 0.85;
          ctx.lineWidth = s.size;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.58, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF7DF';
          ctx.globalAlpha = opacity * 0.9;
          ctx.fill();
        }

        ctx.globalAlpha = 1;

        if (
          rocketsRef.current.length > 0 ||
          sparksRef.current.length > 0 ||
          ringsRef.current.length > 0
        ) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          ctx.clearRect(0, 0, w, h);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const scheduleLaunch = (
      delayMs: number,
      startXRatio: number,
      targetXRatio: number,
      targetYRatio: number,
      paletteIdx: number,
      particleCount: number
    ) => {
      const id = window.setTimeout(() => {
        launchRocket(startXRatio, targetXRatio, targetYRatio, paletteIdx, particleCount);
        runLoop();
      }, delayMs);
      timeoutsRef.current.push(id);
    };

    if (trigger.variant === 'grand') {
      scheduleLaunch(40, 0.24, 0.22, 0.24, 0, 62);
      scheduleLaunch(180, 0.76, 0.78, 0.22, 1, 64);
      scheduleLaunch(420, 0.5, 0.5, 0.18, 2, 72);
      scheduleLaunch(760, 0.34, 0.32, 0.3, 3, 56);
      scheduleLaunch(980, 0.68, 0.7, 0.28, 4, 58);
      scheduleLaunch(1260, 0.52, 0.5, 0.22, 0, 68);
    } else {
      scheduleLaunch(20, 0.62, 0.68, 0.24, 0, 56);
      scheduleLaunch(220, 0.38, 0.34, 0.28, 1, 54);
      scheduleLaunch(460, 0.54, 0.52, 0.2, 4, 62);
    }

    return () => {
      window.removeEventListener('resize', syncSize);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
};
