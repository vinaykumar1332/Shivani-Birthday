import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../components/ui/Button";
import { useParallax } from "../hooks/useParallax";
import { birthdayConfig } from "../data/birthdayConfig";
import "./Hero.css";

const DECOR = [
  { type: "🦋", top: "16%", left: "8%", size: 2.4, dur: 7 },
  { type: "🦋", top: "60%", left: "90%", size: 2, dur: 8.5 },
  { type: "🦋", top: "80%", left: "6%", size: 1.6, dur: 6.5 },
  { type: "🦋", top: "30%", left: "88%", size: 1.8, dur: 9 },
  { type: "🌸", top: "78%", left: "16%", size: 2, dur: 9 },
  { type: "🌼", top: "20%", left: "78%", size: 1.6, dur: 7.5 },
  { type: "🌺", top: "88%", left: "72%", size: 1.8, dur: 8 },
  { type: "🌷", top: "10%", left: "45%", size: 1.4, dur: 6.8 },
  { type: "✨", top: "40%", left: "15%", size: 1.2, dur: 5 },
  { type: "✨", top: "55%", left: "80%", size: 1.2, dur: 5.6 },
  { type: "✨", top: "12%", left: "62%", size: 1, dur: 4.6 },
];

export function Hero({ onBegin }) {
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const layer1 = useParallax(0.15);
  const layer2 = useParallax(0.3);

  useEffect(() => {
    const chars = titleRef.current.querySelectorAll(".hero__word");
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(badgeRef.current, { opacity: 0, y: -16, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" })
      .fromTo(chars, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, "-=0.2")
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(ctaRef.current, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.4");
  }, []);

  const headlineWords = birthdayConfig.hero.headline.split(" ");

  return (
    <section className="hero" aria-label="Welcome">
      <div className="hero__aurora" aria-hidden="true" />
      <div ref={layer1} className="hero__bg-layer hero__bg-layer--1" aria-hidden="true">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__orb hero__orb--3" />
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
            style={{ top: d.top, left: d.left, fontSize: `${d.size}rem`, animationDuration: `${d.dur}s`, animationDelay: `${i * -0.6}s` }}
          >
            {d.type}
          </span>
        ))}
      </div>

      <div className="hero__content container">
        <span ref={badgeRef} className="hero__badge">✨ For {birthdayConfig.friendName} ✨</span>
        <h1 ref={titleRef} className="hero__title">
          {headlineWords.map((w, i) => {
            const isName = w.replace(/[^a-zA-Z]/g, "") === birthdayConfig.friendName;
            return (
              <span className={`hero__word ${isName ? "hero__word--name" : ""}`} key={i}>
                {w}&nbsp;
              </span>
            );
          })}
        </h1>
        <p ref={subRef} className="hero__subtext">{birthdayConfig.hero.subtext}</p>
        <div ref={ctaRef} className="hero__cta-wrap">
          <Button variant="primary" onClick={onBegin}>{birthdayConfig.hero.cta} →</Button>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-dot" />
      </div>
    </section>
  );
}
