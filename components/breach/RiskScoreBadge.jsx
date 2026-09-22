const CONFIGS = {
  LOW: {
    label: "LOW RISK",
    bg: "bg-clean-bg/50",
    text: "text-clean-accent",
    border: "border-clean-border/50",
    dot: "bg-clean",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    bg: "bg-warning-bg/50",
    text: "text-warning",
    border: "border-warning-border/50",
    dot: "bg-warning-amber",
  },
  HIGH: {
    label: "HIGH RISK",
    bg: "bg-critical-bg/60",
    text: "text-critical-light",
    border: "border-critical/50",
    dot: "bg-critical-high",
  },
  CRITICAL: {
    label: "CRITICAL RISK",
    bg: "bg-critical-bg/80",
    text: "text-critical-text",
    border: "border-critical/70",
    dot: "bg-critical",
  },
};

export default function RiskScoreBadge({ level, size = "md" }) {
  const current = CONFIGS[level] || CONFIGS.LOW;
  const sizeClasses =
    size === "lg" ? "px-3.5 py-1.5 text-xs font-bold" : "px-2.5 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} uppercase tracking-wider font-mono`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      {current.label}
    </span>
  );
}
