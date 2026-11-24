import { useEffect, useRef } from "react";
import { useInView } from "../../hooks/useInView";
import "./DonationVideo.css";

// Always muted (the background music keeps playing); plays only while on
// screen and pauses when scrolled away.
export function DonationVideo({ src, poster, title, caption }) {
  const videoRef = useRef(null);
  const [frameRef, inView] = useInView({ threshold: 0.5, once: false });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [inView]);

  return (
    <figure className="donation-video">
      <div ref={frameRef} className="donation-video__frame">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label={title}
        />
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
