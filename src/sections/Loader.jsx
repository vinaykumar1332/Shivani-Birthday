import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowerIcon } from "../components/ui/Icons";
import { birthdayConfig } from "../data/birthdayConfig";
import "./Loader.css";

const MIN_VISIBLE_MS = 900;

export function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const target = useRef(0);

  // Preload every photo plus the web fonts; progress reflects real loading.
  useEffect(() => {
    const sources = birthdayConfig.photos;
    const total = sources.length + 1;
    let loaded = 0;
    const bump = () => {
      loaded += 1;
      target.current = Math.round((loaded / total) * 100);
    };

    sources.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(bump, bump);
  }, []);

  // Ease the displayed number toward the real target so it never jumps.
  useEffect(() => {
    let raf;
    let shown = 0;
    const start = performance.now();

    const tick = (now) => {
      shown += (target.current - shown) * 0.12;
      const value = target.current === 100 && target.current - shown < 0.5 ? 100 : Math.floor(shown);
      setProgress(value);

      if (value >= 100 && now - start >= MIN_VISIBLE_MS) {
        setTimeout(() => setExiting(true), 200);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div className="loader" exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6 } }}>
          <div className="loader__fireflies" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="loader__firefly" style={{ "--i": i }} />
            ))}
          </div>

          <motion.div
            className="loader__flower"
            initial={{ scale: 0, rotate: -120, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <FlowerIcon size={96} />
          </motion.div>

          <motion.h1
            className="loader__title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            The Birthday Universe
          </motion.h1>

          <div
            className="loader__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Loading the surprise"
          >
            <div className="loader__bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <span className="loader__pct">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
