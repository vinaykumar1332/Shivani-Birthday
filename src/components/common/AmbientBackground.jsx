import { useEffect, useRef } from "react";
import "./AmbientBackground.css";

// Scroll speed of each blob — different speeds give the background real depth.
const DEPTHS = [0.06, -0.1, 0.14, -0.05, 0.09];

// A single fixed, full-page field of drifting color behind every section.
// Blobs parallax at different speeds as you scroll, and the whole palette
// slowly shifts from warm sunrise (top) to deep twilight (bottom).
export function AmbientBackground() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const blobs = root.querySelectorAll(".ambient-bg__blob");
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--progress", (y / max).toFixed(4));
      blobs.forEach((b, i) => {
        b.style.translate = `0 ${(-y * DEPTHS[i]).toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="ambient-bg" aria-hidden="true">
      <span className="ambient-bg__tint ambient-bg__tint--dusk" />
      <span className="ambient-bg__blob ambient-bg__blob--1" />
      <span className="ambient-bg__blob ambient-bg__blob--2" />
      <span className="ambient-bg__blob ambient-bg__blob--3" />
      <span className="ambient-bg__blob ambient-bg__blob--4" />
      <span className="ambient-bg__blob ambient-bg__blob--5" />
      <span className="ambient-bg__grain" />
    </div>
  );
}
