import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { SmoothImage } from "../components/ui/SmoothImage";
import { birthdayConfig } from "../data/birthdayConfig";
import { splitEmphasis } from "../utils/emphasis";
import { playCrackers, playMagicChime } from "../utils/sound";
import "./GiftBox.css";

const CONFETTI_COLORS = ["#F6C453", "#F29A9A", "#B8A1E3", "#FFC69B", "#FFF8EF"];

function Bow() {
  return (
    <svg className="gift-box__bow" viewBox="0 0 120 60" aria-hidden="true">
      <defs>
        <linearGradient id="gift-bow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE0C2" />
          <stop offset="100%" stopColor="#FFA363" />
        </linearGradient>
      </defs>
      <path d="M60 42 C 40 0, 4 8, 18 34 C 26 48, 48 46, 60 42 Z" fill="url(#gift-bow)" />
      <path d="M60 42 C 80 0, 116 8, 102 34 C 94 48, 72 46, 60 42 Z" fill="url(#gift-bow)" />
      <circle cx="60" cy="42" r="9" fill="#F2956E" />
    </svg>
  );
}

export function GiftBox() {
  const [open, setOpen] = useState(false);
  const { giftBox, friendName } = birthdayConfig;
  const words = splitEmphasis(giftBox.message);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    playMagicChime();
    setTimeout(() => playCrackers(6), 250);
    confetti({ particleCount: 130, spread: 100, startVelocity: 40, origin: { y: 0.55 }, colors: CONFETTI_COLORS });
  };

  return (
    <SectionWrapper id="gift" bgVariant="plum">
      <SectionHeading
        eyebrow="A Little Something"
        title="There's A *Surprise* Waiting For You"
        lead="Tap the box when you're ready. *No rush* — it's not going anywhere."
      />

      <div className="gift-stage">
        <div className="gift-scene">
          <AnimatePresence>
            {open && (
              <motion.span
                className="gift-beam"
                aria-hidden="true"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0.55], scaleY: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {open && (
              <motion.figure
                className="gift-photo"
                initial={{ y: 90, scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ y: -150, scale: 1, opacity: 1, rotate: -3 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 110, damping: 14 }}
              >
                <SmoothImage src={giftBox.photo} alt={`${friendName} smiling`} parallax={7} />
                <figcaption>{giftBox.photoCaption}</figcaption>
              </motion.figure>
            )}
          </AnimatePresence>

          <motion.button
            className="gift-box"
            onClick={handleOpen}
            disabled={open}
            aria-label={open ? "Gift opened" : "Open your gift"}
            animate={open ? { rotate: 0 } : { rotate: [0, -4, 4, -3, 3, 0] }}
            transition={open ? { duration: 0.2 } : { duration: 0.7, repeat: Infinity, repeatDelay: 2.2 }}
            whileHover={open ? undefined : { scale: 1.04 }}
            whileTap={open ? undefined : { scale: 0.96 }}
          >
            <motion.span
              className="gift-box__lid"
              animate={open ? { y: -130, x: -70, rotate: -28, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
              transition={open ? { type: "spring", stiffness: 160, damping: 16, opacity: { delay: 0.5, duration: 0.4 } } : { duration: 0.3 }}
            >
              <Bow />
              <span className="gift-box__lid-ribbon" />
            </motion.span>
            <span className="gift-box__base">
              <span className="gift-box__ribbon" />
              <span className="gift-box__shine" />
            </span>
          </motion.button>
        </div>

        {!open && <p className="gift-hint">Tap to open</p>}

        {open && (
          <div className="gift-message" aria-live="polite">
            <p>
              {words.map(({ word: w, em }, i) => (
                <Fragment key={i}>
                  <motion.span
                    className={`gift-message__word ${em ? "em-accent" : ""}`}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.9 + i * 0.035, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {w}
                  </motion.span>{" "}
                </Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
