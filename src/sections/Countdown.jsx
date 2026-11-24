import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireworksCanvas } from "../components/fireworks/FireworksCanvas";
import { SparklerGirl, FuseMonkey, PartyBoy, PartyBear, GraduateWoman } from "../components/characters/Characters";
import { birthdayConfig } from "../data/birthdayConfig";
import { Emphasized } from "../components/ui/SplitWords";
import { serverNow, unlockTime } from "../utils/serverTime";
import { DAY_MS, splitRemaining as split } from "../utils/unlock";
import "./Countdown.css";
const PATTERNS = ["peony", "ring", "willow", "glitter"];

const CREW = [
  { key: "girl", Character: SparklerGirl, props: { waving: true } },
  { key: "monkey", Character: FuseMonkey, props: { lighting: true } },
  { key: "boy", Character: PartyBoy, props: { cheering: true } },
  { key: "bear", Character: PartyBear, props: { cheering: true } },
  { key: "grad", Character: GraduateWoman, props: {} },
];

const STARS = Array.from({ length: 44 }, (_, i) => ({
  top: `${(i * 37) % 70}%`,
  left: `${(i * 53) % 100}%`,
  delay: `${i * -0.29}s`,
  size: i % 5 === 0 ? 3 : 2,
}));

// A hero jet taking off — bottom-left, climbing up and away to the top-right —
// plus a small distant plane crossing high the other way.
function Flights() {
  return (
    <div className="countdown__flight" aria-hidden="true">
      <div className="countdown__climb-x">
        <div className="countdown__climb-y">
          <div className="countdown__plane">
            <span className="countdown__trail countdown__trail--a" />
            <span className="countdown__trail countdown__trail--b" />
            <div className="countdown__wobble">
              <Jet id="hero" />
            </div>
          </div>
        </div>
      </div>
      <div className="countdown__far">
        <Jet id="far" />
      </div>
    </div>
  );
}

function Jet({ id }) {
  return (
        <svg viewBox="0 0 200 70">
          <defs>
            <linearGradient id={`cd-body-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#E4E2F0" />
              <stop offset="1" stopColor="#A9A4C4" />
            </linearGradient>
            <radialGradient id={`cd-glow-${id}`}>
              <stop offset="0" stopColor="#FFF1C1" />
              <stop offset="0.5" stopColor="#FF9F43" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FF6B35" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* far wing */}
          <path d="M92 30 L 70 6 L 82 6 L 116 30 Z" fill="#B8B3D3" />
          {/* tail fin */}
          <path d="M30 32 L 14 4 L 28 4 L 50 30 Z" fill="#F72585" />
          <path d="M14 30 L 6 22 L 14 22 L 30 30 Z" fill="#C9C5DF" />
          {/* fuselage */}
          <path d="M18 30 Q 20 24 40 24 L 160 24 Q 186 25 194 34 Q 186 42 160 42 L 40 42 Q 22 41 18 30 Z" fill={`url(#cd-body-${id})`} />
          {/* cheatline */}
          <path d="M30 35 L 186 35" stroke="#FFB347" strokeWidth="2" />
          {/* windows */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={58 + i * 9} y="28" width="4.5" height="4" rx="1.5" fill="#3B2F5C" />
          ))}
          <path d="M176 28 Q 184 29 188 32 L 178 32 Z" fill="#3B2F5C" />
          {/* near wing + engine */}
          <path d="M96 38 L 78 66 L 92 66 L 124 38 Z" fill="#D9D6EA" />
          <rect x="86" y="44" width="22" height="9" rx="4.5" fill="#8F89B0" />
          <circle className="countdown__nav-light" cx="80" cy="65" r="2.4" fill="#FF4D6D" />
          <circle className="countdown__nav-light countdown__nav-light--tail" cx="15" cy="5" r="2" fill="#FFFFFF" />
          <circle className="countdown__exhaust" cx="84" cy="48.5" r="5" fill={`url(#cd-glow-${id})`} />
        </svg>
  );
}

