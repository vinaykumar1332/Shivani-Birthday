const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const FALLBACKS = {
  joke: "Why did the birthday cake go to therapy? Too many layers of emotional baggage. 🎂",
  poem: "Another year, another chapter,\nWritten in laughter and happy chaos.\nMay this one bring you more joy,\nThan the last — and a little less stress, too.",
  positive: "You've survived every hard year so far — that's not luck, that's you. This one's going to be even better.",
  friendship: "Not everyone gets a friend like you — loud, loyal, a little unhinged, and always, always there. Happy birthday to my favorite chaos partner.",
  motivational: "You don't need another year to prove anything. Just keep showing up as yourself — that's already more than enough.",
  default: "Happy birthday! Sending you all the good vibes today — Lumi's cup runneth over with birthday energy for you. ✨",
};

function pickFallback(message) {
  const m = message.toLowerCase();
  if (m.includes("joke")) return FALLBACKS.joke;
  if (m.includes("poem")) return FALLBACKS.poem;
  if (m.includes("positive") || m.includes("thought")) return FALLBACKS.positive;
  if (m.includes("friendship") || m.includes("sweet")) return FALLBACKS.friendship;
  if (m.includes("motivat")) return FALLBACKS.motivational;
  return FALLBACKS.default;
}

export async function sendAssistantMessage(message) {
  try {
    const res = await fetch(`${API_BASE}/api/assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Assistant unavailable");
    const data = await res.json();
    return data.reply;
  } catch {
    // Backend unreachable — use local fallback so the experience never breaks.
    return pickFallback(message);
  }
}
