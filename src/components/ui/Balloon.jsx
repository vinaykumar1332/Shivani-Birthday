export function Balloon({ color, size, className = "" }) {
  return (
    <svg className={className} width={size} height={size * 2.1} viewBox="0 0 50 105" aria-hidden="true">
      <path d="M25 58 Q 21 72 27 84 Q 31 94 24 104" stroke="rgba(255,248,239,0.6)" strokeWidth="1.2" fill="none" />
      <ellipse cx="25" cy="28" rx="21" ry="26" fill={color} />
      <path d="M21 53 L 29 53 L 25 59 Z" fill={color} />
      <ellipse cx="17" cy="18" rx="5" ry="8" fill="rgba(255,255,255,0.45)" transform="rotate(-20 17 18)" />
    </svg>
  );
}
