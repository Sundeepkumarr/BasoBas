const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug';

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
};

const timestamp = (): string => new Date().toISOString();

export const logger = {
  error: (message: string, meta?: unknown) => {
    if (shouldLog('error')) console.error(`[${timestamp()}] ❌ ERROR: ${message}`, meta || '');
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog('warn')) console.warn(`[${timestamp()}] ⚠️ WARN: ${message}`, meta || '');
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog('info')) console.info(`[${timestamp()}] ℹ️ INFO: ${message}`, meta || '');
  },
  debug: (message: string, meta?: unknown) => {
    if (shouldLog('debug')) console.debug(`[${timestamp()}] 🔍 DEBUG: ${message}`, meta || '');
  },
};
