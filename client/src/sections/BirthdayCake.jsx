import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { Candle } from "../components/birthday/Candle";
import { CardsReveal } from "../components/birthday/CardsReveal";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useInView } from "../hooks/useInView";
import { birthdayConfig } from "../data/birthdayConfig";
import { playCrackers, playBirthdayMelody, suspendAudio, resumeAudio } from "../utils/sound";
import "./BirthdayCake.css";

export function BirthdayCake() {
  const count = birthdayConfig.cake.candleCount;
  const [lit, setLit] = useState(Array.from({ length: count }, () => true));
  const [showCards, setShowCards] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRevealAnimation({ selector: ".cake-reveal", y: 50, stagger: 0.15 });
  const [triggerRef, inView] = useInView({ threshold: 0.45, once: false });
  const timers = useRef([]);
  const doneRef = useRef(false);

  const schedule = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const runSequence = () => {
    setLit(Array.from({ length: count }, () => true));
    setShowCards(false);
    setDone(false);

    // Candles blow out one by one, like a real breath sweeping across them.
    for (let i = 0; i < count; i++) {
      schedule(() => {
        setLit((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
      }, 500 + i * 260);
    }

    const lastBlowAt = 500 + (count - 1) * 260;

    schedule(() => {
      playCrackers(8);
      confetti({ particleCount: 150, spread: 110, origin: { y: 0.6 } });
    }, lastBlowAt + 200);

    schedule(() => {
      playBirthdayMelody();
    }, lastBlowAt + 500);

    schedule(() => {
      setShowCards(true);
    }, lastBlowAt + 900);

    schedule(() => {
      setDone(true);
      doneRef.current = true;
    }, lastBlowAt + 1600);
  };

  const stopSequence = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    suspendAudio();
  };

  useEffect(() => {
    if (inView) {
      resumeAudio();
      if (!doneRef.current) runSequence();
    } else {
      stopSequence();
    }
    return stopSequence;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const replay = () => {
    stopSequence();
    doneRef.current = false;
    resumeAudio();
    runSequence();
  };

  return (
    <SectionWrapper id="cake" bgVariant="plum">
      <div ref={triggerRef}>
        <SectionHeading
          eyebrow="Make A Wish"
          title="One Cake, A Few Candles, Infinite Wishes"
          lead="Sit back — the candles blow themselves out."
        />
      </div>

      <div ref={containerRef} className="cake-stage">
        <div className="cake cake-reveal">
          <div className="cake__candles">
            {lit.map((isLit, i) => (
              <Candle key={i} index={i} isLit={isLit} onBlow={() => {}} />
            ))}
          </div>
          <div className="cake__layer cake__layer--top">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="cake__flower" style={{ left: `${10 + i * 18}%` }}>🌸</span>
            ))}
          </div>
          <div className="cake__layer cake__layer--mid" />
          <div className="cake__layer cake__layer--base" />
        </div>

        <p className="cake-funny cake-reveal">{birthdayConfig.cake.funnyLine}</p>

        {done && (
          <div className="cake-actions cake-reveal">
            <button className="cake-btn" onClick={replay}>Replay ✨</button>
          </div>
        )}

        <CardsReveal active={showCards} />
      </div>
    </SectionWrapper>
  );
}
