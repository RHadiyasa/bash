// In-memory rate limiter. Cocok untuk single-instance deployment.
// Untuk multi-instance (serverless), ganti dengan Redis.
const rateLimitStore = new Map();

/**
 * @param {Request} request
 * @param {object} options
 * @param {number} options.limit  - Max request per window
 * @param {number} options.windowMs - Window durasi dalam ms
 * @returns {{ allowed: boolean, retryAfter: number }}
 */
export function rateLimit(request, { limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `${request.nextUrl.pathname}:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}
