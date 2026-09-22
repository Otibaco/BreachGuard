/**
 * rateLimitService.js
 *
 * A simple in-memory, fixed-window rate limiter keyed by hashed IP address.
 * This is intentionally lightweight for a student project. It works well
 * for a single Node.js process (e.g. `next start` or `next dev`). If this
 * app were deployed across multiple serverless instances, the counters
 * would not be shared between them - a production system would use a
 * shared store such as Redis instead.
 */

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = global._rateLimitLog || new Map();
if (!global._rateLimitLog) {
  global._rateLimitLog = requestLog;
}

/**
 * Returns { allowed: boolean, remaining: number, resetInMs: number }
 */
export function checkRateLimit(key) {
  const now = Date.now();
  const entry = requestLog.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    requestLog.set(key, { windowStart: now, count: 1 });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetInMs: WINDOW_MS,
    };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: WINDOW_MS - (now - entry.windowStart),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetInMs: WINDOW_MS - (now - entry.windowStart),
  };
}

export const RATE_LIMIT_CONFIG = {
  windowMs: WINDOW_MS,
  maxRequests: MAX_REQUESTS_PER_WINDOW,
};
