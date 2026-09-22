/**
 * breachApiService.js
 *
 * Owns all communication with the external breach-data API. The API key
 * never leaves this file's requests - it is read from the server-only
 * environment variable BREACH_API_KEY and is never logged or returned
 * to the caller.
 *
 * The default implementation below targets the shape of the
 * Have I Been Pwned v3 "breachedaccount" endpoint, since that is the most
 * common breach-data API used for student projects. If you configure a
 * different provider, adjust `mapProviderResponseToInternalShape` to match
 * its actual response fields - do not invent fields that the provider does
 * not return.
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
  return Boolean(process.env.BREACH_API_URL && process.env.BREACH_API_KEY);
}

/**
 * Maps a provider's raw breach list into BreachGuard's internal, stable
 * shape. Adjust the field mapping here if your provider's response differs -
 * never fabricate fields that aren't actually returned by the API.
 */
function mapProviderResponseToInternalShape(providerBreaches) {
  if (!Array.isArray(providerBreaches)) return [];

  return providerBreaches.map((breach) => {
    const title = breach.Title || breach.title || breach.Name || breach.name || "Unknown source";
    return {
      name: breach.Name || breach.name || title,
      title,
      domain: breach.Domain || breach.domain || "",
      date: breach.BreachDate || breach.date || breach.breachDate || null,
      description: breach.Description || breach.description || "",
      pwnCount: breach.PwnCount || breach.pwnCount || 0,
      dataTypes: breach.DataClasses || breach.dataTypes || breach.dataClasses || [],
    };
  });
}

/**
 * Calls the configured external breach API for a single, already-normalized
 * email address and returns BreachGuard's internal normalized shape:
 *
 *   { found: boolean, breachCount: number, breaches: Array }
 *
 * Throws BreachApiError (or a subclass) on any failure. Callers should
 * catch these and translate them into sanitized client-facing responses -
 * never forward the raw error to the browser.
 */
export async function checkEmailAgainstBreachApi(normalizedEmail) {
  if (!isConfigured()) {
    throw new BreachApiNotConfiguredError();
  }

  const url = `${process.env.BREACH_API_URL.replace(/\/$/, "")}/breachedaccount/${encodeURIComponent(
    normalizedEmail
  )}?truncateResponse=false`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "hibp-api-key": process.env.BREACH_API_KEY,
        "user-agent": "BreachGuard-Student-Project",
      },
      signal: controller.signal,
    });

    // The provider returns 404 when the email was not found in any breach.
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

    const rawBreaches = await response.json();
    const breaches = mapProviderResponseToInternalShape(rawBreaches);

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
