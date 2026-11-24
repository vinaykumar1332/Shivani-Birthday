import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useParallax } from "../hooks/useParallax";
import { birthdayConfig } from "../data/birthdayConfig";
import "./FriendshipStory.css";

function MemoryCard({ m, i }) {
  const photoRef = useParallax(i % 2 === 0 ? -0.18 : 0.18);

  return (
    <div
      className={`polaroid reveal-item ${i % 3 === 1 ? "polaroid--tall" : ""}`}
      style={{
        "--rot": `${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg`,
        "--lift": `${(i % 3) * 18}px`,
      }}
    >
      <div className="polaroid__frame">
        <img ref={photoRef} className="polaroid__photo" src={m.photo} alt={m.year} loading="lazy" />
        <span className="polaroid__sticker" aria-hidden="true">{m.emoji}</span>
        <div className="polaroid__scrim" />
        <div className="polaroid__text">
          <p className="polaroid__year">{m.year}</p>
          <p className="polaroid__caption">{m.caption}</p>
        </div>
      </div>
    </div>
  );
}

export function FriendshipStory() {
  const containerRef = useRevealAnimation({ selector: ".polaroid" });
  const { title, intro, memories } = birthdayConfig.friendshipStory;

  return (
    <SectionWrapper id="story" bgVariant="surface">
      <span className="story__numeral" aria-hidden="true">02</span>
      <SectionHeading eyebrow="Our Story" title={title} lead={intro} />
      <div ref={containerRef} className="memory-gallery">
        {memories.map((m, i) => (
          <MemoryCard m={m} i={i} key={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
