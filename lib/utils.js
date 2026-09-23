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
 * Accepts either a standard Web Headers instance or a plain object/iterable
 * of request headers. The Next.js runtime can expose headers in different
 * shapes depending on the server environment, so we normalize before reading
 * x-forwarded-for / x-real-ip.
 */
export function getClientIp(headersLike) {
  if (!headersLike) return "unknown";

  const headerEntries =
    typeof headersLike.entries === "function"
      ? Object.fromEntries([...headersLike.entries()])
      : typeof headersLike.get === "function"
        ? Object.fromEntries([...headersLike])
        : headersLike;

  const getHeader = (name) => {
    if (typeof headersLike.get === "function") {
      const value = headersLike.get(name);
      if (value !== null && value !== undefined) return value;
    }

    const key = Object.keys(headerEntries).find(
      (headerName) => headerName.toLowerCase() === name.toLowerCase()
    );

    if (!key) return undefined;

    const value = headerEntries[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const forwarded = getHeader("x-forwarded-for");
  if (forwarded) return String(forwarded).split(",")[0].trim();

  const realIp = getHeader("x-real-ip");
  return realIp ? String(realIp) : "unknown";
}

export function formatDate(date) {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