// Each digit rolls in from above when it changes, like a flip clock.
function Digit({ d }) {
  return (
    <span className="cd-digit">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={d}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
          exit={{ y: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label }) {
  const digits = String(value).padStart(2, "0").split("");
  return (
    <div className="cd-unit">
      <div className="cd-unit__tile">
        {digits.map((d, i) => (
          <Digit key={digits.length - i} d={d} />
        ))}
      </div>
      <span className="cd-unit__label">{label}</span>
    </div>
  );
}

export function Countdown({ onUnlock }) {
  const { countdown, nickname } = birthdayConfig;
  const [now, setNow] = useState(serverNow);
  const [speaker, setSpeaker] = useState(0);
  const engineRef = useRef(null);

  const remaining = unlockTime - now;
  const done = remaining <= 0;
  const t = split(remaining);
  const finalTen = !done && t.total <= 10;
  const progress = Math.min(1, Math.max(0, 1 - remaining / DAY_MS));

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setNow(serverNow()), 250);
    return () => clearInterval(id);
  }, [done]);

  // The crew takes turns talking so the bubbles never crowd a small screen.
  useEffect(() => {
    const id = setInterval(() => setSpeaker((s) => (s + 1) % CREW.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Gentle rockets while waiting, a rapid barrage in the last ten seconds,
  // and a full finale at midnight.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fire = () => {
      const e = engineRef.current;
      if (!e) return;
      e.launchRocket({
        x: e.w * (0.12 + Math.random() * 0.76),
        targetY: e.h * (0.1 + Math.random() * 0.3),
        flightMs: 950 + Math.random() * 500,
        pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
      });
    };
    if (done) {
      const timers = Array.from({ length: 16 }, (_, i) => setTimeout(fire, i * 170));
      return () => timers.forEach(clearTimeout);
    }
    const id = setInterval(fire, finalTen ? 420 : 1800);
    return () => clearInterval(id);
  }, [done, finalTen]);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(onUnlock, 3800);
    return () => clearTimeout(id);
  }, [done, onUnlock]);

  return (
    <motion.div
      className={`countdown ${finalTen ? "is-final" : ""} ${done ? "is-done" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6 } }}
    >
      <div className="countdown__sky" aria-hidden="true">
        <span className="countdown__moon" />
        {STARS.map((s, i) => (
          <span
            key={i}
            className="countdown__star"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
      </div>

      <Flights />
      <FireworksCanvas engineRef={engineRef} />

      <div className="countdown__content">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              className="countdown__done"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 190, damping: 13 }}
            >
              <p className="countdown__eyebrow">{countdown.doneEyebrow}</p>
              <h1 className="countdown__done-title">{countdown.doneTitle}</h1>
            </motion.div>
          ) : (
            <motion.div key="waiting" className="countdown__waiting" exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}>
              <motion.p
                className="countdown__eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {countdown.eyebrow}
              </motion.p>
              <motion.h1
                className="countdown__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {countdown.title}
                <span className="countdown__name">{nickname}</span>
              </motion.h1>
              <motion.p
                className="countdown__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <Emphasized text={countdown.subtitle} />
              </motion.p>

              <motion.div
                className="countdown__timer"
                role="timer"
                aria-label={`${t.days} days, ${t.hours} hours, ${t.minutes} minutes and ${t.seconds} seconds to go`}
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.75, type: "spring", stiffness: 160, damping: 18 }}
              >
                {t.days > 0 && <Unit value={t.days} label="Days" />}
                <Unit value={t.hours} label="Hours" />
                <Unit value={t.minutes} label="Minutes" />
                <Unit value={t.seconds} label="Seconds" />
              </motion.div>

              <motion.div
                className="countdown__progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="countdown__bar">
                  <div className="countdown__bar-fill" style={{ transform: `scaleX(${progress})` }} />
                </div>
                <span className="countdown__bar-label">
                  {Math.floor(progress * 100)}% {countdown.progressLabel}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {finalTen && (
          <motion.div
            key={t.seconds}
            className="countdown__big"
            aria-hidden="true"
            initial={{ scale: 2.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.25 } }}
          >
            {t.seconds}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="countdown__crew">
        {CREW.map(({ key, Character, props }, i) => (
          <motion.div
            key={key}
            className={`countdown__member countdown__member--${key}`}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 150, damping: 14 }}
          >
            <div className="countdown__bubble-anchor" data-edge={i === 0 ? "start" : i === CREW.length - 1 ? "end" : "mid"}>
              <AnimatePresence>
                {(speaker === i || done) && (
                  <motion.p
                    className="countdown__bubble"
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {done ? "🎉" : countdown.crewLines[i]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="countdown__bob" style={{ animationDelay: `${i * -0.45}s` }}>
              <Character {...props} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
