import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCardsBurst } from "../../utils/sound";
import { birthdayConfig } from "../../data/birthdayConfig";
import "./CardsReveal.css";

const FAN = [
  { x: -150, y: -30, rot: -16 },
  { x: -52, y: -62, rot: -5 },
  { x: 52, y: -62, rot: 5 },
  { x: 150, y: -30, rot: 16 },
];

export function CardsReveal({ active }) {
  const cards = birthdayConfig.cake.cards;
  const [flipped, setFlipped] = useState(() => cards.map(() => false));

  useEffect(() => {
    if (!active) return;
    const { events } = playCardsBurst(cards.length);
    const timers = events.map((ev, i) =>
      setTimeout(() => {
        setFlipped((f) => {
          const next = [...f];
          next[i] = true;
          return next;
        });
      }, ev.delayMs + 260)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="cards-reveal" aria-live="polite">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              className="playing-card"
              initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
              animate={{ x: FAN[i].x, y: FAN[i].y, scale: 1, rotate: FAN[i].rot, opacity: 1 }}
              transition={{ delay: i * 0.16, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.div
                className="playing-card__inner"
                animate={{ rotateY: flipped[i] ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
              >
                <div className="playing-card__face playing-card__face--back">
                  <span>🎂</span>
                </div>
                <div className="playing-card__face playing-card__face--front">
                  {c.type === "photo" ? (
                    <>
                      <img src={c.photo} alt="" />
                      <span className="playing-card__caption">{c.caption}</span>
                    </>
                  ) : (
                    <p className="playing-card__text">{c.text}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
