import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FireworksCanvas } from "../components/fireworks/FireworksCanvas";
import { FIREWORK_COLORS } from "../components/fireworks/FireworksEngine";
import { playRocketWhistle, playBurst, playFountain, playBirthdayMelody, speak } from "../utils/sound";
import { birthdayConfig } from "../data/birthdayConfig";
import "./WishOpening.css";

const PHASE = { GATE: "gate", POPPING: "popping", REVEALED: "revealed" };
const BURST_COLORS = ["#F6C453", "#D1478A", "#B8A1E3", "#FFC69B", "#7FFFD4", "#FF6B6B"];
const PATTERNS = ["peony", "ring", "willow", "glitter"];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function WishOpening({ onContinue }) {
  const [phase, setPhase] = useState(PHASE.GATE);
  const [exiting, setExiting] = useState(false);
  const engineRef = useRef(null);
  const fired = useRef(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const bigBurst = () =>
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.4 },
      colors: BURST_COLORS,
    });

  const fireRocket = (pattern = pick(PATTERNS)) => {
    const engine = engineRef.current;
    if (!engine) return;
    const flightMs = rand(850, 1200);
    playRocketWhistle(flightMs);
    engine.launchRocket({
      x: rand(0.12, 0.88) * engine.w,
      targetY: rand(0.12, 0.38) * engine.h,
      flightMs,
      pattern,
      color: pick(FIREWORK_COLORS),
      onBurst: () => playBurst(pattern === "willow"),
    });
  };

  const open = () => {
    if (fired.current) return;
    fired.current = true;
    setPhase(PHASE.POPPING);

    // Anaar fountains on both sides while a volley of rockets goes up.
    const engine = engineRef.current;
    if (engine) {
      engine.fountain(engine.w * 0.1, engine.h, 3600);
      engine.fountain(engine.w * 0.9, engine.h, 3600);
      playFountain(3600);
    }
    for (let i = 0; i < 7; i++) schedule(() => fireRocket(PATTERNS[i % PATTERNS.length]), 200 + i * 340);

    schedule(() => {
      setPhase(PHASE.REVEALED);

      const duration = playBirthdayMelody();
      speak(birthdayConfig.wishOpening.spokenMessage);

      bigBurst();
      const burstInterval = setInterval(() => {
        bigBurst();
        fireRocket();
      }, 1100);
      timers.current.push(burstInterval);

      schedule(() => {
        clearInterval(burstInterval);
        setExiting(true);
        schedule(onContinue, 700);
      }, Math.max(duration, 3200));
    }, 200 + 6 * 340 + 1500);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div className="wish" exit={{ opacity: 0, transition: { duration: 0.6 } }}>
          <div className="wish__glow" aria-hidden="true" />
          <div className="wish__orbs" aria-hidden="true">
            <span className="wish__orb wish__orb--1" />
            <span className="wish__orb wish__orb--2" />
            <span className="wish__orb wish__orb--3" />
          </div>
          <div className="wish__garland" aria-hidden="true">
            {Array.from({ length: 13 }).map((_, i) => {
              const n = 13;
              const x = i / (n - 1);
              const top = -4 * 70 * x * (x - 1); // parabolic arc peaking at the center
              return (
                <span
                  key={i}
                  className="wish__garland-light"
                  style={{ left: `${x * 100}%`, top: `${top}px`, animationDelay: `${-(i * 0.18)}s` }}
                />
              );
            })}
          </div>
          <div className="wish__sparkles" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="wish__sparkle" style={{ "--i": i }} />
            ))}
          </div>

          {phase === PHASE.GATE && (
            <motion.div
              className="wish__gate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wish__cake-stage">
                <span className="wish__cake-spotlight" aria-hidden="true" />
                <span className="wish__cake" aria-hidden="true">🎂</span>
              </div>
              <h1 className="wish__title">
                {birthdayConfig.wishOpening.title}
                <span className="wish__name">{birthdayConfig.wishOpening.name}</span>
              </h1>
              <motion.div
                className="wish__cta-wrap"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "backOut" }}
              >
                <motion.button
                  className="wish__cta"
                  onClick={open}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="wish__cta-shimmer" aria-hidden="true" />
                  <span>{birthdayConfig.wishOpening.cta}</span>
                </motion.button>
              </motion.div>
              <p className="wish__hint">Turn your sound on for the full surprise</p>
            </motion.div>
          )}

          <FireworksCanvas engineRef={engineRef} className="wish__fw-canvas" />

          {phase === PHASE.POPPING && (
            <div className="wish__fireworks-stage">
              <motion.p
                className="wish__hint wish__hint--loud"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
              >
                Let's go! 🎆
              </motion.p>
            </div>
          )}

          {phase === PHASE.REVEALED && (
            <motion.div
              className="wish__reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.h1
                className="wish__title wish__title--big"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: "backOut" }}
              >
                {birthdayConfig.wishOpening.title}
                <span className="wish__name">{birthdayConfig.wishOpening.name}</span>
              </motion.h1>
              <motion.span
                className="wish__age"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
              >
                {birthdayConfig.wishOpening.ageLine}
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
