import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Invalid request", details: err.issues });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
}
