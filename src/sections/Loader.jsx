import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowerIcon, SparkleIcon } from "../components/ui/Icons";
import { birthdayConfig } from "../data/birthdayConfig";
import "./Loader.css";

const MIN_VISIBLE_MS = 2200;
const RING_R = 88;
const RING_C = 2 * Math.PI * RING_R;

const STATUS = [
  [0, "Picking the prettiest flowers…"],
  [25, "Lighting 25 little candles…"],
  [50, "Wrapping your surprise…"],
  [75, "Waking up the crackers crew…"],
  [100, "Ready when you are ✨"],
];

export function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const target = useRef(0);
  const { nickname, age } = birthdayConfig;
  const status = (STATUS.findLast(([at]) => progress >= at) ?? STATUS[0])[1];

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

  // Ease the displayed number toward the real target so it never jumps, and
  // never faster than the minimum time so the intro gets to play.
  useEffect(() => {
    let raf;
    let shown = 0;
    const start = performance.now();

    const tick = (now) => {
      // rAF's timestamp can be slightly earlier than `start`, so clamp at 0.
      const timeCap = Math.min(100, Math.max(0, ((now - start) / MIN_VISIBLE_MS) * 100));
      const goal = Math.min(target.current, timeCap);
      shown += (goal - shown) * 0.08;
      const value = goal === 100 && 100 - shown < 0.6 ? 100 : Math.floor(shown);
      setProgress(value);

      if (value >= 100) {
        setTimeout(() => setExiting(true), 450);
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
        <motion.div
          className="loader"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)", transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div className="loader__aurora" aria-hidden="true">
            <span className="loader__aurora-blob loader__aurora-blob--1" />
            <span className="loader__aurora-blob loader__aurora-blob--2" />
            <span className="loader__aurora-blob loader__aurora-blob--3" />
          </div>
          <div className="loader__fireflies" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="loader__firefly" style={{ "--i": i, "--x": `${4 + ((i * 37) % 92)}%` }} />
            ))}
          </div>

          <motion.div
            className="loader__medallion"
            initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Loading the surprise"
          >
            <svg className="loader__ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <linearGradient id="loader-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFE38B" />
                  <stop offset="0.5" stopColor="#FF8FB1" />
                  <stop offset="1" stopColor="#C77DFF" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r={RING_R} className="loader__ring-track" />
              <circle
                cx="100"
                cy="100"
                r={RING_R}
                className="loader__ring-fill"
                stroke="url(#loader-ring)"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress / 100)}
              />
            </svg>

            <div className="loader__orbit" aria-hidden="true">
              <span className="loader__orbiter loader__orbiter--a"><SparkleIcon size={16} /></span>
              <span className="loader__orbiter loader__orbiter--b"><FlowerIcon size={20} /></span>
              <span className="loader__orbiter loader__orbiter--c"><SparkleIcon size={12} /></span>
            </div>

            <span className="loader__age">{age}</span>
            <span className="loader__pct">{progress}%</span>
          </motion.div>

          <h1 className="loader__name" aria-label={nickname}>
            {nickname.split("").map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={{ opacity: 0, y: 22, rotate: -10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.45 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </h1>

          <div className="loader__status" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                {status}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
