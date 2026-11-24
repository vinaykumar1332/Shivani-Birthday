// Canvas air traffic for the London scene: detailed side-profile airliners
// with shading, livery, window rows, blinking nav lights and spreading
// contrails. Small planes cruise high; a "hero" plane periodically swoops
// low and flies between the Tower Bridge towers. The canvas sits *behind*
// the skyline, so planes are naturally hidden by the towers and seen only
// through the sky gaps — that's what makes the fly-through read as real.

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LIVERIES = [
  { main: "#7B2CBF", dark: "#3C096C", accent: "#F6C453" },
  { main: "#D1478A", dark: "#7A1F4E", accent: "#FFFFFF" },
  { main: "#1D6FA3", dark: "#0B3C5D", accent: "#F6C453" },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function glowDot(ctx, x, y, color, radius) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

// Airliner in local units: nose at +x (~104), tail at -100, up is -y.
function drawAirliner(ctx, t, livery) {
  // far horizontal stabilizer
  ctx.fillStyle = "#9AA6B8";
  ctx.beginPath();
  ctx.moveTo(-78, -2);
  ctx.lineTo(-100, -14);
  ctx.lineTo(-92, -14);
  ctx.lineTo(-66, -2);
  ctx.fill();

  // tail fin with livery
  const fin = ctx.createLinearGradient(-100, -56, -56, -8);
  fin.addColorStop(0, livery.dark);
  fin.addColorStop(1, livery.main);
  ctx.fillStyle = fin;
  ctx.beginPath();
  ctx.moveTo(-70, -9);
  ctx.lineTo(-96, -56);
  ctx.lineTo(-84, -56);
  ctx.lineTo(-52, -9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = livery.accent;
  ctx.beginPath();
  ctx.arc(-80, -31, 5, 0, TAU);
  ctx.fill();

  // fuselage, shaded top-lit
  const body = ctx.createLinearGradient(0, -12, 0, 12);
  body.addColorStop(0, "#FFFFFF");
  body.addColorStop(0.55, "#E4E9F0");
  body.addColorStop(1, "#9EA9B8");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-96, -6);
  ctx.quadraticCurveTo(-60, -11, 0, -11);
  ctx.lineTo(70, -11);
  ctx.bezierCurveTo(92, -11, 102, -4, 104, 2);
  ctx.bezierCurveTo(102, 8, 92, 11, 70, 11);
  ctx.lineTo(-40, 11);
  ctx.quadraticCurveTo(-80, 10, -100, -2);
  ctx.closePath();
  ctx.fill();

  // livery stripes
  ctx.fillStyle = livery.main;
  ctx.fillRect(-60, 3, 140, 2.2);
  ctx.fillStyle = livery.accent;
  ctx.fillRect(-60, 5.6, 140, 1.2);

  // cabin windows, door, cockpit
  ctx.fillStyle = "#2B3550";
  for (let x = -62; x <= 66; x += 6.5) {
    ctx.beginPath();
    ctx.ellipse(x, -3, 1.6, 2, 0, 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(60, 70, 90, 0.5)";
  ctx.lineWidth = 0.8;
  ctx.strokeRect(74, -7, 5, 11);
  ctx.fillStyle = "#1E2740";
  ctx.beginPath();
  ctx.moveTo(86, -7);
  ctx.quadraticCurveTo(95, -6, 98, -2);
  ctx.lineTo(88, -2);
  ctx.closePath();
  ctx.fill();

  // near wing, swept back toward the viewer
  const wing = ctx.createLinearGradient(0, 4, -40, 40);
  wing.addColorStop(0, "#D5DCE6");
  wing.addColorStop(1, "#8E99AA");
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.moveTo(22, 4);
  ctx.lineTo(-18, 4);
  ctx.lineTo(-52, 36);
  ctx.lineTo(-40, 36);
  ctx.closePath();
  ctx.fill();

  // engine nacelle with intake
  const eng = ctx.createLinearGradient(0, 10, 0, 22);
  eng.addColorStop(0, "#EEF1F5");
  eng.addColorStop(1, "#8893A4");
  ctx.fillStyle = eng;
  roundRect(ctx, -6, 10, 30, 11, 5);
  ctx.fill();
  ctx.fillStyle = "#3A4358";
  ctx.beginPath();
  ctx.ellipse(24, 15.5, 2.2, 5, 0, 0, TAU);
  ctx.fill();

  // near horizontal stabilizer
  ctx.fillStyle = "#C3CBD7";
  ctx.beginPath();
  ctx.moveTo(-74, 1);
  ctx.lineTo(-98, 12);
  ctx.lineTo(-88, 12);
  ctx.lineTo(-62, 1);
  ctx.fill();

  // navigation lights: steady red wingtip blink + white tail strobe
  if (Math.sin(t * 5) > 0.2) glowDot(ctx, -46, 36, "rgba(255, 70, 70, 0.95)", 7);
  if (t % 1.2 < 0.1) glowDot(ctx, -92, -56, "rgba(255, 255, 255, 1)", 10);
}

function bezier(P, t) {
  const u = 1 - t;
  return {
    x: u * u * u * P[0].x + 3 * u * u * t * P[1].x + 3 * u * t * t * P[2].x + t * t * t * P[3].x,
    y: u * u * u * P[0].y + 3 * u * u * t * P[1].y + 3 * u * t * t * P[2].y + t * t * t * P[3].y,
  };
}

function bezierDeriv(P, t) {
  const u = 1 - t;
  return {
    x: 3 * u * u * (P[1].x - P[0].x) + 6 * u * t * (P[2].x - P[1].x) + 3 * t * t * (P[3].x - P[2].x),
    y: 3 * u * u * (P[1].y - P[0].y) + 6 * u * t * (P[2].y - P[1].y) + 3 * t * t * (P[3].y - P[2].y),
  };
}

export class AirTraffic {
  constructor(canvas, { getGap, onHeroLaunch } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.getGap = getGap;
    this.onHeroLaunch = onHeroLaunch;
    this.planes = [];
    this.running = false;
    this.raf = null;
    this.heroDir = 1;
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
    this.sizeFactor = Math.min(1.2, Math.max(0.6, this.w / 1200));
  }

  start() {
    if (this.running) return;
    this.running = true;
    const now = performance.now();
    this.last = now;
    this.nextFar = now + 400;
    this.nextHero = now + 1500;
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.planes = [];
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  destroy() {
    this.stop();
    this.observer.disconnect();
  }

  spawnFar() {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const scale = rand(0.16, 0.3) * this.sizeFactor;
    const speed = rand(40, 75) * (scale / 0.25);
    this.planes.push({
      kind: "far",
      dir,
      scale,
      x: dir === 1 ? -120 : this.w + 120,
      y: rand(0.06, 0.28) * this.h,
      vx: dir * speed,
      vy: rand(-4, 2),
      livery: pick(LIVERIES),
      trail: [],
      trailLife: 7000,
      lastTrail: 0,
    });
  }

  launchHero(now) {
    const gap = this.getGap?.();
    if (!gap || gap.h < 10) return;
    const dir = this.heroDir;
    this.heroDir = -dir; // alternate directions each pass
    const cy = gap.y + gap.h / 2;
    const scale = (gap.h * 0.42) / 60;
    // Path in "left-to-right" space, mirrored for right-to-left passes.
    const raw = [
      { x: -170 * scale, y: cy - gap.h * 1.1 },
      { x: gap.x - gap.w * 0.7, y: cy - gap.h * 0.05 },
      { x: gap.x + gap.w * 1.7, y: cy + gap.h * 0.05 },
      { x: this.w + 220 * scale, y: cy - gap.h * 1.8 },
    ];
    const P = dir === 1 ? raw : raw.map((p) => ({ x: this.w - p.x, y: p.y }));
    const duration = Math.max(3400, this.w * 4.4);
    this.planes.push({ kind: "hero", dir, scale, P, start: now, duration, livery: LIVERIES[0], trail: [], trailLife: 2600, lastTrail: 0 });
    this.onHeroLaunch?.(duration, dir);
  }

  // Local plane coordinates → canvas coordinates.
  toWorld(p, lx, ly) {
    const sx = lx * p.scale * p.dir;
    const sy = ly * p.scale;
    const c = Math.cos(p.angle);
    const s = Math.sin(p.angle);
    return { x: p.x + sx * c - sy * s, y: p.y + sx * s + sy * c };
  }

  tick = (now) => {
    if (!this.running) return;
    const dt = Math.min(50, now - this.last) / 1000;
    this.last = now;
    const t = now / 1000;
    const { ctx } = this;

    if (now >= this.nextFar && this.planes.filter((p) => p.kind === "far").length < 3) {
      this.spawnFar();
      this.nextFar = now + rand(5000, 9000);
    }
    if (now >= this.nextHero && !this.planes.some((p) => p.kind === "hero" && !p.finished)) {
      this.launchHero(now);
      this.nextHero = now + rand(8500, 11500);
    }

    // Move planes and lay contrail points from the engine exhaust.
    for (const p of this.planes) {
      if (p.kind === "far") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.angle = Math.atan2(p.vy * p.dir, p.vx * p.dir);
        p.finished = p.x < -300 || p.x > this.w + 300;
      } else {
        const k = (now - p.start) / p.duration;
        p.finished = k >= 1;
        const kk = Math.min(1, k);
        const pos = bezier(p.P, kk);
        const d = bezierDeriv(p.P, kk);
        p.x = pos.x;
        p.y = pos.y;
        p.angle = Math.atan2(d.y * p.dir, d.x * p.dir);
      }
      if (!p.finished && now - p.lastTrail > 45) {
        p.trail.push({ ...this.toWorld(p, -8, 15.5), born: now });
        p.lastTrail = now;
      }
      p.trail = p.trail.filter((pt) => now - pt.born < p.trailLife);
    }
    this.planes = this.planes.filter((p) => !p.finished || p.trail.length > 0);

    ctx.clearRect(0, 0, this.w, this.h);

    // Contrails: thin and bright at the engine, wider and fainter with age.
    ctx.lineCap = "round";
    for (const p of this.planes) {
      for (let i = 1; i < p.trail.length; i++) {
        const a = p.trail[i - 1];
        const b = p.trail[i];
        const age = (now - b.born) / p.trailLife;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * Math.pow(1 - age, 1.5)})`;
        ctx.lineWidth = (1.2 + age * 7) * p.scale * 6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const p of this.planes) {
      if (p.finished) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(p.dir * p.scale, p.scale);
      drawAirliner(ctx, t, p.livery);
      ctx.restore();
    }

    this.raf = requestAnimationFrame(this.tick);
  };
}
