import { ShieldCheck } from "lucide-react";

export default function Logo({ size = "md" }) {
  const boxSize = size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "lg" ? 20 : 16;
  const textSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <span className="inline-flex items-center gap-2.5 group">
      <span
        className={`${boxSize} rounded-xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-cyan shadow-sm transition-transform group-hover:scale-105`}
      >
        <ShieldCheck size={iconSize} strokeWidth={2.2} />
      </span>
      <span className={`font-heading font-bold ${textSize} tracking-tight uppercase text-text-primary`}>
        Breach<span className="text-brand-cyan">Guard</span>
      </span>
    </span>
  );
}
