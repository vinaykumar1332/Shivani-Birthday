import { SectionWrapper } from "../components/common/SectionWrapper";
import { ScratchCard } from "../components/ui/ScratchCard";
import { birthdayConfig } from "../data/birthdayConfig";
import "./CharityReveal.css";

export function CharityReveal() {
  const d = birthdayConfig.donation;

  return (
    <SectionWrapper id="donation" bgVariant="gold">
      <div className="charity">
        <span className="eyebrow">A Gift For Someone Else, Too</span>
        <h2 className="charity__title">{d.mainMessage}</h2>
        <p className="charity__lead">{d.supportingMessage}</p>

        <div className="charity__scratch-wrap">
          <ScratchCard width={300} height={200} label="Scratch to reveal the donation ✨">
            <div className="charity__detail">
              <p><strong>NGO:</strong> {d.ngoName}</p>
              <p><strong>Amount:</strong> {d.amount}</p>
              <p><strong>Date:</strong> {d.date}</p>
            </div>
          </ScratchCard>
        </div>

        <div className="charity__card">
          <p className="charity__card-label">Food Donation Details</p>
          <p className="charity__card-value">{d.foodDetails}</p>
          {d.certificateAvailable ? (
            <p className="charity__cert">🎖️ Certificate available</p>
          ) : (
            <p className="charity__cert charity__cert--pending">Certificate will be added once the donation is confirmed.</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
