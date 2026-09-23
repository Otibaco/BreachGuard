/**
 * breachApiService.js
 *
 * Owns all communication with the external breach-data API. The API key
 * is not logged or returned to callers. XposedOrNot's public email check
 * does not require a key, while older HIBP-style integrations do.
 */

export class BreachApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "BreachApiError";
    this.status = status || 502;
    this.code = code || "BREACH_API_ERROR";
  }
}

export class BreachApiTimeoutError extends BreachApiError {
  constructor() {
    super("The breach data provider timed out.", {
      status: 504,
      code: "BREACH_API_TIMEOUT",
    });
  }
}

export class BreachApiNotConfiguredError extends BreachApiError {
  constructor() {
    super("The breach data provider is not configured.", {
      status: 503,
      code: "BREACH_API_NOT_CONFIGURED",
    });
  }
}

const REQUEST_TIMEOUT_MS = 8000;

function isConfigured() {
  return Boolean(process.env.BREACH_API_URL);
}

function isValidProviderUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.toLowerCase();

    if (!["http:", "https:"].includes(protocol)) {
      return false;
    }

    const validHosts = [
      /^(?:api\.)?xposedornot\.com$/,
      /^(?:api\.)?haveibeenpwned\.com$/,
      /^(?:api\.)?pwnedpasswords\.com$/,
      /^(?:api\.)?hibp\.com$/,
      /^(?:.*\.)?xposedornot\.com$/,
      /^(?:.*\.)?haveibeenpwned\.com$/,
      /^(?:.*\.)?pwnedpasswords\.com$/,
      /^(?:.*\.)?hibp\.com$/,
    ];

    return validHosts.some((pattern) => pattern.test(host));
  } catch {
    return false;
  }
}

function isXposedOrNotUrl(url) {
  if (!url) return false;
  return /xposedornot\.com|api\.xposedornot\.com/i.test(url);
}

function isHibpUrl(url) {
  if (!url) return false;
  return /haveibeenpwned|hibp/i.test(url);
}

function buildProviderUrl(normalizedEmail) {
  const baseUrl = (process.env.BREACH_API_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return "";

  const emailParam = encodeURIComponent(normalizedEmail);

  if (isHibpUrl(baseUrl)) {
    return `${baseUrl}/breachedaccount/${emailParam}?truncateResponse=false`;
  }

  if (baseUrl.includes("/v1/check-email")) {
    return `${baseUrl}/${emailParam}?details=true`;
  }

  if (baseUrl.includes("/v1")) {
    return `${baseUrl}/check-email/${emailParam}?details=true`;
  }

  return `${baseUrl}/v1/check-email/${emailParam}?details=true`;
}

function getProviderHeaders() {
  const headers = {
    Accept: "application/json",
    "user-agent": "BreachGuard-Student-Project",
  };

  if (process.env.BREACH_API_KEY && isHibpUrl(process.env.BREACH_API_URL)) {
    headers["hibp-api-key"] = process.env.BREACH_API_KEY;
  }

  return headers;
}

function normalizeBreachesEntry(entry) {
  if (Array.isArray(entry)) {
    const [name, title] = entry;
    return {
      name: name || title || "Unknown source",
      title: title || name || "Unknown source",
      domain: "",
      date: null,
      description: "",
      pwnCount: 0,
      dataTypes: [],
    };
  }

  if (typeof entry === "string") {
    return {
      name: entry,
      title: entry,
      domain: "",
      date: null,
      description: "",
      pwnCount: 0,
      dataTypes: [],
    };
  }

  if (entry && typeof entry === "object") {
    const title =
      entry.Title ||
      entry.title ||
      entry.Name ||
      entry.name ||
      entry.breach ||
      entry.breachName ||
      "Unknown source";

    return {
      name: entry.Name || entry.name || entry.breach || title,
      title,
      domain: entry.Domain || entry.domain || "",
      date: entry.BreachDate || entry.breachDate || entry.date || null,
      description: entry.Description || entry.description || "",
      pwnCount: entry.PwnCount || entry.pwnCount || entry.exposedRecords || entry.exposed_records || 0,
      dataTypes: entry.DataClasses || entry.dataClasses || entry.dataTypes || [],
    };
  }

  return null;
}

/**
 * Maps a provider's raw breach list into BreachGuard's internal, stable
 * shape. This adapter handles both the legacy HIBP shape and the public
 * XposedOrNot email response shape.
 */
function mapProviderResponseToInternalShape(providerResponse) {
  if (!providerResponse || typeof providerResponse !== "object") return [];

  const rawBreaches =
    Array.isArray(providerResponse) ? providerResponse : providerResponse.breaches || providerResponse.Breaches || [];

  if (!Array.isArray(rawBreaches)) return [];

  return rawBreaches
    .map((breach) => normalizeBreachesEntry(breach))
    .filter(Boolean);
}

/**
 * Calls the configured external breach API for a single, already-normalized
 * email address and returns BreachGuard's internal normalized shape:
 *
 *   { found: boolean, breachCount: number, breaches: Array }
 */
export async function checkEmailAgainstBreachApi(normalizedEmail) {
  if (!isConfigured()) {
    throw new BreachApiNotConfiguredError();
  }

  if (!isValidProviderUrl(process.env.BREACH_API_URL)) {
    throw new BreachApiError("The configured breach API URL is invalid.", {
      status: 400,
      code: "BREACH_API_INVALID_URL",
    });
  }

  const providerUrl = buildProviderUrl(normalizedEmail);
  const providerHeaders = getProviderHeaders();

  if (isHibpUrl(process.env.BREACH_API_URL) && !process.env.BREACH_API_KEY) {
    throw new BreachApiNotConfiguredError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(providerUrl, {
      method: "GET",
      headers: providerHeaders,
      signal: controller.signal,
    });

    if (response.status === 404) {
      return { found: false, breachCount: 0, breaches: [] };
    }

    if (response.status === 429) {
      throw new BreachApiError("The breach data provider rate-limited this request.", {
        status: 429,
        code: "BREACH_API_RATE_LIMITED",
      });
    }

    if (!response.ok) {
      throw new BreachApiError("The breach data provider returned an error.", {
        status: 502,
        code: "BREACH_API_UPSTREAM_ERROR",
      });
    }

    const raw = await response.json();
    if (raw && typeof raw === "object" && raw.Error === "Not found") {
      return { found: false, breachCount: 0, breaches: [] };
    }

    const breaches = mapProviderResponseToInternalShape(raw);

    return {
      found: breaches.length > 0,
      breachCount: breaches.length,
      breaches,
    };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new BreachApiTimeoutError();
    }
    if (err instanceof BreachApiError) {
      throw err;
    }
    throw new BreachApiError("Unable to reach the breach data provider.", {
      status: 502,
      code: "BREACH_API_NETWORK_ERROR",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function isBreachApiConfigured() {
  return isConfigured();
}
