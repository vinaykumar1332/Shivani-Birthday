import { useState } from "react";
import "./LondonSkyline.css";

// Deterministic far-city blocks (seeded so the skyline never reshuffles).
const FAR_BLOCKS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const blocks = [];
  let x = 0;
  while (x < 1200) {
    const w = 30 + rnd() * 50;
    const h = 60 + rnd() * 140;
    const lights = Array.from({ length: 2 + Math.floor(rnd() * 5) }, () => ({ dx: 4 + rnd() * (w - 10), dy: 10 + rnd() * (h - 24), d: rnd() * 6 }));
    blocks.push({ x, w, h, lights });
    x += w + 4;
  }
  return blocks;
})();

// Tower Bridge suspension hangers: points along each chain curve.
const quad = (p0, p1, p2, t) => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
});
const HANGERS = [
  ...Array.from({ length: 7 }, (_, i) => quad({ x: 470, y: 165 }, { x: 400, y: 280 }, { x: 320, y: 300 }, (i + 1) / 8)),
  ...Array.from({ length: 7 }, (_, i) => quad({ x: 730, y: 165 }, { x: 800, y: 280 }, { x: 880, y: 300 }, (i + 1) / 8)),
];

const EYE = { cx: 1010, cy: 235, r: 135 };
const CAPSULES = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  return { x: EYE.cx + Math.cos(a) * EYE.r, y: EYE.cy + Math.sin(a) * EYE.r };
});

function TowerBridgeTower({ x }) {
  return (
    <g>
      <rect x={x} y="150" width="60" height="250" fill="#262047" />
      <path d={`M${x - 4} 150 L${x + 30} 108 L${x + 64} 150 Z`} fill="#1E1840" />
      {[x - 2, x + 54].map((px) => (
        <path key={px} d={`M${px} 150 L${px + 4} 118 L${px + 8} 150 Z`} fill="#1E1840" />
      ))}
      {[200, 250, 345].map((wy) => (
        <path
          key={wy}
          className="sky-window"
          d={`M${x + 22} ${wy + 22} L${x + 22} ${wy + 8} Q${x + 30} ${wy} ${x + 38} ${wy + 8} L${x + 38} ${wy + 22} Z`}
          fill="#FFC46B"
          style={{ animationDelay: `${(x + wy) % 5}s` }}
        />
      ))}
      <rect x={x - 8} y="380" width="76" height="20" fill="#1C1638" />
    </g>
  );
}

// A sunset London skyline: Parliament + Big Ben, Tower Bridge, the Shard and
// the London Eye. `gapRef` marks the open sky between the bridge towers.
export function LondonSkyline({ gapRef, reflection = false }) {
  // Big Ben shows the real time: animations start offset to the current minute/hour.
  const [clock] = useState(() => {
    const now = new Date();
    const sec = now.getMinutes() * 60 + now.getSeconds();
    return { minuteDelay: -sec, hourDelay: -((now.getHours() % 12) * 3600 + sec) };
  });

  return (
    <svg
      className={`london-skyline ${reflection ? "london-skyline--reflection" : ""}`}
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* far city blocks with twinkling windows */}
      <g opacity="0.85">
        {FAR_BLOCKS.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={400 - b.h} width={b.w} height={b.h} fill="#2E2757" />
            {b.lights.map((l, j) => (
              <rect key={j} className="sky-window" x={b.x + l.dx} y={400 - b.h + l.dy} width="3" height="4" fill="#FFD98A" style={{ animationDelay: `${l.d}s` }} />
            ))}
          </g>
        ))}
        {/* the Shard */}
        <path d="M902 70 L866 400 L940 400 Z" fill="#3A3570" />
        <path d="M902 70 L902 400 L940 400 Z" fill="#45407D" />
      </g>

      {/* Houses of Parliament */}
      <g fill="#1C1638">
        <rect x="20" y="335" width="320" height="65" />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${30 + i * 28} 335 L${36 + i * 28} 312 L${42 + i * 28} 335 Z`} />
        ))}
        <rect x="270" y="290" width="36" height="110" />
        <path d="M266 290 L288 252 L310 290 Z" />
      </g>

      {/* Big Ben (Elizabeth Tower) with a glowing, real-time clock */}
      <g>
        <rect x="150" y="200" width="40" height="200" fill="#211A40" />
        <rect x="146" y="150" width="48" height="52" fill="#262047" />
        <circle cx="170" cy="176" r="17" fill="#FFE9B0" className="bigben-face" />
        <g className="bigben-hand bigben-hand--hour" style={{ animationDelay: `${clock.hourDelay}s` }}>
          <line x1="170" y1="176" x2="170" y2="166" stroke="#2B1B14" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g className="bigben-hand bigben-hand--minute" style={{ animationDelay: `${clock.minuteDelay}s` }}>
          <line x1="170" y1="176" x2="170" y2="162" stroke="#2B1B14" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <rect x="152" y="120" width="36" height="30" fill="#211A40" />
        <path d="M150 120 L170 38 L190 120 Z" fill="#1C1638" />
        <line x1="170" y1="38" x2="170" y2="24" stroke="#1C1638" strokeWidth="2" />
      </g>

      {/* Tower Bridge */}
      <g>
        <path d="M470 165 Q 400 280 320 300" stroke="#7FB2E0" strokeWidth="5" fill="none" />
        <path d="M730 165 Q 800 280 880 300" stroke="#7FB2E0" strokeWidth="5" fill="none" />
        {HANGERS.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={p.x} y2="300" stroke="#7FB2E0" strokeWidth="1.2" opacity="0.8" />
        ))}
        <rect x="300" y="300" width="170" height="10" fill="#1C1638" />
        <rect x="730" y="300" width="170" height="10" fill="#1C1638" />
        <rect x="530" y="296" width="140" height="12" fill="#262047" />
        <rect x="530" y="172" width="140" height="8" fill="#262047" />
        <rect x="530" y="186" width="140" height="8" fill="#262047" />
        <line x1="530" y1="181" x2="670" y2="181" stroke="#7FB2E0" strokeWidth="1.5" />
        <line x1="530" y1="301" x2="670" y2="301" stroke="#7FB2E0" strokeWidth="1.5" />
        <TowerBridgeTower x={470} />
        <TowerBridgeTower x={670} />
        {/* open sky between the towers — the hero plane flies through here */}
        {!reflection && <rect ref={gapRef} x="532" y="196" width="136" height="98" fill="transparent" />}
      </g>

      {/* London Eye, slowly turning */}
      <g>
        <line x1={EYE.cx} y1={EYE.cy} x2="955" y2="400" stroke="#2A2350" strokeWidth="8" />
        <line x1={EYE.cx} y1={EYE.cy} x2="1065" y2="400" stroke="#2A2350" strokeWidth="8" />
        <g className="london-eye__wheel">
          <circle cx={EYE.cx} cy={EYE.cy} r={EYE.r} fill="none" stroke="#3E3578" strokeWidth="4" />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line key={i} x1={EYE.cx} y1={EYE.cy} x2={EYE.cx + Math.cos(a) * EYE.r} y2={EYE.cy + Math.sin(a) * EYE.r} stroke="#3E3578" strokeWidth="1.2" />
            );
          })}
          {CAPSULES.map((c, i) => (
            <ellipse key={i} cx={c.x} cy={c.y} rx="6" ry="4" fill="#F7A1C4" className="london-eye__capsule" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </g>
        <circle cx={EYE.cx} cy={EYE.cy} r="9" fill="#3E3578" />
      </g>
    </svg>
  );
}
