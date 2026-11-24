import { Fragment } from "react";

// Wraps each word in a clipping mask so it can slide up into view.
// Animate `.split-word__inner` with GSAP/Framer to get the reveal.
export function SplitWords({ text, wordClassName = () => "" }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className="split-word">
        <span className={`split-word__inner ${wordClassName(w)}`}>{w}</span>
      </span>
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}
