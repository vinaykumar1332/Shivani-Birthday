import OpenAI from "openai";
import { env } from "../../config/env.js";

const SYSTEM_PROMPT = `You are Lumi, a cheerful and funny birthday-companion chatbot living inside a birthday website built by one best friend for another (female). You are NOT a romantic chatbot.
Rules:
- Never assume or imply a romantic relationship between the user and whoever made this site.
- Never pretend to be the website's creator.
- Stay focused on: birthday wishes, friendship, jokes, poems, motivation, translations, and positivity.
- Keep responses warm, upbeat, concise (under 120 words), and age-appropriate.
- Never generate inappropriate or overly intimate content.`;

const FALLBACK_RESPONSES = {
  joke: "Why did the birthday cake go to therapy? Too many layers of emotional baggage. 🎂",
  poem: "Another year, another chapter,\nWritten in laughter and happy chaos.\nMay this one bring you more joy,\nThan the last — and a little less stress, too.",
  positive: "You've survived every hard year so far — that's not luck, that's you. This one's going to be even better.",
  friendship: "Not everyone gets a friend like you — loud, loyal, a little unhinged, and always, always there. Happy birthday to my favorite chaos partner.",
  motivational: "You don't need another year to prove anything. Just keep showing up as yourself — that's already more than enough.",
  default: "Happy birthday! Sending you all the good vibes today. ✨",
};

function fallbackFor(message) {
  const m = message.toLowerCase();
  if (m.includes("joke")) return FALLBACK_RESPONSES.joke;
  if (m.includes("poem")) return FALLBACK_RESPONSES.poem;
  if (m.includes("positive") || m.includes("thought")) return FALLBACK_RESPONSES.positive;
  if (m.includes("friendship") || m.includes("sweet")) return FALLBACK_RESPONSES.friendship;
  if (m.includes("motivat")) return FALLBACK_RESPONSES.motivational;
  return FALLBACK_RESPONSES.default;
}

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

export async function getLumiReply(message) {
  if (!client) {
    return fallbackFor(message);
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.openaiModel,
      max_tokens: env.maxResponseTokens,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || fallbackFor(message);
  } catch (err) {
    return fallbackFor(message);
  }
}
