import { useEffect, useRef } from "react";

// Canvas size in CSS px. The flame's base sits near the bottom centre, on the wick.
const W = 64;
const H = 110;
const BASE_X = W / 2;
const BASE_Y = H - 4;
const rand = (a, b) => a + Math.random() * (b - a);

// A realistic candle flame: layered teardrop (orange body, white-hot core,
// blue base) with a warm glow, flickering on summed sine "noise". When `lit`
// turns false the flame leans as if blown, dies, and leaves an ember and a
// curl of smoke rising from the wick.
export function CandleFlameCanvas({ lit }) {
  const canvasRef = useRef(null);
  const state = useRef({
    lit,
    intensity: 0,
    wind: 0,
    windTarget: 0,
    blowAt: 0,
    ember: 0,
    smoke: [],
    raf: null,
    kick: null,
    t0: 0,
    seed: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = state.current;
    s.t0 = performance.now();
    s.seed = rand(0, 100); // each candle flickers on its own rhythm
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.3 : 1;

    const flamePath = (fw, fh, sway, lift = 0) => {
      const by = BASE_Y - lift;
      ctx.beginPath();
      ctx.moveTo(BASE_X, by);
      ctx.bezierCurveTo(BASE_X - fw * 1.1, by - fh * 0.08, BASE_X - fw * 0.8 + sway * 0.35, by - fh * 0.62, BASE_X + sway, by - fh);
      ctx.bezierCurveTo(BASE_X + fw * 0.8 + sway * 0.35, by - fh * 0.62, BASE_X + fw * 1.1, by - fh * 0.08, BASE_X, by);
      ctx.closePath();
    };

    const drawFlame = (t) => {
      const k = s.intensity;
      const tt = t + s.seed;
      const n1 = Math.sin(tt * 7.3) * 0.5 + Math.sin(tt * 13.1 + 1.7) * 0.3 + Math.sin(tt * 21.7 + 0.4) * 0.2;
      const n2 = Math.sin(tt * 9.7 + 2.2) * 0.6 + Math.sin(tt * 17.9) * 0.4;
      const windSquash = 1 - Math.min(0.5, Math.abs(s.wind) / 40);
      const h = 44 * k * (1 + n1 * 0.1 * calm) * windSquash;
      const w = 10.5 * k * (1 + n2 * 0.07 * calm);
      const sway = n2 * 2.2 * calm + s.wind;

      // Warm glow lighting the air around the flame.
      ctx.globalCompositeOperation = "lighter";
      const gx = BASE_X + sway * 0.4;
      const gy = BASE_Y - h * 0.45;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 48 * k);
      glow.addColorStop(0, `rgba(255, 190, 90, ${0.42 * k})`);
      glow.addColorStop(1, "rgba(255, 150, 50, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Outer flame body.
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowColor = "rgba(255, 140, 40, 0.9)";
      ctx.shadowBlur = 14;
      const body = ctx.createLinearGradient(0, BASE_Y, 0, BASE_Y - h);
      body.addColorStop(0, "rgba(255, 110, 30, 0.15)");
      body.addColorStop(0.25, "rgba(255, 130, 35, 0.95)");
      body.addColorStop(0.7, "rgba(255, 175, 60, 0.85)");
      body.addColorStop(1, "rgba(255, 210, 120, 0)");
      flamePath(w, h, sway);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.shadowBlur = 0;

      // White-hot inner core.
      ctx.globalCompositeOperation = "lighter";
      const ch = h * 0.62;
      const cy = BASE_Y - 2 - ch * 0.35;
      const core = ctx.createRadialGradient(BASE_X + sway * 0.15, cy, 0, BASE_X + sway * 0.15, cy, ch * 0.75);
      core.addColorStop(0, "rgba(255, 255, 245, 0.95)");
      core.addColorStop(0.5, "rgba(255, 240, 170, 0.8)");
      core.addColorStop(1, "rgba(255, 200, 90, 0)");
      flamePath(w * 0.55, ch, sway * 0.55, 2);
      ctx.fillStyle = core;
      ctx.fill();

      // Blue base where the wax vapour first burns.
      ctx.globalCompositeOperation = "source-over";
      const blue = ctx.createRadialGradient(BASE_X, BASE_Y - 3, 0, BASE_X, BASE_Y - 3, w * 0.8);
      blue.addColorStop(0, `rgba(90, 150, 255, ${0.55 * k})`);
      blue.addColorStop(1, "rgba(90, 150, 255, 0)");
      ctx.fillStyle = blue;
      ctx.beginPath();
      ctx.ellipse(BASE_X, BASE_Y - 3, Math.max(0.5, w * 0.8), Math.max(0.5, h * 0.12), 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSmoke = (t) => {
      ctx.globalCompositeOperation = "source-over";
      s.smoke = s.smoke.filter((p) => {
        p.x += p.vx + Math.sin(t * 2.2 + p.phase + p.y * 0.05) * 0.35;
        p.y += p.vy;
        p.r += 0.12;
        p.life -= 0.011;
        if (p.life <= 0 || p.y < -10) return false;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(215, 210, 225, ${0.22 * p.life})`);
        g.addColorStop(1, "rgba(215, 210, 225, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
    };

    const drawEmber = () => {
      const g = ctx.createRadialGradient(BASE_X, BASE_Y, 0, BASE_X, BASE_Y, 4);
      g.addColorStop(0, `rgba(255, 140, 50, ${s.ember})`);
      g.addColorStop(1, "rgba(255, 90, 30, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(BASE_X, BASE_Y, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (now) => {
      const t = (now - s.t0) / 1000;

      // Ignites gently; goes out fast once blown.
      const target = s.lit ? 1 : 0;
      s.intensity += (target - s.intensity) * (s.lit ? 0.06 : 0.16);
      if (Math.abs(target - s.intensity) < 0.003) s.intensity = target;
      s.wind += (s.windTarget - s.wind) * 0.22;
      if (!s.lit && s.intensity < 0.05) s.windTarget = 0;

      const sinceBlow = now - s.blowAt;
      if (!s.lit && s.blowAt && sinceBlow < 1800 && Math.random() < 0.7 - sinceBlow / 3000) {
        s.smoke.push({ x: BASE_X + rand(-1, 1), y: BASE_Y - 2, vx: rand(-0.15, 0.15) + s.wind * 0.02, vy: -rand(0.5, 0.9), r: rand(2, 3.5), life: 1, phase: rand(0, 6.28) });
      }
      if (!s.lit) s.ember = Math.max(0, s.ember - 0.009);

      ctx.clearRect(0, 0, W, H);
      drawSmoke(t);
      if (s.intensity > 0.01) drawFlame(t);
      if (!s.lit && s.ember > 0) drawEmber();

      const busy = s.lit || s.intensity > 0 || s.smoke.length > 0 || s.ember > 0;
      s.raf = busy ? requestAnimationFrame(frame) : null;
    };

    s.kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(frame);
    };
    s.kick();

    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = null;
      s.kick = null;
    };
  }, []);

  // React to lit/out transitions: a blow-out pushes the flame sideways and
  // starts the smoke; relighting resets the wind.
  useEffect(() => {
    const s = state.current;
    if (s.lit && !lit) {
      s.windTarget = rand(12, 18) * (Math.random() < 0.5 ? -1 : 1);
      s.blowAt = performance.now();
      s.ember = 1;
    } else if (!s.lit && lit) {
      s.windTarget = 0;
      s.wind = 0;
      s.blowAt = 0;
    }
    s.lit = lit;
    s.kick?.();
  }, [lit]);

  return <canvas ref={canvasRef} className="candle-flame-canvas" style={{ width: W, height: H }} aria-hidden="true" />;
}
