import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { duckMusic, unduckMusic } from "../../utils/backgroundMusic";
import "./DonationVideo.css";

// Plays muted only while on screen (browsers allow muted autoplay), pauses
// when scrolled away, and offers a tap-to-unmute so she can hear it.
export function DonationVideo({ src, poster, title, caption }) {
  const videoRef = useRef(null);
  const [frameRef, inView] = useInView({ threshold: 0.5, once: false });
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      video.play().catch(() => {});
      if (!video.muted) duckMusic(Infinity);
    } else {
      video.pause();
      unduckMusic();
    }
  }, [inView]);

  const toggleSound = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
    // With the video's own sound on, the background music steps aside.
    if (video.muted) unduckMusic();
    else {
      duckMusic(Infinity);
      video.play().catch(() => {});
    }
  };

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
          aria-label={title}
        />
        <button className="donation-video__sound" onClick={toggleSound}>
          {muted ? "🔊 Tap for sound" : "🔇 Mute"}
        </button>
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
