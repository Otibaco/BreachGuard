/**
 * config/env.js
 *
 * Central place to read required environment variables with a clear error
 * message if one is missing, instead of failing with a cryptic error deep
 * inside a service.
 */

export function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local against .env.example.`
    );
  }
  return value;
}

export const env = {
  mongodbUri: process.env.MONGODB_URI,
  breachApiUrl: process.env.BREACH_API_URL,
  breachApiKey: process.env.BREACH_API_KEY,
  authSecret: process.env.AUTH_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  isProduction: process.env.NODE_ENV === "production",
};
