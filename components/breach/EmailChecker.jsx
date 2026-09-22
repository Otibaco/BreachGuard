"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2, AlertCircle, Lock, EyeOff } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import { checkBreachAction } from "@/app/actions/breach";

export default function EmailChecker({ onResult, onStartCheck, isChecking }) {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState(null); // 'empty' | 'invalid' | null
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputError(null);
    setServerError("");

    const clean = email.trim();
    if (!clean) {
      setInputError("empty");
      return;
    }

    if (!isValidEmail(clean)) {
      setInputError("invalid");
      return;
    }

    if (onStartCheck) onStartCheck();

    const data = await checkBreachAction(clean);

    if (!data.success) {
      if (data.code === "RATE_LIMITED") {
        setServerError(data.message);
      } else if (data.code === "INVALID_EMAIL") {
        setInputError("invalid");
      } else {
        setServerError(data.message);
      }
      if (onResult) onResult(null);
      return;
    }

    if (onResult) onResult(data);

    setTimeout(() => {
      const resultEl = document.getElementById("breach-result-section");
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="email-checker">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex flex-col sm:flex-row items-stretch gap-2.5 bg-bg-input p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 shadow-2xl shadow-black/40 ${
            inputError
              ? "border-critical-high/70 ring-2 ring-critical-high/25"
              : "border-border-medium focus-within:border-brand-cyan/70 focus-within:ring-2 focus-within:ring-brand-cyan/20"
          }`}
        >
          <div className="relative flex-1 flex items-center">
            <input
              id="breach-email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (inputError) setInputError(null);
                if (serverError) setServerError("");
              }}
              placeholder="Enter your email address"
              autoComplete="email"
              spellCheck="false"
              disabled={isChecking}
              className={`w-full pl-4 pr-11 py-3 sm:py-3.5 text-base sm:text-lg bg-transparent border-none outline-none focus:ring-0 disabled:opacity-60 font-sans transition-colors ${
                inputError ? "text-critical-light placeholder-critical-light/40" : "text-text-primary placeholder-text-subtle"
              }`}
            />

            {inputError && (
              <div
                className="absolute right-3.5 flex items-center justify-center text-critical-high pointer-events-none"
                title={inputError === "empty" ? "Email address cannot be empty" : "Invalid email address format"}
                aria-label={inputError === "empty" ? "Email address cannot be empty" : "Invalid email address format"}
              >
                <AlertCircle className="w-5 h-5 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isChecking}
            className="focus-ring inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 text-base font-semibold text-white bg-brand-hover hover:bg-brand-dark active:bg-brand-primary disabled:bg-bg-elevated rounded-xl transition-all shadow-lg shadow-sky-950/40 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Check Email</span>
                <ArrowRight className="w-4 h-4 text-white/90" />
              </>
            )}
          </button>
        </div>

        {serverError && (
          <div className="mt-3 p-3 rounded-xl bg-critical-bg/80 border border-critical-border text-xs font-medium text-critical-text flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-critical-high" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-clean" />
            We never ask for your password
          </span>
          <span className="text-border-hover">&bull;</span>
          <span className="inline-flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5 text-clean" />
            Zero raw email logging
          </span>
        </div>
      </form>
    </div>
  );
}
