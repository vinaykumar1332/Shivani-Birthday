import { useEffect, useRef, useState } from "react";

// Tracks whether an element is in view. By default fires once and stops
// observing; pass `once: false` to keep tracking enter/exit continuously
// (used to pause a section's animation/sound when it scrolls off-screen).
export function useInView({ threshold = 0.5, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
