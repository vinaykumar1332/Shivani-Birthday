import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./ScratchCard.css";

const BRUSH = 24;

// A scratch-to-reveal card (mouse, touch and keyboard).
// - `bleed`: content fills the card edge to edge (for photos).
// - `active` + `autoRevealAfter`: once active, if nobody has started
//   scratching within that many ms, the card scratches itself clear.
export function ScratchCard({
  width = 280,
  height = 180,
  label = "Scratch Me",
  children,
  onReveal,
  bleed = false,
  active = true,
  autoRevealAfter = 0,
}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const touched = useRef(false);
  const clearedPx = useRef(0);
  const revealedRef = useRef(false);
  const autoRaf = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Paint the cover: a gradient foil with a soft diagonal sheen and the label.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#9478CF");
    grad.addColorStop(0.55, "#D1478A");
    grad.addColorStop(1, "#F2956E");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#FFFFFF";
    for (let x = -height; x < width; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.lineTo(x + height + 8, 0);
      ctx.lineTo(x + 8, height);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.font = "700 17px Inter, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, width / 2, height / 2);

    ctx.globalCompositeOperation = "destination-out";
  }, [width, height, label]);

  const reveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    cancelAnimationFrame(autoRaf.current);
    setRevealed(true);
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 }, colors: ["#B8A1E3", "#F29A9A", "#FFC69B", "#F6C453"] });
    onReveal?.();
  };

  const checkCleared = () => {
    if (revealedRef.current) return;
    clearedPx.current += 1;
    if (clearedPx.current % 8 !== 0) return;
    const canvas = canvasRef.current;
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      if (data[i] < 20) transparent++;
    }
    if (transparent / (data.length / (4 * 20)) > 0.55) reveal();
  };

  const scratchAtLocal = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
    checkCleared();
  };

  const scratchAt = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    scratchAtLocal(clientX - rect.left, clientY - rect.top);
  };

  // Auto-reveal: a zig-zag "invisible finger" sweeps the cover away.
  useEffect(() => {
    if (!active || !autoRevealAfter || revealedRef.current) return;
    const timer = setTimeout(() => {
      if (touched.current || revealedRef.current) return;
      const rows = Math.ceil(height / (BRUSH * 1.4));
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        if (revealedRef.current) return;
        const p = Math.min(1, (now - start) / duration);
        const row = p * rows;
        const y = (row / rows) * height;
        const x = Math.floor(row) % 2 === 0 ? (row % 1) * width : (1 - (row % 1)) * width;
        for (let k = 0; k < 3; k++) scratchAtLocal(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 16);
        if (p < 1) autoRaf.current = requestAnimationFrame(step);
        else reveal();
      };
      autoRaf.current = requestAnimationFrame(step);
    }, autoRevealAfter);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(autoRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, autoRevealAfter, width, height]);

  const handlePointerDown = (e) => {
    drawing.current = true;
    touched.current = true;
    scratchAt(e.clientX, e.clientY);
  };
  const handlePointerMove = (e) => {
    if (drawing.current) scratchAt(e.clientX, e.clientY);
  };
  const stopDrawing = () => {
    drawing.current = false;
  };

  return (
    <div className={`scratch-card ${revealed ? "scratch-card--revealed" : ""}`} style={{ width, height }}>
      <div className={`scratch-card__content ${bleed ? "scratch-card__content--bleed" : ""}`}>{children}</div>
      <canvas
        ref={canvasRef}
        className="scratch-card__canvas"
        style={{ width, height, opacity: revealed ? 0 : 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            reveal();
          }
        }}
        tabIndex={revealed ? -1 : 0}
        role="button"
        aria-label={`${label} — press Enter to reveal`}
      />
    </div>
  );
}
