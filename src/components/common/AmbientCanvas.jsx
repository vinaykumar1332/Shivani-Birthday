import { useEffect, useRef } from "react";
import { FireworksEngine } from "../fireworks/FireworksEngine";
import "./AmbientCanvas.css";

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PETAL_COLORS = [
  ["#F29A9A", "#FFD9D2"],
  ["#B8A1E3", "#E9DEFF"],
  ["#FFA363", "#FFE0C2"],
  ["#F6C453", "#FFF3C4"],
];

function makePetal(w, h, fromTop) {
  const [color, light] = pick(PETAL_COLORS);
  return {
    kind: Math.random() < 0.25 ? "flower" : "petal",
    x: rand(0, w),
    y: fromTop ? rand(-80, -10) : rand(0, h),
    size: rand(6, 12),
    fall: rand(0.35, 0.85),
    swayAmp: rand(0.35, 1.1),
    swayFreq: rand(0.5, 1.3),
    phase: rand(0, TAU),
    rot: rand(0, TAU),
    spin: rand(-0.018, 0.018),
    flip: rand(0, TAU),
    flipSpeed: rand(0.02, 0.05),
    color,
    light,
    alpha: rand(0.55, 0.9),
  };
}

// One sitewide, fixed canvas layer:
//  - flower petals and little flowers tumbling down (they "flip" in 3D),
//  - pushed along by scroll velocity so the page feels alive as you move,
//  - twinkling sparkles,
//  - and a second canvas where small, silent crackers burst every few seconds.
export function AmbientCanvas() {
  const petalRef = useRef(null);
  const sparkRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = petalRef.current;
    const ctx = canvas.getContext("2d");
    const mobile = window.innerWidth < 640;
    const count = mobile ? 14 : 28;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const petals = Array.from({ length: count }, () => makePetal(w, h, false));
    const sparkles = Array.from({ length: mobile ? 8 : 14 }, () => ({ x: rand(0, 1), y: rand(0, 1), phase: rand(0, TAU), size: rand(4, 8) }));

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // cos(flip) squashes the shape horizontally — reads as a 3D tumble.
      const squash = Math.cos(p.flip);
      ctx.scale(Math.abs(squash) < 0.2 ? 0.2 * Math.sign(squash || 1) : squash, 1);
      ctx.globalAlpha = p.alpha;
      const s = p.size;
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, p.light);
      grad.addColorStop(1, p.color);
      ctx.fillStyle = grad;

      if (p.kind === "flower") {
        for (let k = 0; k < 5; k++) {
          ctx.save();
          ctx.rotate((k * TAU) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -s * 0.55, s * 0.32, s * 0.5, 0, 0, TAU);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = "#FFE38B";
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.25, 0, TAU);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.7, s * 0.6, 0, s);
        ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.5, 0, -s);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawSparkle = (sp, t) => {
      const a = Math.max(0, Math.sin(t * 1.6 + sp.phase));
      if (a < 0.05) return;
      const x = sp.x * w;
      const y = sp.y * h;
      const s = sp.size * (0.6 + 0.4 * a);
      ctx.globalAlpha = a * 0.8;
      ctx.fillStyle = "#FFF3C4";
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s);
      ctx.fill();
    };

    // Scroll velocity, smoothed — petals drift with it like they're caught in a breeze.
    let lastScroll = window.scrollY;
    let velocity = 0;

    let raf;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(2.5, (now - last) / 16.667);
      last = now;
      const t = now / 1000;

      const scrollY = window.scrollY;
      velocity = velocity * 0.85 + (scrollY - lastScroll) * 0.15;
      lastScroll = scrollY;

      ctx.clearRect(0, 0, w, h);

      for (const sp of sparkles) drawSparkle(sp, t);

      for (const p of petals) {
        p.y += (p.fall - velocity * 0.35) * dt;
        p.x += Math.sin(t * p.swayFreq + p.phase) * p.swayAmp * dt + Math.sin(p.phase + p.y * 0.01) * Math.abs(velocity) * 0.04;
        p.rot += (p.spin + velocity * 0.0015) * dt;
        p.flip += p.flipSpeed * dt;
        if (p.y > h + 30) Object.assign(p, makePetal(w, h, true));
        else if (p.y < -90) Object.assign(p, makePetal(w, h, false), { y: h + 20 });
        if (p.x < -30) p.x = w + 20;
        else if (p.x > w + 30) p.x = -20;
        drawPetal(p);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    startLoop();

    // Small, silent crackers bursting high on the screen every few seconds.
    const engine = new FireworksEngine(sparkRef.current, { intensity: mobile ? 0.25 : 0.35, sizeScale: 0.5 });
    let crackerTimer;
    const scheduleCracker = () => {
      crackerTimer = setTimeout(() => {
        // Skip while the full fireworks show is on screen — it has its own.
        const show = document.getElementById("fireworks")?.getBoundingClientRect();
        const showVisible = show && show.top < window.innerHeight && show.bottom > 0;
        if (!document.hidden && !showVisible) {
          engine.launchRocket({
            x: rand(0.1, 0.9) * engine.w,
            targetY: rand(0.08, 0.32) * engine.h,
            flightMs: rand(1000, 1400),
            pattern: pick(["peony", "ring", "glitter", "willow"]),
          });
        }
        scheduleCracker();
      }, mobile ? rand(7000, 11000) : rand(4500, 8000));
    };
    scheduleCracker();

    // Don't burn battery in a background tab.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) startLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(crackerTimer);
      engine.destroy();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={sparkRef} className="ambient-canvas ambient-canvas--sparks" aria-hidden="true" />
      <canvas ref={petalRef} className="ambient-canvas ambient-canvas--petals" aria-hidden="true" />
    </>
  );
}
