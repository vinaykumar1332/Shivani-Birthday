import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./ScratchCard.css";

// A scratch-to-reveal card. Works with mouse drag and touch.
export function ScratchCard({ width = 280, height = 180, label = "Scratch Me", children, onReveal }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const clearedPx = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#9478CF");
    grad.addColorStop(1, "#E1696F");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.font = "700 16px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, width / 2, height / 2);

    ctx.globalCompositeOperation = "destination-out";
  }, [width, height, label]);

  const checkCleared = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    clearedPx.current += 1;
    if (clearedPx.current % 8 !== 0) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      if (data[i] < 20) transparent++;
    }
    const ratio = transparent / (data.length / (4 * 20));
    if (ratio > 0.55 && !revealed) {
      setRevealed(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#B8A1E3", "#F29A9A", "#FFC69B"] });
      onReveal?.();
    }
  };

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    checkCleared();
  };

  const handlePointerDown = (e) => {
    drawing.current = true;
    scratchAt(e.clientX, e.clientY);
  };
  const handlePointerMove = (e) => {
    if (!drawing.current) return;
    scratchAt(e.clientX, e.clientY);
  };
  const stopDrawing = () => { drawing.current = false; };

  return (
    <div
      ref={wrapRef}
      className={`scratch-card ${revealed ? "scratch-card--revealed" : ""}`}
      style={{ width, height }}
    >
      <div className="scratch-card__content">{children}</div>
      <canvas
        ref={canvasRef}
        className="scratch-card__canvas"
        style={{ width, height, opacity: revealed ? 0 : 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        aria-label="Scratch to reveal the surprise"
        role="img"
      />
    </div>
  );
}
