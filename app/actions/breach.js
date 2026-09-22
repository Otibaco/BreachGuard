"use server";

import { headers } from "next/headers";
import {
  checkBreach,
  ValidationError,
  RateLimitError,
} from "@/controllers/breachController";
import { BreachApiError } from "@/services/breachApiService";
import { getClientIp, hashValue } from "@/lib/utils";

/**
 * checkBreachAction()
 *
 * The public breach check, called directly from the EmailChecker client
 * component as a plain async function - not through a <form>, and not
 * through a public API route. This is the "server action as controller"
 * pattern: the request never leaves the server boundary until a
 * sanitized result comes back, so there's nothing here for an outside
 * caller to probe or replay independently of this app's own UI.
 *
 * Deliberately never throws - every expected failure (bad input, rate
 * limit, provider down) comes back as a discriminated result the client
 * can render directly, instead of a generic serialized Error.
 */
export async function checkBreachAction(rawEmail) {
  const ipHash = hashValue(getClientIp(headers()));

  try {
    const result = await checkBreach({ rawEmail, ipHash });
    return result;
  } catch (err) {
    if (err instanceof ValidationError) {
      return { success: false, code: "INVALID_EMAIL", message: err.message };
    }

    if (err instanceof RateLimitError) {
      return { success: false, code: "RATE_LIMITED", message: err.message };
    }

    if (err instanceof BreachApiError) {
      const message =
        err.code === "BREACH_API_NOT_CONFIGURED"
          ? "The breach data provider hasn't been configured yet. Add BREACH_API_URL and BREACH_API_KEY to your environment."
          : "We couldn't complete the breach check right now. Please try again shortly.";

      return { success: false, code: err.code, message };
    }

    return {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    };
  }
}
