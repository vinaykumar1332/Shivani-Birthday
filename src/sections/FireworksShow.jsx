import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../components/common/SectionWrapper";
import { FireworksCanvas } from "../components/fireworks/FireworksCanvas";
import { FIREWORK_COLORS } from "../components/fireworks/FireworksEngine";
import { SparklerGirl, FuseMonkey } from "../components/characters/Characters";
import { useInView } from "../hooks/useInView";
import { birthdayConfig } from "../data/birthdayConfig";
import {
  playRocketWhistle,
  playBurst,
  playFountain,
  playChakri,
  playSparkler,
  playBomb,
  playMagicChime,
  stopSfx,
} from "../utils/sound";
import { duckMusic, unduckMusic } from "../utils/backgroundMusic";
import "./FireworksShow.css";

// Ground positions in % — desktop, then a tighter layout for phones so the
// crackers stay clear of the characters standing at the edges.
const ANAARS = [{ x: 32, sm: 37 }, { x: 50, sm: 50 }, { x: 68, sm: 63 }];
const CHAKRIS = [{ x: 41, sm: 43.5 }, { x: 59, sm: 56.5 }];
const PATTERNS = ["peony", "ring", "willow", "glitter"];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function FireworksShow() {
  const { fireworks, friendName } = birthdayConfig;
  const engineRef = useRef(null);
  const anaarRefs = useRef([]);
  const chakriRefs = useRef([]);
  const tipRef = useRef(null);
  const timers = useRef([]);
  const doneRef = useRef(false);
  const [sectionRef, inView] = useInView({ threshold: 0.4, once: false });

  const [lighting, setLighting] = useState(false);
  const [waving, setWaving] = useState(false);
  const [anaarOn, setAnaarOn] = useState([false, false, false]);
  const [chakriOn, setChakriOn] = useState([false, false]);
  const [shaking, setShaking] = useState(false);
  const [lit, setLit] = useState(false);
  const [bubbles, setBubbles] = useState(false);
  const [done, setDone] = useState(false);

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  // Position of an element relative to the canvas, in canvas pixels.
  const pointOf = (el, edge = "center") => {
    const engine = engineRef.current;
    if (!el || !engine) return null;
    const c = engine.canvas.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - c.left, y: (edge === "top" ? r.top : r.top + r.height / 2) - c.top };
  };

  const setAt = (setter, i, value) =>
    setter((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

  const fireRocket = (xRatio, yRatio, pattern = pick(PATTERNS), volume = 1) => {
    const engine = engineRef.current;
    if (!engine) return;
    const flightMs = rand(900, 1300);
    playRocketWhistle(flightMs, volume);
    engine.launchRocket({
      x: xRatio * engine.w,
      targetY: yRatio * engine.h,
      flightMs,
      pattern,
      color: pick(FIREWORK_COLORS),
      onBurst: () => playBurst(pattern === "willow", volume),
    });
  };

  const bang = (xRatio) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.bomb(xRatio * engine.w, engine.h - 70);
    playBomb();
    setShaking(true);
    at(380, () => setShaking(false));
  };

  const lightAnaar = (i, dur) => {
    const p = pointOf(anaarRefs.current[i], "top");
    if (p) engineRef.current?.fountain(p.x, p.y, dur);
    playFountain(dur);
    setAt(setAnaarOn, i, true);
    at(dur, () => setAt(setAnaarOn, i, false));
  };

  const spinChakri = (i, dur) => {
    const p = pointOf(chakriRefs.current[i]);
    if (p) engineRef.current?.chakri(p.x, p.y, dur);
    playChakri(dur);
    setAt(setChakriOn, i, true);
    at(dur, () => setAt(setChakriOn, i, false));
  };

  const keepSparklerLit = () => {
    setWaving(true);
    engineRef.current?.sparkler(() => pointOf(tipRef.current), 8000);
    playSparkler(8000);
    at(7600, keepSparklerLit);
  };

  // After the scripted show: an endless, randomised display for as long as
  // the section stays on screen. Every step is a tracked timer, so scrolling
  // away (stop) ends it instantly.
  const continuous = () => {
    keepSparklerLit();
    const step = () => {
      const roll = Math.random();
      if (roll < 0.6) {
        fireRocket(rand(0.1, 0.9), rand(0.1, 0.34), pick(PATTERNS), 0.6);
      } else if (roll < 0.8) {
        const volley = 2 + Math.floor(Math.random() * 3);
        const center = rand(0.25, 0.75);
        for (let k = 0; k < volley; k++) {
          at(k * 150, () => fireRocket(center + (k - volley / 2) * 0.1, rand(0.1, 0.28), pick(PATTERNS), 0.55));
        }
      } else if (roll < 0.9) {
        lightAnaar(Math.floor(Math.random() * ANAARS.length), 2600);
      } else if (roll < 0.97) {
        spinChakri(Math.floor(Math.random() * CHAKRIS.length), 2400);
      } else {
        bang(rand(0.2, 0.8));
      }
      at(rand(380, 850), step);
    };
    step();
  };

  const run = () => {
    setLighting(false);
    setWaving(false);
    setAnaarOn([false, false, false]);
    setChakriOn([false, false]);
    setLit(false);
    setBubbles(false);
    setDone(false);

    // 1. The monkey lowers his fuse stick and lights the anaars one by one.
    at(300, () => setLighting(true));
    ANAARS.forEach((_, i) => at(800 + i * 450, () => lightAnaar(i, 3800 - i * 300)));

    // 2. Chakris spin up on the ground.
    CHAKRIS.forEach((_, i) => at(2300 + i * 350, () => spinChakri(i, 3200)));

    // 3. The girl's sparkler catches and she starts waving it.
    at(2600, keepSparklerLit);
    at(3000, () => setLighting(false));

    // 4. A long volley of sky rockets, every burst style.
    for (let i = 0; i < 14; i++) {
      at(3000 + i * 260, () => fireRocket(rand(0.1, 0.9), rand(0.1, 0.32), PATTERNS[i % PATTERNS.length]));
    }

    // 5. Two ground bombs — the big bangs.
    at(6800, () => bang(0.24));
    at(7150, () => bang(0.76));

    // 6. Finale: a wide fan of rockets while her name lights up in the sky.
    at(7600, () => {
      for (let k = 0; k < 10; k++) at(k * 110, () => fireRocket(0.1 + k * 0.089, rand(0.08, 0.22)));
      setLit(true);
      playMagicChime();
    });
    at(8600, () => setBubbles(true));

    // 7. Then it never stops — continuous fireworks while she's watching.
    at(10400, () => {
      setDone(true);
      doneRef.current = true;
      continuous();
    });
  };

  // Like the cake: the show only runs while it's on screen. Scrolling away
  // cancels everything mid-show and cuts the sound.
  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    engineRef.current?.clear();
    stopSfx();
    unduckMusic();
  };

  // In view: first visit plays the scripted show; later visits go straight to
  // the continuous display. Out of view: everything stops.
  useEffect(() => {
    if (inView) {
      duckMusic(Infinity);
      if (doneRef.current) continuous();
      else run();
    } else {
      stop();
    }
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const replay = () => {
    stop();
    doneRef.current = false;
    run();
  };

  const neonText = `${fireworks.finaleText}, ${friendName}!`;

  return (
    <section ref={sectionRef} id="fireworks" className={`fw-show ${lit ? "is-lit" : ""} ${shaking ? "is-shaking" : ""}`}>
      <div className="fw-show__stars" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="fw-show__star"
            style={{ top: `${(i * 37) % 100}%`, left: `${(i * 61) % 100}%`, animationDelay: `${i * -0.27}s` }}
          />
        ))}
      </div>
      <div className="fw-show__moon" aria-hidden="true" />
      <div className="fw-show__sky-glow" aria-hidden="true" />

      <div className="fw-show__head container">
        <SectionHeading eyebrow={fireworks.eyebrow} title={fireworks.title} lead={fireworks.lead} />
      </div>

      <div className="fw-show__middle">
        <h3 className="fw-show__neon" aria-label={neonText}>
          {neonText.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`fw-show__neon-char ${lit ? "is-on" : ""}`}
              style={{ transitionDelay: lit ? `${i * 55}ms` : "0ms" }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h3>

        <AnimatePresence>
          {done && (
            <motion.button
              className="fw-show__replay"
              onClick={replay}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Light Them Again 🎆
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="fw-show__ground">
        <div className="fw-show__hill" aria-hidden="true" />

        {ANAARS.map((pos, i) => (
          <span key={`a${i}`} className={`fw-anaar ${anaarOn[i] ? "is-on" : ""}`} style={{ "--x": `${pos.x}%`, "--x-sm": `${pos.sm}%` }} aria-hidden="true">
            <span ref={(el) => (anaarRefs.current[i] = el)} className="fw-anaar__body" />
          </span>
        ))}
        {CHAKRIS.map((pos, i) => (
          <span
            key={`c${i}`}
            ref={(el) => (chakriRefs.current[i] = el)}
            className={`fw-chakri ${chakriOn[i] ? "is-on" : ""}`}
            style={{ "--x": `${pos.x}%`, "--x-sm": `${pos.sm}%` }}
            aria-hidden="true"
          />
        ))}

        <div className="fw-char fw-char--girl">
          <AnimatePresence>
            {bubbles && (
              <motion.p
                className="fw-bubble"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                {fireworks.girlSays}
              </motion.p>
            )}
          </AnimatePresence>
          <SparklerGirl tipRef={tipRef} waving={waving} />
        </div>

        <div className="fw-char fw-char--monkey">
          <AnimatePresence>
            {bubbles && (
              <motion.p
                className="fw-bubble fw-bubble--right"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.35 }}
              >
                {fireworks.monkeySays}
              </motion.p>
            )}
          </AnimatePresence>
          <FuseMonkey lighting={lighting} />
        </div>
      </div>

      <FireworksCanvas engineRef={engineRef} className="fw-show__canvas" />
    </section>
  );
}
