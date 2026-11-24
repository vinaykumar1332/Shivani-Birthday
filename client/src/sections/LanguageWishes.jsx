import { useMemo, useState } from "react";
import { SectionWrapper, SectionHeading } from "../components/common/SectionWrapper";
import { languages } from "../data/languages";
import "./LanguageWishes.css";

export function LanguageWishes() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(
    () => languages.filter((l) => l.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const active = filtered[activeIdx] || languages[0];

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(active.greeting);
    utter.lang = active.code;
    window.speechSynthesis.speak(utter);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`${active.greeting} ${active.sub}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const go = (dir) => {
    setActiveIdx((i) => {
      const n = filtered.length;
      return (i + dir + n) % n;
    });
  };

  return (
    <SectionWrapper id="languages" bgVariant="cream">
      <SectionHeading
        eyebrow="25 Languages, 25 Wishes"
        title="Happy Birthday, In Every Language Possible"
        lead="Because some wishes deserve to travel across the whole world to reach you."
      />

      <div className="lang-search-wrap">
        <input
          className="lang-search"
          type="search"
          placeholder="Search a language…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
          aria-label="Search languages"
        />
      </div>

      <div className="lang-stage">
        <button className="lang-nav" onClick={() => go(-1)} aria-label="Previous language">‹</button>

        <div className="lang-card" key={active.code}>
          <span className="lang-card__flag">{active.flag}</span>
          <h3 className="lang-card__greeting">{active.greeting}</h3>
          <p className="lang-card__sub">{active.sub}</p>
          <span className="lang-card__name">{active.name}</span>
          <div className="lang-card__actions">
            <button className="lang-action" onClick={speak}>🔊 Listen</button>
            <button className="lang-action" onClick={copy}>{copied ? "✓ Copied" : "📋 Copy"}</button>
          </div>
        </div>

        <button className="lang-nav" onClick={() => go(1)} aria-label="Next language">›</button>
      </div>

      <div className="lang-grid">
        {filtered.map((l, i) => (
          <button
            key={l.code}
            className={`lang-chip ${i === activeIdx ? "lang-chip--active" : ""}`}
            onClick={() => setActiveIdx(i)}
          >
            <span>{l.flag}</span> {l.name}
          </button>
        ))}
      </div>
    </SectionWrapper>
  );
}
