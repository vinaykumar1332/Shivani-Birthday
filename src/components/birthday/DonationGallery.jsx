import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { SmoothImage } from "../ui/SmoothImage";
import "./DonationGallery.css";

// Brisk but smooth: a quick crossfade, then a short hold.
const SLIDE_MS = 2800;
const FADE_S = 0.7;

// An auto-playing slideshow: photos crossfade with a gentle zoom, pause while
// off-screen, and can be picked directly from the thumbnails.
export function DonationGallery({ photos, alt }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.3, once: false });

  // Preload and decode every photo up front so each crossfade starts from a
  // ready image — no flash or stutter while the next one downloads.
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [photos]);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, inView, paused, photos.length]);

  return (
    <div
      ref={ref}
      className="donation-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="donation-gallery__stage" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.img
            key={photos[index]}
            src={photos[index]}
            alt={`${alt} (${index + 1} of ${photos.length})`}
            className="donation-gallery__photo"
            decoding="async"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: FADE_S, ease: "easeInOut" } }}
            transition={{ opacity: { duration: FADE_S, ease: "easeInOut" }, scale: { duration: SLIDE_MS / 1000 + FADE_S, ease: [0.23, 1, 0.32, 1] } }}
            style={{ willChange: "opacity, transform" }}
          />
        </AnimatePresence>
        <span className="donation-gallery__counter">
          {index + 1} / {photos.length}
        </span>
        <span className="donation-gallery__progress" key={`${index}-${paused}-${inView}`} data-running={inView && !paused} style={{ animationDuration: `${SLIDE_MS}ms` }} />
      </div>

      <div className="donation-gallery__thumbs" role="tablist" aria-label="Donation photos">
        {photos.map((src, i) => (
          <button
            key={src}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1}`}
            className={`donation-gallery__thumb ${i === index ? "is-active" : ""}`}
            onClick={() => setIndex(i)}
          >
            <SmoothImage src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
