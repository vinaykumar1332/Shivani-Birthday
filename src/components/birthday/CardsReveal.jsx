import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCardsBurst } from "../../utils/sound";
import { FlowerIcon } from "../ui/Icons";
import { birthdayConfig } from "../../data/birthdayConfig";
import "./CardsReveal.css";

const FAN = [
  { x: -150, y: -30, rot: -16 },
  { x: -52, y: -62, rot: -5 },
  { x: 52, y: -62, rot: 5 },
  { x: 150, y: -30, rot: 16 },
];

// Shrinks the fan on narrow phones so the outer cards stay on screen.
// Outer card edge = 150 * spread + half a card (54px on mobile).
const fanSpread = () => Math.min(1, Math.max(0.5, (window.innerWidth / 2 - 72) / 150));

export function CardsReveal({ active }) {
  const cards = birthdayConfig.cake.cards;
  const [flipped, setFlipped] = useState(() => cards.map(() => false));
  const [spread] = useState(fanSpread);

  useEffect(() => {
    if (!active) return;
    const { events } = playCardsBurst(cards.length);
    // Let each card land before it turns over.
    const timers = events.map((ev, i) =>
      setTimeout(() => {
        setFlipped((f) => {
          const next = [...f];
          next[i] = true;
          return next;
        });
      }, ev.delayMs + 700 + i * 120)
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
              initial={{ x: 0, y: 40, scale: 0.2, rotate: 0, opacity: 0 }}
              animate={{ x: FAN[i].x * spread, y: FAN[i].y, scale: 1, rotate: FAN[i].rot, opacity: 1 }}
              transition={{ delay: i * 0.22, type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
            >
              <motion.div
                className="playing-card__inner"
                animate={{ rotateY: flipped[i] ? 180 : 0 }}
                transition={{ duration: 0.85, ease: [0.645, 0.045, 0.355, 1] }}
              >
                <div className="playing-card__face playing-card__face--back">
                  <FlowerIcon size={52} petal="#FFF8EF" petalLight="#FFFFFF" center="#F6C453" />
                </div>
                <div className="playing-card__face playing-card__face--front">
                  {c.type === "photo" ? (
                    <>
                      <img src={c.photo} alt={c.caption} decoding="async" draggable="false" />
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
