import { birthdayConfig } from "../data/birthdayConfig";
import "./FinalScreen.css";

export function FinalScreen() {
  const { title, subtitle } = birthdayConfig.finalMessage;

  const restart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="final" id="final">
      <div className="final__particles" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="final__particle" style={{ "--i": i }} />
        ))}
      </div>
      <div className="final__content container">
        <span className="final__butterfly" aria-hidden="true">🦋</span>
        <h2 className="final__title">{title}</h2>
        <p className="final__subtitle">{subtitle}</p>
        <button className="final__restart" onClick={restart}>Restart The Experience ↺</button>
      </div>
    </section>
  );
}
