/**
 * riskScoringService.js
 *
 * Pure, dependency-free scoring logic. No database operations, no network
 * calls. Takes a normalized breach result and returns an explainable
 * 0-100 risk score built from three factors: frequency, recency, and the
 * sensitivity of the data types that were exposed.
 *
 * This is an educational heuristic, not a certified security assessment.
 */

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;

/**
 * Frequency score - 0 to 40, based on how many breaches contained the email.
 */
export function scoreFrequency(breachCount) {
  if (breachCount <= 0) return 0;
  if (breachCount === 1) return 10;
  if (breachCount === 2) return 20;
  if (breachCount === 3) return 30;
  return 40; // 4 or more
}

/**
 * Recency score - 0 to 30, based on the most recent breach date.
 */
export function scoreRecency(mostRecentBreachDate) {
  if (!mostRecentBreachDate) return 0;

  const date = new Date(mostRecentBreachDate);
  if (Number.isNaN(date.getTime())) return 0;

  const ageInYears = (Date.now() - date.getTime()) / MS_PER_YEAR;

  if (ageInYears < 1) return 30;
  if (ageInYears < 3) return 20;
  if (ageInYears <= 5) return 10;
  return 5;
}

/**
 * Data sensitivity score - 0 to 30, based on the most sensitive category
 * of data exposed across all breaches.
 */
export function scoreSensitivity(dataTypes) {
  if (!Array.isArray(dataTypes) || dataTypes.length === 0) return 0;

  const normalized = dataTypes.map((d) => String(d).toLowerCase());

  const SENSITIVE_EXTRA = [
    "credit card",
    "card number",
    "ssn",
    "social security",
    "bank account",
    "security question",
    "id number",
    "national id",
    "passport",
  ];

  const hasSensitiveExtra = normalized.some((d) =>
    SENSITIVE_EXTRA.some((keyword) => d.includes(keyword))
  );
  const hasPassword = normalized.some((d) => d.includes("password"));
  const hasUsername = normalized.some(
    (d) => d.includes("username") || d.includes("user name")
  );

  if (hasPassword && hasSensitiveExtra) return 30;
  if (hasPassword) return 20;
  if (hasUsername) return 10;
  return 5; // email address only, or an otherwise unrecognized category
}

export function getRiskLevel(score) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

/**
 * Computes the full risk assessment for a normalized breach result.
 *
 * @param {object} normalizedBreachResult
 * @param {boolean} normalizedBreachResult.found
 * @param {number} normalizedBreachResult.breachCount
 * @param {Array<{name: string, date: string, dataTypes: string[]}>} normalizedBreachResult.breaches
 */
export function calculateRiskScore(normalizedBreachResult) {
  const { found, breachCount = 0, breaches = [] } = normalizedBreachResult || {};

  if (!found || breachCount === 0) {
    return {
      riskScore: 0,
      riskLevel: getRiskLevel(0),
      breakdown: { frequency: 0, recency: 0, sensitivity: 0 },
    };
  }

  const mostRecentDate = breaches.reduce((latest, breach) => {
    const d = new Date(breach.date);
    if (Number.isNaN(d.getTime())) return latest;
    if (!latest || d > latest) return d;
    return latest;
  }, null);

  const allDataTypes = breaches.flatMap((b) => b.dataTypes || []);

  const frequencyScore = scoreFrequency(breachCount);
  const recencyScore = scoreRecency(mostRecentDate);
  const sensitivityScore = scoreSensitivity(allDataTypes);

  const rawScore = frequencyScore + recencyScore + sensitivityScore;
  const riskScore = Math.min(100, Math.max(0, rawScore));

  return {
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    breakdown: {
      frequency: frequencyScore,
      recency: recencyScore,
      sensitivity: sensitivityScore,
    },
  };
}
