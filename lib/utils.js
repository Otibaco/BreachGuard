export { cn } from "cn"
import crypto from "crypto";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * shadcn/ui's standard className merge helper - combines clsx's
 * conditional class handling with tailwind-merge's conflict resolution.
 * Add shadcn components with `npx shadcn add <component>` and they'll
 * import this from "@/lib/utils" exactly as they expect.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes an email address: trims whitespace and lowercases it, so that
 * "John@Example.COM" and "john@example.com" are treated as the same input.
 */
export function normalizeEmail(rawEmail) {
  if (typeof rawEmail !== "string") return "";
  return rawEmail.trim().toLowerCase();
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * One-way hash used for security-event IP logging and any internal cache
 * keys. Never used for anything we need to reverse.
 */
export function hashValue(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

/**
 * Accepts anything with a `.get(name)` method - a NextRequest's `.headers`
 * in middleware/route handlers, or the object returned by next/headers'
 * `headers()` inside Server Components and Server Actions. Keeping this
 * duck-typed lets both call sites share one implementation.
 */
export function getClientIp(headersLike) {
  const forwarded = headersLike.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headersLike.get("x-real-ip") || "unknown";
}

export function formatDate(date) {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
