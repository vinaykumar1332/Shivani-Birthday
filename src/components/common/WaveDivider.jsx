// A shaped edge between sections — breaks the flat "stacked rectangles" look.
export function WaveDivider({ flip = false, color = "var(--color-bg)" }) {
  return (
    <svg
      className="wave-divider"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "60px",
        transform: flip ? "scaleY(-1)" : undefined,
        position: "relative",
        zIndex: 2,
        marginBottom: "-1px",
      }}
    >
      <path
        d="M0,40 C240,100 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z"
        fill={color}
      />
    </svg>
  );
}
