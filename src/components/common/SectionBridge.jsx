import "./SectionBridge.css";

const SPARKS = [
  { x: 8, y: 52, s: 7, d: 0 },
  { x: 23, y: 30, s: 5, d: -1.1 },
  { x: 41, y: 66, s: 6, d: -2.3 },
  { x: 58, y: 38, s: 8, d: -0.6 },
  { x: 74, y: 60, s: 5, d: -1.8 },
  { x: 91, y: 34, s: 7, d: -2.9 },
];
const PETALS = [
  { x: 14, d: 0, c: "#F29A9A" },
  { x: 47, d: -3, c: "#B8A1E3" },
  { x: 82, d: -6, c: "#FFC69B" },
];

// A soft hand-off between two sections. The top fades out over the section
// above (so its exact colors don't matter), the middle passes through `via`,
// and the bottom lands exactly on the next section's top edge (`toL` → `toR`).
export function SectionBridge({ from, via, toL, toR = toL, glow = "rgba(255, 210, 122, 0.35)", overlap = 70 }) {
  const midStop = via ? `${via} 55%,` : "";
  return (
    <div
      className="bridge"
      aria-hidden="true"
      style={{
        "--overlap": `${overlap}px`,
        "--glow": glow,
        background: `linear-gradient(180deg, ${from} 0%, ${from} 22%, ${midStop} transparent 100%), linear-gradient(90deg, ${toL}, ${toR})`,
      }}
    >
      <span className="bridge__glow" />
      <span className="bridge__line" />
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="bridge__spark"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
        />
      ))}
      {PETALS.map((p, i) => (
        <span key={i} className="bridge__petal" style={{ left: `${p.x}%`, background: p.c, animationDelay: `${p.d}s` }} />
      ))}
    </div>
  );
}
