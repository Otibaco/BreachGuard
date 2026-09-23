export default function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-sm shadow-black/10 transition-all duration-200 hover:border-border-hover hover:-translate-y-0.5 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-text-muted">{label}</p>
        {Icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              accent ? "bg-critical-bg text-critical-light" : "bg-brand-primary/10 text-brand-cyan"
            }`}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <p
        className={`mt-4 font-heading text-2xl font-bold sm:text-3xl ${
          accent ? "text-critical-light" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
