import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { NumberCandle } from "../components/birthday/NumberCandle";
import { CardsReveal } from "../components/birthday/CardsReveal";
import { FlowerIcon } from "../components/ui/Icons";
import { Balloon } from "../components/ui/Balloon";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useInView } from "../hooks/useInView";
import { birthdayConfig } from "../data/birthdayConfig";
import { PartyBoy, PartyBear } from "../components/characters/Characters";
import { playCrackers, playBirthdayMelody, playBlow, stopMusic } from "../utils/sound";
import { duckMusic, unduckMusic } from "../utils/backgroundMusic";
import { motion, AnimatePresence } from "framer-motion";
import "./BirthdayCake.css";

const CONFETTI_COLORS = ["#F6C453", "#F29A9A", "#B8A1E3", "#FFC69B", "#FFF8EF"];

// Number candles spell her age, e.g. 25 → "2" and "5".
const DIGITS = String(birthdayConfig.age).split("");

// Timeline (ms from the moment the cake scrolls into view).
const WISH_TIME = 3000; // candles burn this long while she makes a wish
const BLOW_GAP = 300; // the breath reaches each candle in turn

export function BirthdayCake() {
  const [lit, setLit] = useState(() => DIGITS.map(() => true));
  const [wishing, setWishing] = useState(false);
  const [cheering, setCheering] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRevealAnimation({ selector: ".cake-reveal", y: 50, stagger: 0.15 });
  // Start only once the cake itself is properly on screen; stop only when the
  // whole section is gone — scrolling down to the cards must not cancel it.
  const [cakeRef, cakeVisible] = useInView({ threshold: 0.6, once: false });
  const [sectionRef, sectionVisible] = useInView({ threshold: 0, once: false });
  const timers = useRef([]);
  const doneRef = useRef(false);
  const runningRef = useRef(false);

  const schedule = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const runSequence = () => {
    runningRef.current = true;
    setLit(DIGITS.map(() => true));
    setWishing(true);
    setCheering(false);
    setShowCards(false);
    setDone(false);

    // 1. Let the flames burn while she makes a wish, then one big breath.
    schedule(() => {
      setWishing(false);
      playBlow();
    }, WISH_TIME);

    DIGITS.forEach((_, i) => {
      schedule(() => {
        setLit((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
      }, WISH_TIME + 150 + i * BLOW_GAP);
    });

    const lastBlowAt = WISH_TIME + 150 + (DIGITS.length - 1) * BLOW_GAP;

    // 2. Celebrate: crackers, confetti, the friends cheer, the song, the cards.
    schedule(() => {
      playCrackers(8);
      confetti({ particleCount: 150, spread: 110, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
      setCheering(true);
    }, lastBlowAt + 500);

    schedule(() => {
      const songMs = playBirthdayMelody();
      duckMusic(songMs + 300);
      // Only offer Replay once the song has actually finished.
      schedule(() => {
        setDone(true);
        doneRef.current = true;
        runningRef.current = false;
      }, songMs);
    }, lastBlowAt + 800);

    schedule(() => setShowCards(true), lastBlowAt + 1200);
  };

  // Leaving the section cancels pending steps and cuts the song mid-note,
  // so music only ever plays while the cake is on screen.
  const stopSequence = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    runningRef.current = false;
    stopMusic();
    unduckMusic();
  };

  useEffect(() => {
    if (cakeVisible && !doneRef.current && !runningRef.current) runSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakeVisible]);

  // Leaving the section entirely cuts everything; an unfinished run restarts
  // cleanly from the wish next time the cake comes back into view.
  useEffect(() => {
    if (!sectionVisible && runningRef.current) stopSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionVisible]);

  useEffect(
    () => () => {
      if (runningRef.current) stopSequence();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const replay = () => {
    stopSequence();
    doneRef.current = false;
    runSequence();
  };

  return (
    <SectionWrapper id="cake" bgVariant="plum">
      <div ref={sectionRef}>
      <div>
        <SectionHeading
          eyebrow="Make A Wish"
          title="One Cake, Two Candles, *Infinite Wishes*"
          lead="Sit back — the candles *blow themselves out*."
        />
      </div>

      <div ref={containerRef} className="cake-stage">
        <p className={`cake-wish-prompt ${wishing ? "is-visible" : ""}`} aria-live="polite">
          {birthdayConfig.cake.wishPrompt}
        </p>

        <div className="cake-scene">
        <div className="cake-friend cake-friend--boy cake-reveal">
          <AnimatePresence>
            {cheering && (
              <motion.p
                className="cake-bubble"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                {birthdayConfig.cake.boySays}
              </motion.p>
            )}
          </AnimatePresence>
          <PartyBoy cheering={cheering} />
        </div>

        <div ref={cakeRef} className={`cake cake-reveal ${cheering ? "is-cheering" : ""}`}>
          <span className="cake__balloon cake__balloon--left" aria-hidden="true">
            <Balloon color="#FF8FB1" size={30} />
          </span>
          <span className="cake__balloon cake__balloon--right" aria-hidden="true">
            <Balloon color="#4CC9F0" size={26} />
          </span>
          <div className="cake__candles">
            {DIGITS.map((digit, i) => (
              <NumberCandle key={i} digit={digit} index={i} lit={lit[i]} />
            ))}
          </div>
          <div className="cake__layer cake__layer--top">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="cake__flower" style={{ left: `${8 + i * 18}%` }}>
                <FlowerIcon size={22} petal={i % 2 ? "#B8A1E3" : "#F29A9A"} petalLight={i % 2 ? "#E9DEFF" : "#FFD9D2"} />
              </span>
            ))}
          </div>
          <div className="cake__layer cake__layer--mid" />
          <div className="cake__layer cake__layer--base" />
        </div>

        <div className="cake-friend cake-friend--bear cake-reveal">
          <AnimatePresence>
            {cheering && (
              <motion.p
                className="cake-bubble cake-bubble--right"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.35 }}
              >
                {birthdayConfig.cake.bearSays}
              </motion.p>
            )}
          </AnimatePresence>
          <PartyBear cheering={cheering} />
        </div>
        </div>

        <p className="cake-funny cake-reveal">{birthdayConfig.cake.funnyLine}</p>

        {done && (
          <div className="cake-actions cake-reveal">
            <button className="cake-btn" onClick={replay}>Light The Candles Again ✨</button>
          </div>
        )}

        <CardsReveal active={showCards} />
      </div>
      </div>
    </SectionWrapper>
  );
}
