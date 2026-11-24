import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionHeading } from "../components/common/SectionWrapper";
import { FlowerIcon, SparkleIcon } from "../components/ui/Icons";
import { birthdayConfig } from "../data/birthdayConfig";
import { splitEmphasis } from "../utils/emphasis";
import { playMagicChime } from "../utils/sound";
import "./GreetingCards.css";

const OPEN_MS = 950;
const THEME_CONFETTI = {
  gold: ["#F6C453", "#FFE38B", "#E8915B", "#FFF8EF"],
  rose: ["#FF8FB1", "#F72585", "#FFD6E2", "#FFF8EF"],
  lavender: ["#C9B6F2", "#7B5CC4", "#E9DEFF", "#FFF8EF"],
  mint: ["#7BE0AD", "#2A9D8F", "#D8F6E7", "#FFF8EF"],
};

function Envelope({ card, state, index, onOpen }) {
  const opened = state !== "closed";
  return (
    <motion.button
      type="button"
      className={`env env--${card.theme} ${opened ? "is-open" : ""}`}
      onClick={() => onOpen(index)}
      aria-label={`${card.cover}${state === "read" ? " (opened)" : ""}`}
      initial={{ opacity: 0, y: 50, rotate: index % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 140, damping: 15 }}
      whileHover={{ y: -8, rotate: 0 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="env__body">
        <span className="env__back" />
        <span className="env__letter">
          <span className="env__letter-line" />
          <span className="env__letter-line" />
          <span className="env__letter-line env__letter-line--short" />
        </span>
        <span className="env__pocket" />
        <span className="env__flap" />
        <span className="env__seal" aria-hidden="true">S</span>
        <span className="env__stamp" aria-hidden="true">{card.emoji}</span>
      </span>
      <span className="env__label">{card.cover}</span>
      {state === "read" && <span className="env__read">Opened ✓</span>}
    </motion.button>
  );
}

function OpenCard({ card, to, signoff, onClose }) {
  const closeRef = useRef(null);
  const words = splitEmphasis(card.message);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="gcard-overlay"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={card.cover}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <motion.div
        className={`gcard gcard--${card.theme}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 160, scale: 0.4, rotate: -6, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
        exit={{ y: 60, scale: 0.85, opacity: 0, transition: { duration: 0.22 } }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <div className="gcard__inside">
          <p className="gcard__to">{to},</p>
          <p className="gcard__message">
            {words.map(({ word: w, em }, i) => (
              <Fragment key={i}>
                <motion.span
                  className={`gcard__word ${em ? "em-accent" : ""}`}
                  initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.15 + i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>{" "}
              </Fragment>
            ))}
          </p>
          <motion.p
            className="gcard__signoff"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 1.3 + words.length * 0.03, duration: 1, ease: [0.65, 0, 0.35, 1] }}
          >
            {signoff}
          </motion.p>
          <FlowerIcon size={34} className="gcard__flower gcard__flower--a" />
          <SparkleIcon size={18} className="gcard__flower gcard__flower--b" />
        </div>

        {/* The front cover swings open like a real folded card. */}
        <motion.div
          className="gcard__cover"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -170, opacity: [1, 1, 0] }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.65, 0, 0.35, 1], opacity: { delay: 0.55, duration: 1.1, times: [0, 0.75, 1] } }}
        >
          <span className="gcard__cover-face">
            <span className="gcard__cover-emoji">{card.emoji}</span>
            <span className="gcard__cover-title">{card.cover}</span>
            <span className="gcard__cover-pattern" aria-hidden="true" />
          </span>
          <span className="gcard__cover-back" aria-hidden="true" />
        </motion.div>
      </motion.div>

      <button ref={closeRef} type="button" className="gcard-close" onClick={onClose}>
        Close ✕
      </button>
    </motion.div>
  );
}

export function GreetingCards() {
  const { greetingCards: g } = birthdayConfig;
  const [states, setStates] = useState(() => g.cards.map(() => "closed"));
  const [active, setActive] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  const close = useCallback(() => setActive(null), []);

  const open = (i) => {
    if (states[i] === "opening" || active !== null) return;
    if (states[i] === "read") {
      setActive(i);
      return;
    }
    setStates((s) => s.map((v, k) => (k === i ? "opening" : v)));
    playMagicChime();
    timer.current = setTimeout(() => {
      setActive(i);
      setStates((s) => s.map((v, k) => (k === i ? "read" : v)));
      confetti({ particleCount: 80, spread: 90, startVelocity: 35, origin: { y: 0.6 }, colors: THEME_CONFETTI[g.cards[i].theme], zIndex: 600 });
    }, OPEN_MS);
  };

  return (
    <section id="letters" className="letters">
      <div className="letters__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading eyebrow={g.eyebrow} title={g.title} lead={g.lead} />
        <div className="letters__grid">
          {g.cards.map((card, i) => (
            <Envelope key={i} card={card} index={i} state={states[i]} onOpen={open} />
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {active !== null && (
            <OpenCard key={active} card={g.cards[active]} to={g.to} signoff={g.signoff} onClose={close} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
