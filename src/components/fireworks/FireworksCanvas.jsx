import { useEffect, useRef } from "react";
import { FireworksEngine } from "./FireworksEngine";

// Mounts a FireworksEngine on a transparent canvas and hands it to the parent
// through engineRef, so the parent can choreograph the show.
export function FireworksCanvas({ engineRef, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intensity = reduced ? 0.45 : window.innerWidth < 640 ? 0.65 : 1;
    const engine = new FireworksEngine(canvasRef.current, { intensity });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [engineRef]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
