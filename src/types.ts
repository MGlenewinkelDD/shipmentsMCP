/** Message in conversation history (OpenRouter / OpenAI format) */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | null;
}

/** Tool call request from the model */
export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

/** Tool result we send back to the model */
export interface ToolCallMessage {
  role: "assistant";
  content: string | null;
  tool_calls?: ToolCall[];
}

export interface ToolResultMessage {
  role: "tool";
  tool_call_id: string;
  content: string;
}

/** Request body from frontend: POST /api/chat */
export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

/** Response body to frontend */
export interface ChatResponse {
  response: string;
}

/** OpenRouter chat completion request (subset we use) */
export interface OpenRouterMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}
