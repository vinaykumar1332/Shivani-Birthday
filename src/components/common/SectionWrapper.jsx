import "./SectionWrapper.css";

export function SectionWrapper({ id, children, bgVariant = "cream", className = "", innerClassName = "" }) {
  return (
    <section id={id} className={`section-wrap section-wrap--${bgVariant} ${className}`}>
      <div className={`section-wrap__inner container ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, lead, align = "center" }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-heading__title">{title}</h2>
      {lead && <p className="section-heading__lead">{lead}</p>}
    </div>
  );
}
