import { Router, Request, Response, NextFunction } from "express";
import { chat, OpenRouterError } from "../services/openrouter.js";
import { config } from "../config.js";
import { logger } from "../logger.js";
import type { ChatRequest, ChatResponse } from "../types.js";

const router = Router();

function requireChatAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || token !== config.chatPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/", requireChatAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Partial<ChatRequest>;
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      res.status(400).json({ error: "message is required and must be a non-empty string" });
      return;
    }
    const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : undefined;
    logger.info("Chat request", { messageLength: message.length, historyLength: conversationHistory?.length ?? 0 });
    const responseText = await chat(message, conversationHistory);
    const response: ChatResponse = { response: responseText };
    res.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const details = err instanceof OpenRouterError ? err.details : undefined;
    logger.error("Chat error", { error: message, details });
    res.status(500).json(details ? { error: message, details } : { error: message });
  }
});

export default router;
