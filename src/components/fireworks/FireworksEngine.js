// A small canvas particle engine for realistic fireworks: glowing sparks with
// motion streaks, gravity and drag, drawn with additive blending so overlapping
// light gets brighter like the real thing. The canvas stays transparent, so
// whatever sky is behind it shows through.

const TAU = Math.PI * 2;
const MAX_PARTICLES = 2600;

export const FIREWORK_COLORS = ["#FFD166", "#FF6B6B", "#C77DFF", "#4CC9F0", "#80ED99", "#F72585", "#FFA94D", "#FFFFFF"];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export class FireworksEngine {
  // intensity scales particle counts; sizeScale shrinks bursts (ambient mode).
  constructor(canvas, { intensity = 1, sizeScale = 1 } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.intensity = intensity;
    this.sizeScale = sizeScale;
    this.particles = [];
    this.rockets = [];
    this.emitters = [];
    this.flashes = [];
    this.rings = [];
    this.raf = null;
    this.last = 0;
    this.w = 0;
    this.h = 0;
    this.scale = 1;

    this.resize();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Smaller screens get smaller bursts so they still fit.
    this.scale = Math.min(1.2, Math.max(0.55, Math.min(this.w, this.h) / 700)) * this.sizeScale;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.observer.disconnect();
  }

  clear() {
    this.particles = [];
    this.rockets = [];
    this.emitters = [];
    this.flashes = [];
    this.rings = [];
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  // ---------- public effects ----------

  launchRocket({ x, targetY, flightMs = 1100, color = pick(FIREWORK_COLORS), pattern = "peony", onBurst }) {
    const startY = this.h + 10;
    this.rockets.push({ x0: x, x, y: startY, startY, targetY, start: performance.now(), flightMs, color, pattern, onBurst, drift: rand(-25, 25) });
    this.run();
  }

  fountain(x, y, durationMs = 3000, colors = ["#FFD166", "#FFF3C4", "#FFA94D", "#FFFFFF"]) {
    const now = performance.now();
    this.emitters.push({ type: "fountain", x, y, start: now, until: now + durationMs, colors });
    this.run();
  }

  chakri(x, y, durationMs = 3000, colors = ["#80ED99", "#FFD166", "#FFFFFF", "#4CC9F0"]) {
    const now = performance.now();
    this.emitters.push({ type: "chakri", x, y, angle: 0, start: now, until: now + durationMs, colors });
    this.run();
  }

  // getPos is called every frame so the sparkler follows a moving hand.
  sparkler(getPos, durationMs = 5000) {
    const now = performance.now();
    this.emitters.push({ type: "sparkler", getPos, start: now, until: now + durationMs });
    this.run();
  }

  bomb(x, y) {
    this.flash(x, y, 260 * this.scale, "#FFE8A3", 16);
    this.rings.push({ x, y, r: 6, life: 26, maxLife: 26 });
    const n = Math.round(70 * this.intensity);
    for (let i = 0; i < n; i++) {
      const a = rand(Math.PI, TAU); // upward hemisphere — it's on the ground
      const s = rand(2, 8) * this.scale;
      this.spark(x, y, Math.cos(a) * s, Math.sin(a) * s, {
        color: pick(["#FFD166", "#FFA94D", "#FF6B6B", "#FFFFFF"]),
        life: rand(22, 42),
        size: rand(1.4, 2.6),
        gravity: 0.14,
        drag: 0.93,
      });
    }
    this.run();
  }

  // ---------- internals ----------

  spark(x, y, vx, vy, { color, life = 60, size = 2, gravity = 0.05, drag = 0.985, flicker = false, glitter = false }) {
    if (this.particles.length >= MAX_PARTICLES) return;
    this.particles.push({ x, y, px: x, py: y, vx, vy, color, life, maxLife: life, size, gravity, drag, flicker, glitter });
  }

  flash(x, y, radius, color, life = 12) {
    this.flashes.push({ x, y, radius, color, life, maxLife: life });
  }

  explode(x, y, color, pattern) {
    const s = this.scale;
    const n = Math.round(rand(80, 115) * this.intensity);
    const second = pick(FIREWORK_COLORS);
    this.flash(x, y, 150 * s, color);

    for (let i = 0; i < n; i++) {
      let a = rand(0, TAU);
      if (pattern === "ring") {
        a = (i / n) * TAU;
        this.spark(x, y, Math.cos(a) * 4.4 * s, Math.sin(a) * 4.4 * s, { color, life: rand(55, 70), size: 2.2, gravity: 0.035, drag: 0.975 });
      } else if (pattern === "willow") {
        const sp = rand(1, 3.8) * s;
        this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, {
          color: pick(["#FFD166", "#FFE8A3", "#FFA94D"]),
          life: rand(110, 160),
          size: 1.6,
          gravity: 0.028,
          drag: 0.965,
          glitter: true,
        });
      } else if (pattern === "glitter") {
        const sp = 5.2 * Math.sqrt(Math.random()) * s;
        this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, {
          color: pick(["#FFFFFF", "#E6E6FA", "#FFD166"]),
          life: rand(60, 85),
          size: 1.8,
          gravity: 0.04,
          drag: 0.975,
          glitter: true,
          flicker: true,
        });
      } else {
        // peony: a full sphere, sqrt-distributed so it isn't hollow
        const sp = 5.4 * Math.sqrt(Math.random()) * s;
        this.spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, {
          color: i % 3 === 0 ? second : color,
          life: rand(50, 80),
          size: 2,
          gravity: 0.04,
          drag: 0.975,
          flicker: Math.random() < 0.3,
        });
      }
    }
  }

  run() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  tick = (now) => {
    // dt in "60fps frames", capped so a background tab doesn't explode physics.
    const dt = Math.min(2.5, (now - this.last) / 16.667);
    this.last = now;
    this.update(dt, now);
    this.draw(now);

    const idle = !this.particles.length && !this.rockets.length && !this.emitters.length && !this.flashes.length && !this.rings.length;
    if (idle) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.raf = null;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  update(dt, now) {
    const s = this.scale;

    this.rockets = this.rockets.filter((r) => {
      const t = (now - r.start) / r.flightMs;
      if (t >= 1) {
        this.explode(r.x, r.targetY, r.color, r.pattern);
        r.onBurst?.();
        return false;
      }
      const eased = 1 - (1 - t) * (1 - t);
      r.x = r.x0 + r.drift * t + Math.sin(t * 9) * 1.5;
      r.y = r.startY + (r.targetY - r.startY) * eased;
      for (let k = 0; k < 2; k++) {
        this.spark(r.x, r.y, rand(-0.4, 0.4), rand(0.6, 1.6), { color: "#FFD8A8", life: rand(12, 24), size: 1.4, gravity: 0.02, drag: 0.94 });
      }
      return true;
    });

    this.emitters = this.emitters.filter((e) => {
      if (now >= e.until) return false;
      // Ease in on ignition and taper off at the end, like a real cracker.
      const ramp = Math.min(1, (now - e.start) / 400, (e.until - now) / 500);

      if (e.type === "fountain") {
        const count = Math.round(8 * dt * this.intensity * ramp) + 1;
        for (let i = 0; i < count; i++) {
          this.spark(e.x + rand(-3, 3), e.y, rand(-1.5, 1.5) * s, -rand(4.5, 8.5) * s * (0.6 + 0.4 * ramp), {
            color: pick(e.colors),
            life: rand(40, 70),
            size: rand(1.2, 2.2),
            gravity: 0.1 * s,
            drag: 0.99,
            flicker: true,
          });
        }
      } else if (e.type === "chakri") {
        e.angle += 0.5 * dt;
        const jitterX = Math.sin(now / 90) * 1.5;
        for (let k = 0; k < 3; k++) {
          const a = e.angle + (k * TAU) / 3;
          const px = e.x + jitterX + Math.cos(a) * 9;
          const py = e.y + Math.sin(a) * 4.5;
          const sp = rand(2.6, 4.2) * s * ramp;
          this.spark(px, py, Math.cos(a + Math.PI / 2) * sp, Math.sin(a + Math.PI / 2) * sp * 0.5 - 0.6, {
            color: pick(e.colors),
            life: rand(16, 30),
            size: 1.6,
            gravity: 0.06,
            drag: 0.94,
          });
        }
      } else if (e.type === "sparkler") {
        const pos = e.getPos();
        if (pos) {
          const count = Math.round(6 * dt * this.intensity) + 1;
          for (let i = 0; i < count; i++) {
            const a = rand(0, TAU);
            const sp = rand(0.8, 3.4) * s;
            this.spark(pos.x, pos.y, Math.cos(a) * sp, Math.sin(a) * sp, {
              color: Math.random() < 0.6 ? "#FFFFFF" : "#FFE8A3",
              life: rand(6, 16),
              size: rand(0.8, 1.6),
              gravity: 0.03,
              drag: 0.9,
            });
          }
          e.lastPos = pos;
        }
      }
      return true;
    });

    const next = [];
    for (const p of this.particles) {
      p.px = p.x;
      p.py = p.y;
      const drag = Math.pow(p.drag, dt);
      p.vx *= drag;
      p.vy = p.vy * drag + p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.glitter && Math.random() < 0.06 * dt) {
        next.push({ x: p.x, y: p.y, px: p.x, py: p.y, vx: rand(-0.5, 0.5), vy: rand(-0.5, 0.5), color: "#FFFFFF", life: 10, maxLife: 10, size: 1, gravity: 0.02, drag: 0.9 });
      }
      if (p.life > 0 && p.y < this.h + 40 && p.x > -40 && p.x < this.w + 40) next.push(p);
    }
    this.particles = next;

    this.flashes = this.flashes.filter((f) => (f.life -= dt) > 0);
    this.rings = this.rings.filter((r) => {
      r.r += 9 * dt * s;
      return (r.life -= dt) > 0;
    });
  }

  draw(now) {
    const { ctx } = this;

    // Fade the previous frame instead of wiping it — that's what leaves the
    // light trails — while keeping the canvas itself transparent.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = "lighter";

    for (const f of this.flashes) {
      const alpha = (f.life / f.maxLife) * 0.55;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      g.addColorStop(0, f.color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, TAU);
      ctx.fill();
    }

    for (const r of this.rings) {
      ctx.globalAlpha = (r.life / r.maxLife) * 0.6;
      ctx.strokeStyle = "#FFF3C4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.45, 0, 0, TAU);
      ctx.stroke();
    }

    for (const e of this.emitters) {
      const pos = e.type === "sparkler" ? e.lastPos : e;
      if (!pos) continue;
      const radius = e.type === "fountain" ? 30 : e.type === "chakri" ? 20 : 12;
      const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      g.addColorStop(0, "rgba(255, 243, 196, 0.9)");
      g.addColorStop(1, "rgba(255, 209, 102, 0)");
      ctx.globalAlpha = 0.75 + Math.sin(now / 40) * 0.2;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, TAU);
      ctx.fill();
    }

    ctx.lineCap = "round";
    for (const p of this.particles) {
      let alpha = Math.min(1, (p.life / p.maxLife) * 1.4);
      if (p.flicker) alpha *= rand(0.45, 1);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
    }

    for (const r of this.rockets) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFF3C4";
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.6, 0, TAU);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}
