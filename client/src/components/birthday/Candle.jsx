import { motion, AnimatePresence } from "framer-motion";
import "./Candle.css";

export function Candle({ index, isLit, onBlow }) {
  const flicker = {
    "--dur": `${0.9 + (index % 3) * 0.25}s`,
    "--delay": `${-(index * 0.37)}s`,
  };

  return (
    <button
      className="candle"
      onClick={onBlow}
      aria-label={isLit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} blown out`}
    >
      <AnimatePresence>
        {isLit && (
          <motion.span
            className="candle__flame-wrap"
            style={flicker}
            initial={{ opacity: 0, scale: 0.4, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -6, transition: { duration: 0.18, ease: "easeIn" } }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="candle__glow" />
            <span className="candle__flame">
              <span className="candle__flame-core" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isLit && (
          <motion.span
            className="candle__smoke"
            initial={{ opacity: 0.5, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -22, scale: 1.4 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <span className="candle__stick" />
    </button>
  );
}
