import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./logger.js";
import chatRouter from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/chat", chatRouter);

app.listen(config.port, () => {
  logger.info(`AI middleware server listening on http://localhost:${config.port}`);
});
