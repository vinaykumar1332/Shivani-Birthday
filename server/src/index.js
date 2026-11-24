import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "10kb" }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 });
app.use(globalLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/assistant", assistantRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Birthday Universe API running on port ${env.port}`);
});
