import { config } from "../config.js";
import { logger } from "../logger.js";
import type { ChatMessage, OpenRouterMessage, ToolCall } from "../types.js";
import { toolDefinitions } from "../tools/definitions.js";
import { executeTool } from "../tools/executor.js";

export interface OpenRouterErrorDetails {
  message?: string;
  code?: string;
  status?: number;
  [key: string]: unknown;
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly details?: OpenRouterErrorDetails
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a shipment logistics assistant. You have access to a backend API with shipment data, shipment details (tracking, SLA, delivery status), and reference lookup tables (countries, service codes, shipment statuses, delivery statuses, last track codes, SLA checks).

Use the provided tools to look up data before answering. Prefer listing or filtering by date range when the user asks about shipments in a period. Use reasonable limits (e.g. limit 50 or 100) to avoid huge responses. Present data clearly: use tables or bullet lists and summarize counts when relevant.`;

interface OpenRouterChoice {
  message: {
    role: string;
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: string;
      function: { name: string; arguments: string };
    }>;
  };
  finish_reason?: string;
}

interface OpenRouterErrorPayload {
  message: string;
  code?: string;
  [key: string]: unknown;
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: OpenRouterErrorPayload;
}

function buildMessages(
  userMessage: string,
  conversationHistory?: ChatMessage[]
): OpenRouterMessage[] {
  const messages: OpenRouterMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  if (conversationHistory?.length) {
    for (const m of conversationHistory) {
      if (m.role === "user" || m.role === "assistant") {
        messages.push({ role: m.role, content: m.content ?? "" });
      }
    }
  }
  messages.push({ role: "user", content: userMessage });
  return messages;
}

export async function chat(
  userMessage: string,
  conversationHistory?: ChatMessage[]
): Promise<string> {
  let messages: OpenRouterMessage[] = buildMessages(userMessage, conversationHistory);
  const maxRounds = 15;
  let rounds = 0;

  while (rounds < maxRounds) {
    rounds += 1;
    const body = {
      model: config.model,
      messages,
      tools: toolDefinitions,
      tool_choice: "auto",
    };

    logger.debug("OpenRouter request", { round: rounds, model: config.model, messageCount: messages.length });

    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openRouterApiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as OpenRouterResponse;
    if (data.error) {
      const details: OpenRouterErrorDetails = {
        ...data.error,
        status: res.status,
      };
      logger.error("OpenRouter provider/API error", { status: res.status, fullError: data.error });
      throw new OpenRouterError(`OpenRouter: ${data.error.message}`, details);
    }
    if (!res.ok) {
      const errPayload = data as { error?: { message?: string } };
      const detailMessage =
        errPayload?.error && typeof errPayload.error === "object" && "message" in errPayload.error
          ? String(errPayload.error.message)
          : JSON.stringify(data);
      logger.error("OpenRouter HTTP error", { status: res.status, body: data });
      throw new OpenRouterError(`OpenRouter HTTP ${res.status}`, {
        message: detailMessage,
        status: res.status,
        body: data,
      });
    }

    const choice = data.choices?.[0];
    if (!choice?.message) {
      logger.error("OpenRouter: no choices in response", { body: data });
      throw new OpenRouterError("OpenRouter: no choices in response", { message: "No choices in response", body: data });
    }

    const msg = choice.message;
    const toolCalls = msg.tool_calls;

    if (!toolCalls?.length) {
      const content = msg.content?.trim();
      return content ?? "I don't have a response for that.";
    }

    messages.push({
      role: "assistant",
      content: msg.content ?? null,
      tool_calls: toolCalls as ToolCall[],
    });

    for (const tc of toolCalls) {
      const name = tc.function.name;
      let args: Record<string, unknown> = {};
      try {
        if (tc.function.arguments?.trim()) {
          args = JSON.parse(tc.function.arguments) as Record<string, unknown>;
        }
      } catch {
        args = {};
      }
      let result: string;
      try {
        result = await executeTool(name, args);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        logger.warn("Tool execution failed", { tool: name, error: errMsg });
        result = JSON.stringify({ error: errMsg });
      }
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }
  }

  logger.warn("OpenRouter: too many tool-call rounds", { maxRounds });
  throw new OpenRouterError("OpenRouter: too many tool-call rounds", { message: "Too many rounds", rounds: maxRounds });
}
