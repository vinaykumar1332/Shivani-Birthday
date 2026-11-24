import { test } from "node:test";
import assert from "node:assert/strict";
import { splitEmphasis } from "../src/utils/emphasis.js";

const em = (text) => splitEmphasis(text).filter((w) => w.em).map((w) => w.word);

test("single word", () => {
  assert.deepEqual(em("There's A *Surprise* Waiting"), ["Surprise"]);
});

test("multi-word phrase", () => {
  assert.deepEqual(em("Today Is *All About You*"), ["All", "About", "You"]);
});

test("punctuation after the closing star stays", () => {
  assert.deepEqual(splitEmphasis("London Is *Calling*, Sivani")[2], { word: "Calling,", em: true });
});

test("punctuation inside the stars", () => {
  assert.deepEqual(em("This next chapter? *You've got it.*"), ["You've", "got", "it."]);
});

test("no stars, nothing emphasized, no stars left behind", () => {
  const words = splitEmphasis("Plain text here");
  assert.equal(words.some((w) => w.em || w.word.includes("*")), false);
});
