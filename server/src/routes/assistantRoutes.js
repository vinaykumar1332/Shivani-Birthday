import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chatHandler } from "../controllers/assistantController.js";

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/chat", chatLimiter, chatHandler);

export default router;
