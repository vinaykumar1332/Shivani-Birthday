import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButterflyIcon, FlowerIcon } from "../components/ui/Icons";
import { SplitWords, Emphasized } from "../components/ui/SplitWords";
import { SmoothImage } from "../components/ui/SmoothImage";
import { birthdayConfig } from "../data/birthdayConfig";
import "./FinalScreen.css";

gsap.registerPlugin(ScrollTrigger);

export function FinalScreen({ onRestart }) {
  const rootRef = useRef(null);
  const { friendName, finalMessage } = birthdayConfig;
  const [photoLeft, photoRight] = finalMessage.photos;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 65%", once: true } })
        .from(".final__photo--left", { x: -80, rotate: -20, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform" })
        .from(".final__photo--right", { x: 80, rotate: 20, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform" }, "<")
        .from(".final__title .split-word__inner", { yPercent: 115, rotate: 5, opacity: 0, duration: 0.85, stagger: 0.07, ease: "power4.out" }, "-=0.6")
        .from(".final__subtitle", { opacity: 0, y: 18, filter: "blur(6px)", duration: 0.7 }, "-=0.4")
        .from(".final__actions", { opacity: 0, y: 18, duration: 0.6, ease: "back.out(1.6)" }, "-=0.3");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="final" id="final">
      <div className="final__particles" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="final__particle" style={{ "--i": i }} />
        ))}
      </div>

      <ButterflyIcon size={58} className="final__butterfly final__butterfly--a" />
      <ButterflyIcon size={44} className="final__butterfly final__butterfly--b" wing="#F29A9A" wingLight="#FFC69B" />
      <FlowerIcon size={64} className="final__flower final__flower--a" />
      <FlowerIcon size={48} className="final__flower final__flower--b" petal="#B8A1E3" petalLight="#E9DEFF" />

      <div className="final__layout container">
        <figure className="final__photo final__photo--left">
          <SmoothImage src={photoLeft} alt={`${friendName} smiling`} loading="lazy" parallax={8} />
        </figure>

        <div className="final__content">
          <h2 className="final__title">
            <SplitWords text={finalMessage.title} />
          </h2>
          <p className="final__subtitle"><Emphasized text={finalMessage.subtitle} /></p>
          <div className="final__actions">
            <button className="final__restart" onClick={onRestart}>Watch It All Again ↺</button>
            <p className="final__signoff">{finalMessage.signoff}</p>
          </div>
        </div>

        <figure className="final__photo final__photo--right">
          <SmoothImage src={photoRight} alt={`${friendName} on a happy day`} loading="lazy" parallax={8} />
        </figure>
      </div>
    </section>
  );
}
