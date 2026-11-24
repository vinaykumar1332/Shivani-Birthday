import { chatSchema } from "../validators/assistantValidator.js";
import { getLumiReply } from "../services/openai/lumiService.js";

export async function chatHandler(req, res, next) {
  try {
    const { message } = chatSchema.parse(req.body);
    const reply = await getLumiReply(message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
