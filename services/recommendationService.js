/**
 * recommendationService.js
 *
 * Generates structured recommendations - {id, title, description, priority}
 * - from a risk level, exposed data categories, and breach status. Pure
 * function, no database or network access. `priority` is one of "urgent",
 * "recommended", or "good-practice", which the UI uses to color-code each
 * card.
 */

function cleanRecommendations() {
  return [
    {
      id: "keep-unique-passwords",
      title: "Keep using unique passwords",
      description: "Continue using a different, strong password for every account you have.",
      priority: "good-practice",
    },
    {
      id: "enable-mfa",
      title: "Turn on multi-factor authentication",
      description: "Add MFA wherever it's offered, even for accounts with no known exposure.",
      priority: "good-practice",
    },
    {
      id: "recheck-periodically",
      title: "Check back periodically",
      description: "New breaches are discovered regularly - it's worth rechecking this address occasionally.",
      priority: "good-practice",
    },
  ];
}

function breachedRecommendations({ dataTypes = [], riskLevel }) {
  const normalized = dataTypes.map((d) => String(d).toLowerCase());
  const hasPassword = normalized.some((d) => d.includes("password"));
  const hasFinancial = normalized.some(
    (d) => d.includes("credit card") || d.includes("bank") || d.includes("financial")
  );

  const recommendations = [
    {
      id: "change-password",
      title: "Change your password immediately",
      description:
        "Update the password on any account tied to this email, starting with the services named below.",
      priority: "urgent",
    },
    {
      id: "no-reuse",
      title: "Never reuse the exposed password",
      description:
        "Reused passwords are the single biggest cause of account takeover after a breach.",
      priority: "urgent",
    },
    {
      id: "enable-mfa",
      title: "Enable multi-factor authentication",
      description:
        "Add a second verification step so a leaked password alone isn't enough to get in.",
      priority: "recommended",
    },
    {
      id: "monitor-accounts",
      title: "Monitor for suspicious activity",
      description: "Watch the affected accounts for logins, emails, or changes you don't recognize.",
      priority: "recommended",
    },
  ];

  if (hasPassword) {
    recommendations.push({
      id: "password-manager",
      title: "Use a password manager",
      description: "Generate and store a strong, unique replacement password instead of reusing one.",
      priority: "recommended",
    });
  }

  if (hasFinancial) {
    recommendations.push({
      id: "review-financials",
      title: "Review financial statements",
      description: "Check recent statements on any linked financial accounts for unfamiliar charges.",
      priority: "urgent",
    });
  }

  if (riskLevel === "HIGH" || riskLevel === "CRITICAL") {
    recommendations.push({
      id: "priority-rotation",
      title: "Treat this as a priority",
      description: "Given the severity of this exposure, retire the affected credentials as soon as possible.",
      priority: "urgent",
    });
  }

  return recommendations;
}

export function generateRecommendations({ riskLevel, dataTypes = [], breachStatus }) {
  if (breachStatus !== "breached") {
    return cleanRecommendations();
  }
  return breachedRecommendations({ dataTypes, riskLevel });
}
