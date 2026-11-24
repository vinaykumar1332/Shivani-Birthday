import { useId } from "react";
import { CandleFlameCanvas } from "./CandleFlameCanvas";
import "./NumberCandle.css";

const PALETTES = [
  { base: "#FFF8EF", stripe: "#F29A9A", edge: "#D9657A" },
  { base: "#FFF8EF", stripe: "#B8A1E3", edge: "#8B6CC9" },
];

// A numeral-shaped birthday candle (striped wax) with a wick and a real
// canvas flame on top.
export function NumberCandle({ digit, index = 0, lit }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const palette = PALETTES[index % PALETTES.length];
  const textProps = {
    x: 50,
    y: 132,
    textAnchor: "middle",
    fontSize: 128,
    fontWeight: 800,
    fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <div className="num-candle">
      <div className="num-candle__wick">
        <CandleFlameCanvas lit={lit} />
      </div>
      <svg className="num-candle__digit" viewBox="0 34 100 102" aria-hidden="true">
        <defs>
          <pattern id={`${id}s`} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(35)">
            <rect width="14" height="14" fill={palette.base} />
            <rect width="5" height="14" fill={palette.stripe} />
          </pattern>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.18" />
            <stop offset="0.35" stopColor="#FFF" stopOpacity="0.3" />
            <stop offset="0.6" stopColor="#FFF" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <text {...textProps} fill={`url(#${id}s)`} stroke={palette.edge} strokeWidth="5" strokeLinejoin="round" paintOrder="stroke">
          {digit}
        </text>
        <text {...textProps} fill={`url(#${id}g)`}>{digit}</text>
      </svg>
    </div>
  );
}
