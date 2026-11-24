import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SmoothImage.css";

gsap.registerPlugin(ScrollTrigger);

// An <img> that fades in from a soft blur once it's actually decoded, so photos
// never pop in half-loaded. With `parallax`, the photo also drifts inside its
// frame as you scroll — the frame stays put, the picture moves with depth.
export function SmoothImage({ parallax = 0, className = "", onLoad, ...imgProps }) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  // Already-cached images can finish before React attaches onLoad.
  const attach = useCallback((img) => {
    imgRef.current = img;
    if (img?.complete && img.naturalWidth) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!parallax || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -parallax },
        {
          yPercent: parallax,
          ease: "none",
          scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    });
    return () => ctx.revert();
  }, [parallax]);

  const img = (
    <img
      ref={attach}
      decoding="async"
      {...imgProps}
      className={`smooth-img ${loaded ? "is-loaded" : ""} ${parallax ? "smooth-img--parallax" : ""} ${parallax ? "" : className}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );

  if (!parallax) return img;
  return (
    <span ref={frameRef} className={`smooth-img-frame ${loaded ? "is-loaded" : ""} ${className}`}>
      {img}
    </span>
  );
}
