import "./AmbientBackground.css";

// A single fixed, full-page field of drifting color that sits behind every
// section, so the site reads as one continuous colored world instead of
// a vivid hero followed by flat white cards.
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <span className="ambient-bg__blob ambient-bg__blob--1" />
      <span className="ambient-bg__blob ambient-bg__blob--2" />
      <span className="ambient-bg__blob ambient-bg__blob--3" />
      <span className="ambient-bg__blob ambient-bg__blob--4" />
      <span className="ambient-bg__grain" />
    </div>
  );
}
