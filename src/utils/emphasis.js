const OPEN = /^([^\w*]*)\*/;
const CLOSE = /\*([^\w*]*)$/;

// Splits text into words, marking any run wrapped in *asterisks* as an italic
// accent: "London Is *Calling*, Sivani" → "Calling," is emphasized.
export function splitEmphasis(text) {
  let inside = false;
  return text.split(" ").map((raw) => {
    let word = raw;
    let em = inside;
    if (OPEN.test(word)) {
      word = word.replace(OPEN, "$1");
      em = true;
      inside = true;
    }
    if (CLOSE.test(word)) {
      word = word.replace(CLOSE, "$1");
      inside = false;
    }
    return { word, em };
  });
}

export const stripEmphasis = (text) => text.replace(/\*/g, "");
