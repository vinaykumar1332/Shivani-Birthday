import { useId } from "react";
import "./Icons.css";

// useId output contains characters that break url(#id) references in SVG.
const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, "");

export function FlowerIcon({ size = 32, petal = "#F29A9A", petalLight = "#FFC69B", center = "#F6C453", className = "" }) {
  const id = useSvgId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}p`} cx="50%" cy="20%" r="85%">
          <stop offset="0%" stopColor={petalLight} />
          <stop offset="100%" stopColor={petal} />
        </radialGradient>
        <radialGradient id={`${id}c`}>
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor={center} />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="32" cy="17" rx="10" ry="15" fill={`url(#${id}p)`} transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="8" fill={`url(#${id}c)`} />
    </svg>
  );
}

export function ButterflyIcon({ size = 40, wing = "#B8A1E3", wingLight = "#F29A9A", flap = true, className = "" }) {
  const id = useSvgId();
  const fill = `url(#${id}w)`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`icon-butterfly ${flap ? "icon-butterfly--flap" : ""} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={wingLight} />
          <stop offset="100%" stopColor={wing} />
        </linearGradient>
      </defs>
      <g className="icon-butterfly__wing icon-butterfly__wing--l">
        <path d="M31 30 C 20 8, 2 10, 6 26 C 8 34, 20 34, 31 32 Z" fill={fill} />
        <path d="M31 34 C 18 36, 8 46, 16 54 C 22 58, 30 46, 31 36 Z" fill={fill} opacity="0.85" />
      </g>
      <g className="icon-butterfly__wing icon-butterfly__wing--r">
        <path d="M33 30 C 44 8, 62 10, 58 26 C 56 34, 44 34, 33 32 Z" fill={fill} />
        <path d="M33 34 C 46 36, 56 46, 48 54 C 42 58, 34 46, 33 36 Z" fill={fill} opacity="0.85" />
      </g>
      <ellipse cx="32" cy="34" rx="2" ry="12" fill="#30243F" />
      <path
        d="M31 23 C 29 16, 26 14, 24 13 M33 23 C 35 16, 38 14, 40 13"
        stroke="#30243F"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SparkleIcon({ size = 24, color = "#F6C453", colorLight = "#FFF3C4", className = "" }) {
  const id = useSvgId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}s`}>
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path
        d="M32 4 C 34 24, 40 30, 60 32 C 40 34, 34 40, 32 60 C 30 40, 24 34, 4 32 C 24 30, 30 24, 32 4 Z"
        fill={`url(#${id}s)`}
      />
    </svg>
  );
}

export function PetalIcon({ size = 20, color = "#F29A9A", colorLight = "#FFD9D2", className = "" }) {
  const id = useSvgId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="M32 6 C 48 18, 48 42, 32 58 C 16 42, 16 18, 32 6 Z" fill={`url(#${id}t)`} />
      <path d="M32 12 C 34 26, 34 40, 32 52" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
