export default function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 transition-colors hover:border-border-hover">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{label}</p>
        {Icon && (
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              accent ? "bg-critical-bg text-critical-light" : "bg-brand-primary/10 text-brand-cyan"
            }`}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <p
        className={`mt-3 font-heading text-3xl font-bold ${
          accent ? "text-critical-light" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
