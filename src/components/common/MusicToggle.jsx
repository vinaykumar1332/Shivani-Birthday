import { useState } from "react";
import { isMusicEnabled, setMusicEnabled } from "../../utils/backgroundMusic";
import "./MusicToggle.css";

export function MusicToggle() {
  const [on, setOn] = useState(isMusicEnabled);

  const toggle = () => {
    setMusicEnabled(!on);
    setOn(!on);
  };

  return (
    <button
      className={`music-toggle ${on ? "is-on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn background music off" : "Turn background music on"}
    >
      <span className="music-toggle__bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
