const REQUIRED_KEYS = ["OPENROUTER_API_KEY", "BACKEND_API_URL", "CHAT_PASSWORD"];

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (REQUIRED_KEYS.includes(key) && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? "";
}

export const config = {
  openRouterApiKey: getEnv("OPENROUTER_API_KEY"),
  backendApiUrl: getEnv("BACKEND_API_URL", "http://localhost:3000").replace(/\/$/, ""),
  model: getEnv("MODEL"),
  port: parseInt(getEnv("PORT", "3001"), 10) || 3001,
  chatPassword: getEnv("CHAT_PASSWORD"),
};
