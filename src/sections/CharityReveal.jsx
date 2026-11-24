import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { ScratchCard } from "../components/ui/ScratchCard";
import { DonationGallery } from "../components/birthday/DonationGallery";
import { DonationVideo } from "../components/birthday/DonationVideo";
import { useInView } from "../hooks/useInView";
import { birthdayConfig } from "../data/birthdayConfig";
import { playMagicChime } from "../utils/sound";
import "./CharityReveal.css";

const AUTO_REVEAL_MS = 7000;

function PendingDonation({ d }) {
  return (
    <div className="charity__card">
      <span className="charity__status">
        <span className="charity__status-dot" /> In progress
      </span>
      <p className="charity__card-value">{d.pendingMessage}</p>
    </div>
  );
}

export function CharityReveal() {
  const d = birthdayConfig.donation;
  const [revealed, setRevealed] = useState(false);
  const [scratchRef, scratchInView] = useInView({ threshold: 0.6 });

  const handleReveal = () => {
    playMagicChime();
    setRevealed(true);
  };

  return (
    <SectionWrapper id="donation" bgVariant="gold">
      <div className="charity">
        <SectionHeading eyebrow="A Gift For Someone Else, Too" title={d.mainMessage} lead={d.supportingMessage} />

        {!d.completed ? (
          <PendingDonation d={d} />
        ) : (
          <>
            <div className="charity__reveal-row">
              <div ref={scratchRef} className="charity__scratch">
                <ScratchCard
                  width={300}
                  height={400}
                  label="Scratch to see your gift ✨"
                  bleed
                  active={scratchInView}
                  autoRevealAfter={AUTO_REVEAL_MS}
                  onReveal={handleReveal}
                >
                  <img className="charity__reveal-photo" src={d.revealPhoto} alt={`A food parcel with ${birthdayConfig.friendName}'s birthday label`} decoding="async" />
                  <span className="charity__reveal-caption">{d.revealCaption}</span>
                </ScratchCard>
                <p className="charity__scratch-hint">{revealed ? "Revealed! ✨" : "Scratch with your finger — or wait, it'll reveal itself"}</p>
              </div>

              <div className="charity__card">
                <span className="charity__status charity__status--done">
                  <span className="charity__status-dot" /> Delivered on your birthday
                </span>
                <dl className="charity__facts">
                  <div>
                    <dt>Shared through</dt>
                    <dd>{d.ngoName}</dd>
                  </div>
                  <div>
                    <dt>What was given</dt>
                    <dd>{d.foodDetails}</dd>
                  </div>
                  {d.amount && (
                    <div>
                      <dt>Amount</dt>
                      <dd>{d.amount}</dd>
                    </div>
                  )}
                  {d.date && (
                    <div>
                      <dt>Date</dt>
                      <dd>{d.date}</dd>
                    </div>
                  )}
                </dl>
                {d.certificateAvailable && <p className="charity__cert">Certificate available</p>}
              </div>
            </div>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="charity__gallery"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                  <h3 className="charity__subheading">Moments from your birthday drive</h3>
                  <DonationGallery photos={d.photos} alt={`Food parcels with ${birthdayConfig.friendName}'s birthday label`} />
                </motion.div>
              )}
            </AnimatePresence>

            <DonationVideo src={d.video.src} poster={d.video.poster} title={d.video.title} caption={d.video.caption} />

            <blockquote className="charity__quote">
              <span className="charity__quote-mark" aria-hidden="true">“</span>
              <p>{d.quote.text}</p>
              <footer>{d.quote.signoff}</footer>
            </blockquote>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
