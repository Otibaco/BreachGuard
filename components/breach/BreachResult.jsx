"use client";

import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Users,
  Globe,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import RiskScoreBadge from "@/components/breach/RiskScoreBadge";
import CelebrationPetals from "@/components/breach/CelebrationPetals";
import { formatDate } from "@/lib/utils";

const PRIORITY_STYLES = {
  urgent: {
    border: "border-l-critical-high",
    icon: AlertTriangle,
    iconColor: "text-critical-high",
    label: "Urgent",
    labelColor: "text-critical-light",
  },
  recommended: {
    border: "border-l-warning-amber",
    icon: Info,
    iconColor: "text-warning-amber",
    label: "Recommended",
    labelColor: "text-warning",
  },
  "good-practice": {
    border: "border-l-clean",
    icon: CheckCircle2,
    iconColor: "text-clean",
    label: "Good practice",
    labelColor: "text-clean-light",
  },
};

const BREAKDOWN_LABELS = [
  { key: "frequency", label: "Frequency", max: 40 },
  { key: "recency", label: "Recency", max: 30 },
  { key: "sensitivity", label: "Data sensitivity", max: 30 },
];

export default function BreachResult({ email, result }) {
  const {
    found,
    breachCount,
    breaches,
    exposedDataClasses,
    riskScore,
    riskLevel,
    riskBreakdown,
    recommendations,
  } = result;

  return (
    <div id="breach-result-section" className="w-full max-w-3xl mx-auto scroll-mt-24">
      <CelebrationPetals trigger={!found} />

      {/* Status header */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 mb-6 ${
          found
            ? "bg-critical-bg/40 border-critical-border/60"
            : "bg-clean-surface/60 border-clean-border/40"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
              found ? "bg-critical-bg text-critical-light" : "bg-clean-bg text-clean-light"
            }`}
          >
            {found ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-widest font-mono ${
                found ? "text-critical-light" : "text-clean-light"
              }`}
            >
              {found ? "Breach detected" : "No known breaches"}
            </p>
            <h2 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-text-primary break-all">
              {email}
            </h2>
            <p className="mt-1.5 text-sm text-text-muted">
              {found
                ? `Found in ${breachCount} known ${breachCount === 1 ? "breach" : "breaches"}.`
                : "This address was not found in the breach sources checked."}
            </p>
          </div>
          <div className="sm:ml-auto">
            <RiskScoreBadge level={riskLevel} size="lg" />
          </div>
        </div>
      </div>

      {/* Risk score */}
      <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="font-heading text-6xl font-bold text-text-primary">{riskScore}</span>
            <span className="text-text-subtle text-lg">/ 100</span>
          </div>

          <div className="flex-1 space-y-3 w-full">
            {BREAKDOWN_LABELS.map(({ key, label, max }) => {
              const value = riskBreakdown?.[key] ?? 0;
              const pct = Math.min(100, Math.round((value / max) * 100));
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-muted">{label}</span>
                    <span className="font-mono text-text-subtle">
                      {value}/{max}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-cyan transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exposed data classes */}
      {exposedDataClasses?.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 sm:p-8 mb-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-text-secondary mb-4">
            Exposed information
          </h3>
          <div className="flex flex-wrap gap-2">
            {exposedDataClasses.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg-elevated border border-border-medium text-text-light"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breach history */}
      {breaches?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-text-secondary mb-4 px-1">
            Breach history
          </h3>
          <div className="space-y-3">
            {breaches.map((breach, index) => (
              <div
                key={`${breach.name}-${index}`}
                className="rounded-2xl border border-border-subtle bg-bg-card p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-bold text-text-primary">{breach.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-subtle font-mono">
                      {breach.domain && (
                        <span className="inline-flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          {breach.domain}
                        </span>
                      )}
                      {breach.breachDate && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(breach.breachDate)}
                        </span>
                      )}
                      {breach.pwnCount > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          {breach.pwnCount.toLocaleString()} accounts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {breach.description && (
                  <p className="mt-3 text-sm text-text-muted leading-relaxed">
                    {breach.description}
                  </p>
                )}

                {breach.dataClasses?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {breach.dataClasses.map((type) => (
                      <span
                        key={type}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-bg-canvas border border-border-subtle text-text-muted"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-text-secondary mb-4 px-1">
          Recommendations
        </h3>
        <div className="space-y-2.5">
          {recommendations.map((rec) => {
            const style = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES["good-practice"];
            const Icon = style.icon;
            return (
              <div
                key={rec.id}
                className={`rounded-xl border border-border-subtle border-l-4 ${style.border} bg-bg-card p-4 flex gap-3`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${style.iconColor}`} />
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    {rec.title}
                    <span className={`text-[10px] font-mono uppercase tracking-wide ${style.labelColor}`}>
                      {style.label}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm text-text-muted">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-text-dim text-center px-4">
        This is an educational, heuristic risk assessment, not a certified
        security assessment. Coverage depends on the breach data provider
        and is not guaranteed to include every breach.
      </p>
    </div>
  );
}
