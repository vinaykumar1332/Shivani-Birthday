import { Fragment } from "react";
import { splitEmphasis } from "../../utils/emphasis";

// Wraps each word in a clipping mask so it can slide up into view.
// Animate `.split-word__inner` with GSAP/Framer to get the reveal.
// Words wrapped in *asterisks* render as an italic accent.
export function SplitWords({ text, wordClassName = () => "" }) {
  const words = splitEmphasis(text);
  return words.map(({ word, em }, i) => (
    <Fragment key={i}>
      <span className={`split-word ${em ? "split-word--em" : ""}`}>
        <span className={`split-word__inner ${em ? "em-accent" : ""} ${wordClassName(word)}`}>{word}</span>
      </span>
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}

// The same accents for plain paragraphs (no reveal masks).
export function Emphasized({ text }) {
  const words = splitEmphasis(text);
  return words.map(({ word, em }, i) => (
    <Fragment key={i}>
      {em ? <em className="em-accent">{word}</em> : word}
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}
