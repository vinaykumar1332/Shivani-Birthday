import { useRef } from "react";
import gsap from "gsap";
import { SectionWrapper } from "../components/common/SectionWrapper";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useParallax } from "../hooks/useParallax";
import "./PhotoGallery.css";

const PHOTOS = [
  { src: "/images/shivani.jpeg", size: "lg" },
  { src: "/images/shivani2.jpeg", size: "sm" },
  { src: "/images/shivani3.jpeg", size: "md" },
  { src: "/images/shivani4.jpeg", size: "sm" },
];

function TiltPhoto({ photo, i }) {
  const cardRef = useRef(null);
  const parallaxRef = useParallax(i % 2 === 0 ? -0.22 : 0.22);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 18,
      rotateX: -py * 18,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div
      className={`photo-card photo-card--${photo.size} reveal-item`}
      style={{ "--i": i }}
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="photo-card__frame">
        <img ref={parallaxRef} className="photo-card__img" src={photo.src} alt="" loading="lazy" />
        <span className="photo-card__shine" aria-hidden="true" />
      </div>
    </div>
  );
}

export function PhotoGallery() {
  const containerRef = useRevealAnimation({ selector: ".photo-card", y: 60, stagger: 0.14 });

  return (
    <SectionWrapper id="gallery" bgVariant="cream" innerClassName="photo-gallery-inner">
      <div ref={containerRef} className="photo-gallery">
        {PHOTOS.map((p, i) => (
          <TiltPhoto photo={p} i={i} key={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
