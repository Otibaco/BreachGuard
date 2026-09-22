import connectToDatabase from "@/lib/connectDB";
import BreachCheck from "@/models/BreachCheck";
import BreachCache from "@/models/BreachCache";
import { normalizeEmail, isValidEmail, hashValue } from "@/lib/utils";
import {
  checkEmailAgainstBreachApi,
  BreachApiError,
} from "@/services/breachApiService";
import { calculateRiskScore } from "@/services/riskScoringService";
import { generateRecommendations } from "@/services/recommendationService";
import { logSecurityEvent } from "@/controllers/securityEventController";
import { checkRateLimit } from "@/services/rateLimitService";

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export class RateLimitError extends Error {
  constructor(resetInMs) {
    super("Too many requests. Please wait a moment before trying again.");
    this.name = "RateLimitError";
    this.statusCode = 429;
    this.resetInMs = resetInMs;
  }
}

/**
 * checkBreach()
 *
 * Full server-side flow for a public breach check. Called directly from
 * the Server Action in app/actions/breach.js - there is no public API
 * endpoint for this at all, which keeps the surface area smaller for a
 * cybersecurity project:
 *   1. Rate limit by hashed IP
 *   2. Validate and normalize the email
 *   3. Check the short-lived cache
 *   4. Call the external breach API if needed
 *   5. Run the risk engine
 *   6. Generate recommendations
 *   7. Persist an aggregate (non-identifying) record
 *   8. Return a sanitized, UI-ready result
 */
export async function checkBreach({ rawEmail, ipHash }) {
  const { allowed, resetInMs } = checkRateLimit(ipHash);
  if (!allowed) {
    await logSecurityEvent({
      type: "rate_limit_exceeded",
      ipHash,
      metadata: { source: "breach_check" },
    });
    throw new RateLimitError(resetInMs);
  }

  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    await logSecurityEvent({
      type: "invalid_breach_request",
      ipHash,
      metadata: { reason: "invalid_email_format" },
    });
    throw new ValidationError("Enter a valid email address.");
  }

  await connectToDatabase();

  const emailHash = hashValue(email);

  let normalizedResult = await getFromCache(emailHash);

  if (!normalizedResult) {
    try {
      normalizedResult = await checkEmailAgainstBreachApi(email);
    } catch (err) {
      if (err instanceof BreachApiError) {
        throw err;
      }
      throw new BreachApiError("Unable to complete breach check right now.");
    }
    await saveToCache(emailHash, normalizedResult);
  }

  const { riskScore, riskLevel, breakdown } = calculateRiskScore(normalizedResult);

  const status = normalizedResult.found ? "breached" : "clean";
  const allDataTypes = normalizedResult.breaches.flatMap((b) => b.dataTypes || []);

  const recommendations = generateRecommendations({
    riskLevel,
    dataTypes: allDataTypes,
    breachStatus: status,
  });

  // Store only aggregate, non-identifying information.
  await BreachCheck.create({
    status,
    breachCount: normalizedResult.breachCount,
    riskScore,
    riskLevel,
  });

  const breaches = normalizedResult.breaches.map((b) => ({
    name: b.name,
    title: b.title || b.name,
    domain: b.domain || "",
    breachDate: b.date,
    description: b.description || "",
    pwnCount: b.pwnCount || 0,
    dataClasses: b.dataTypes || [],
  }));

  return {
    success: true,
    status,
    found: normalizedResult.found,
    breachCount: normalizedResult.breachCount,
    breaches,
    exposedDataClasses: Array.from(new Set(allDataTypes)),
    riskScore,
    riskLevel,
    riskBreakdown: breakdown,
    recommendations,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * getPublicStats()
 *
 * Small, safe aggregate used on the homepage. Never exposes anything
 * beyond counts - no emails, no per-check detail.
 */
export async function getPublicStats() {
  try {
    await connectToDatabase();
    const [totalChecks, breachedCount] = await Promise.all([
      BreachCheck.countDocuments({}),
      BreachCheck.countDocuments({ status: "breached" }),
    ]);
    return { totalChecks, breachedCount, available: true };
  } catch {
    return { totalChecks: 0, breachedCount: 0, available: false };
  }
}

async function getFromCache(emailHash) {
  try {
    const cached = await BreachCache.findOne({
      emailHash,
      expiresAt: { $gt: new Date() },
    }).lean();
    return cached?.normalizedResult || null;
  } catch {
    // Cache is a best-effort optimization; never fail the request over it.
    return null;
  }
}

async function saveToCache(emailHash, normalizedResult) {
  try {
    await BreachCache.findOneAndUpdate(
      { emailHash },
      {
        emailHash,
        normalizedResult,
        expiresAt: new Date(Date.now() + CACHE_TTL_MS),
      },
      { upsert: true }
    );
  } catch {
    // Non-fatal.
  }
}
