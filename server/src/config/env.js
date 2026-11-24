import "dotenv/config";

export const env = {
  port: process.env.PORT || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  maxResponseTokens: Number(process.env.MAX_RESPONSE_TOKENS || 300),
};
