import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitWords } from "../ui/SplitWords";
import "./SectionWrapper.css";

gsap.registerPlugin(ScrollTrigger);

export function SectionWrapper({ id, children, bgVariant = "cream", className = "", innerClassName = "" }) {
  return (
    <section id={id} className={`section-wrap section-wrap--${bgVariant} ${className}`}>
      <div className={`section-wrap__inner container ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, lead, align = "center" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      const eyebrowEl = el.querySelector(".eyebrow");
      const leadEl = el.querySelector(".section-heading__lead");

      if (eyebrowEl) tl.from(eyebrowEl, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
      tl.from(
        el.querySelectorAll(".split-word__inner"),
        { yPercent: 115, rotate: 5, opacity: 0, duration: 0.85, stagger: 0.06, ease: "power4.out" },
        "-=0.2"
      );
      if (leadEl) tl.from(leadEl, { opacity: 0, y: 16, filter: "blur(6px)", duration: 0.7, ease: "power2.out" }, "-=0.45");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`section-heading section-heading--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-heading__title">
        <SplitWords text={title} />
      </h2>
      {lead && <p className="section-heading__lead">{lead}</p>}
    </div>
  );
}
