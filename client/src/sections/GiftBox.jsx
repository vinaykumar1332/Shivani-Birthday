import { useState } from "react";
import confetti from "canvas-confetti";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { birthdayConfig } from "../data/birthdayConfig";
import { playCrackers } from "../utils/sound";
import "./GiftBox.css";

export function GiftBox() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    playCrackers(6);
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors: ["#B8A1E3", "#F29A9A", "#FFC69B", "#A9CDBB"] });
  };

  return (
    <SectionWrapper id="gift" bgVariant="plum">
      <SectionHeading
        eyebrow="A Little Something"
        title="There's A Surprise Waiting For You"
        lead="Tap the box when you're ready. No rush — it's not going anywhere."
      />

      <div className="gift-stage">
        <button
          className={`gift-box ${open ? "gift-box--open" : ""}`}
          onClick={handleOpen}
          aria-label={open ? "Gift opened" : "Open your gift"}
        >
          <span className="gift-box__lid" />
          <span className="gift-box__ribbon-v" />
          <span className="gift-box__ribbon-h" />
          <span className="gift-box__base" />
          {open && (
            <>
              <span className="gift-sparkle" style={{ left: "20%" }} />
              <span className="gift-sparkle" style={{ left: "50%" }} />
              <span className="gift-sparkle" style={{ left: "75%" }} />
            </>
          )}
        </button>

        {open && (
          <div className="gift-message">
            <p>{birthdayConfig.giftBox.message}</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
