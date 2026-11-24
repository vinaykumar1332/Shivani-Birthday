import "./FallingDecor.css";

const ITEMS = ["⭐", "🌸", "✨", "🌼", "⭐", "🌸", "✨", "🌼", "⭐", "🌸", "✨", "🌼", "⭐", "🌸"];

// A sitewide, continuous drift of stars and petals falling top to bottom —
// fixed to the viewport so it plays over every section as you scroll.
export function FallingDecor() {
  return (
    <div className="falling-decor" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="falling-decor__item"
          style={{
            "--i": i,
            left: `${(i * 7.3) % 100}%`,
            animationDuration: `${10 + (i % 5) * 2.5}s`,
            animationDelay: `${-(i * 1.6)}s`,
            fontSize: `${0.9 + (i % 3) * 0.35}rem`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
