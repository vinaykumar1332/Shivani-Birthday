import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Loader.css";

export function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExiting(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [exiting, onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="loader"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="loader__fireflies">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="loader__firefly" style={{ "--i": i }} />
            ))}
          </div>

          <motion.div
            className="loader__flower"
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="loader__petal"
                style={{ transform: `rotate(${i * 60}deg)` }}
              />
            ))}
            <span className="loader__flower-center" />
          </motion.div>

          <motion.h1
            className="loader__title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            The Birthday Universe
          </motion.h1>

          <div className="loader__bar">
            <motion.div
              className="loader__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loader__pct">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
