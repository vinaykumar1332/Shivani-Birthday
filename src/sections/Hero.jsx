import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "../components/ui/Button";
import { ButterflyIcon, FlowerIcon, SparkleIcon } from "../components/ui/Icons";
import { SplitWords, Emphasized } from "../components/ui/SplitWords";
import { SmoothImage } from "../components/ui/SmoothImage";
import { Balloon } from "../components/ui/Balloon";
import { useParallax } from "../hooks/useParallax";
import { birthdayConfig } from "../data/birthdayConfig";
import "./Hero.css";

const DECOR = [
  { kind: "butterfly", top: "16%", left: "8%", size: 56, dur: 7, wing: "#B8A1E3", wingLight: "#F29A9A" },
  { kind: "butterfly", top: "62%", left: "88%", size: 48, dur: 8.5, wing: "#F29A9A", wingLight: "#FFC69B" },
  { kind: "butterfly", top: "80%", left: "6%", size: 38, dur: 6.5, wing: "#FFA363", wingLight: "#FFE38B" },
  { kind: "butterfly", top: "26%", left: "86%", size: 42, dur: 9, wing: "#9478CF", wingLight: "#B8A1E3" },
  { kind: "flower", top: "76%", left: "18%", size: 44, dur: 9 },
  { kind: "flower", top: "18%", left: "74%", size: 34, dur: 7.5 },
  { kind: "flower", top: "86%", left: "74%", size: 40, dur: 8 },
  { kind: "sparkle", top: "40%", left: "14%", size: 22, dur: 5 },
  { kind: "sparkle", top: "52%", left: "82%", size: 20, dur: 5.6 },
  { kind: "sparkle", top: "10%", left: "58%", size: 18, dur: 4.6 },
];

const BALLOON_COLORS = ["#F72585", "#F6C453", "#B8A1E3", "#FF8FB1", "#4CC9F0", "#FFA363", "#7BE0AD"];
const between = (a, b) => a + Math.random() * (b - a);

// Random colour, size, lane, speed and sway for each balloon — different every visit.
const makeBalloons = (count) =>
  Array.from({ length: count }, (_, i) => ({
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    size: Math.round(between(34, 58)),
    // Spread lanes evenly, then jitter, so they never bunch up on one side.
    left: ((i + between(0.1, 0.9)) / count) * 94 + 3,
    dur: between(13, 22),
    delay: -between(0, 22),
    sway: between(2.6, 4.2),
    tilt: between(4, 10),
  }));

function DecorItem({ d }) {
  if (d.kind === "butterfly") return <ButterflyIcon size={d.size} wing={d.wing} wingLight={d.wingLight} />;
  if (d.kind === "flower") return <FlowerIcon size={d.size} />;
  return <SparkleIcon size={d.size} />;
}

export function Hero({ onBegin }) {
  const rootRef = useRef(null);
  const layer1 = useParallax(0.15);
  const layer2 = useParallax(0.3);
  const { friendName, hero } = birthdayConfig;
  const [balloons] = useState(() => makeBalloons(8));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .from(".hero__portrait", { opacity: 0, scale: 0.6, rotate: -12, duration: 0.9, ease: "back.out(1.6)" })
        .from(".hero__badge", { opacity: 0, y: -16, scale: 0.8, duration: 0.5, ease: "back.out(1.8)" }, "-=0.45")
        .from(
          ".hero__title .split-word__inner",
          { yPercent: 115, rotate: 6, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power4.out" },
          "-=0.2"
        )
        .from(".hero__subtext", { opacity: 0, y: 20, filter: "blur(6px)", duration: 0.8 }, "-=0.45")
        .from(".hero__cta-wrap", { opacity: 0, y: 20, scale: 0.9, duration: 0.6, ease: "back.out(1.6)" }, "-=0.4");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero" aria-label="Welcome">
      <div className="hero__aurora" aria-hidden="true" />
      <div ref={layer1} className="hero__bg-layer hero__bg-layer--1" aria-hidden="true">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__orb hero__orb--3" />
      </div>
      <div className="hero__balloons" aria-hidden="true">
        {balloons.map((b, i) => (
          <span
            key={i}
            className="hero__balloon"
            style={{ left: `${b.left}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
          >
            <span className="hero__balloon-sway" style={{ "--tilt": `${b.tilt}deg`, animationDuration: `${b.sway}s` }}>
              <Balloon color={b.color} size={b.size} />
            </span>
          </span>
        ))}
      </div>
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="hero__particle" style={{ "--i": i }} />
        ))}
      </div>
      <div ref={layer2} className="hero__bg-layer hero__bg-layer--2" aria-hidden="true">
        {DECOR.map((d, i) => (
          <span
            key={i}
            className="hero__decor"
            style={{ top: d.top, left: d.left, animationDuration: `${d.dur}s`, animationDelay: `${i * -0.6}s` }}
          >
            <DecorItem d={d} />
          </span>
        ))}
      </div>

      <div className="hero__content container">
        <div className="hero__portrait">
          <SmoothImage
            src={hero.portrait}
            alt={`${friendName}, the birthday girl`}
            width="140"
            height="140"
            fetchPriority="high"
          />
          <FlowerIcon size={34} className="hero__portrait-flower hero__portrait-flower--a" />
          <FlowerIcon size={26} className="hero__portrait-flower hero__portrait-flower--b" petal="#B8A1E3" petalLight="#E9DEFF" />
        </div>

        <span className="hero__badge">
          <SparkleIcon size={14} /> For {friendName} <SparkleIcon size={14} />
        </span>

        <h1 className="hero__title">
          <SplitWords
            text={hero.headline}
            wordClassName={(w) => (w.replace(/[^a-zA-Z]/g, "") === friendName ? "hero__word--name" : "")}
          />
        </h1>
        <p className="hero__subtext"><Emphasized text={hero.subtext} /></p>
        <div className="hero__cta-wrap">
          <Button variant="primary" onClick={onBegin}>{hero.cta} →</Button>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-dot" />
      </div>
    </section>
  );
}
