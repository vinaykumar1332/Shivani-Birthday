import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reveals a group of children on scroll — a blur-to-focus settle with a
// slight rotation correction, rather than a generic fade-up.
export function useRevealAnimation({ selector = ".reveal-item", y = 36, stagger = 0.12 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" });
        return;
      }
      targets.forEach((t, i) => {
        const rot = i % 2 === 0 ? -3 : 3;
        gsap.fromTo(
          t,
          { opacity: 0, y, rotate: rot, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            delay: i * stagger,
            scrollTrigger: {
              trigger: t,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [selector, y, stagger]);

  return containerRef;
}
