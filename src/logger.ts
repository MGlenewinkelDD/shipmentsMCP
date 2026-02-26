const LOG_LEVEL = (process.env.LOG_LEVEL ?? "info").toLowerCase();
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const currentLevel = LEVELS[LOG_LEVEL as keyof typeof LEVELS] ?? LEVELS.info;

function timestamp(): string {
  return new Date().toISOString();
}

function log(level: keyof typeof LEVELS, message: string, data?: unknown): void {
  if (LEVELS[level] < currentLevel) return;
  const prefix = `${timestamp()} [${level.toUpperCase()}]`;
  if (data !== undefined) {
    console[level === "debug" ? "log" : level](prefix, message, data);
  } else {
    console[level === "debug" ? "log" : level](prefix, message);
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
