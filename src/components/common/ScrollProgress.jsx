import { useEffect, useRef } from "react";

// A slim gradient bar across the top that fills as she scrolls down the page.
export function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let raf;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: "var(--z-nav)",
        background: "linear-gradient(90deg, #F6C453, #F29A9A, #B8A1E3)",
        transformOrigin: "left center",
        transform: "scaleX(0)",
        boxShadow: "0 0 10px rgba(246, 196, 83, 0.6)",
        pointerEvents: "none",
      }}
    />
  );
}
