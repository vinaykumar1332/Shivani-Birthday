import { Fragment } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { FlowerIcon, SparkleIcon } from "../ui/Icons";
import { splitEmphasis } from "../../utils/emphasis";
import "./QuoteCard.css";

const WORD_STAGGER = 0.045;

// The sentimental quote: rises in with depth, then the words surface one by one
// out of a soft blur, key words glow, and the sign-off writes itself in.
export function QuoteCard({ text, signoff, highlight = [] }) {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const reduced = useReducedMotion();
  const words = splitEmphasis(text);
  const keyWords = new Set(highlight.map((w) => w.toLowerCase()));
  const textDone = 0.55 + words.length * WORD_STAGGER;

  // Gentle tilt toward the pointer (mouse only — touch keeps it still).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 18 });

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  const show = inView || reduced;

  return (
    <motion.div
      ref={ref}
      className="quote-card-wrap"
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <motion.blockquote
        className={`quote-card ${show ? "is-in" : ""}`}
        style={{ transformPerspective: 900 }}
        initial={{ opacity: 0, y: 70, scale: 0.92, rotateX: 18 }}
        animate={show ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : undefined}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <span className="quote-card__border" aria-hidden="true" />
        <span className="quote-card__shine" aria-hidden="true" style={{ animationDelay: `${textDone}s` }} />

        <motion.span
          className="quote-card__mark"
          aria-hidden="true"
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={show ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 12 }}
        >
          <span className="quote-card__mark-inner">“</span>
        </motion.span>

        <FlowerIcon size={30} className="quote-card__deco quote-card__deco--tl" />
        <SparkleIcon size={18} className="quote-card__deco quote-card__deco--tr" />
        <FlowerIcon size={24} className="quote-card__deco quote-card__deco--br" petal="#B8A1E3" petalLight="#E9DEFF" />

        <p className="quote-card__text">
          {words.map(({ word: w, em }, i) => {
            const isKey = keyWords.has(w.toLowerCase().replace(/[^a-z']/g, ""));
            return (
              <Fragment key={i}>
                <motion.span
                  className={`quote-card__word ${isKey ? "quote-card__word--key" : ""} ${em ? "em-accent" : ""}`}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                  transition={{ delay: 0.55 + i * WORD_STAGGER, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>{" "}
              </Fragment>
            );
          })}
        </p>

        <motion.footer
          className="quote-card__signoff"
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
          animate={show ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : undefined}
          transition={{ delay: textDone + 0.2, duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        >
          {signoff}
        </motion.footer>
      </motion.blockquote>
    </motion.div>
  );
}
