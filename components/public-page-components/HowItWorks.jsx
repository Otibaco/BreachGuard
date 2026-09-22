import { ScanSearch, ShieldAlert, BarChart3, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    title: "Enter your email",
    description: "Submit an email address through a validated, rate-limited request. No account required.",
  },
  {
    icon: ShieldAlert,
    title: "We check known breaches",
    description: "Your email is checked server-side against a breach-data provider - never in your browser.",
  },
  {
    icon: BarChart3,
    title: "See your risk score",
    description: "A transparent 0-100 score built from breach frequency, recency, and data sensitivity.",
  },
  {
    icon: ShieldCheck,
    title: "Get a clear next step",
    description: "Plain-language recommendations tailored to exactly what was exposed.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-border-subtle bg-bg-surface py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan font-mono mb-2">
            Process
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
            How it works
          </h2>
          <p className="mt-2 text-text-muted">
            A simple, transparent process built around one goal: helping you
            understand your exposure.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border-subtle bg-bg-card p-6 hover:border-brand-primary/40 transition-colors"
            >
              <span className="absolute top-4 right-5 font-heading text-4xl font-bold text-white/[0.04]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-cyan">
                <step.icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="relative mt-4 font-heading font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
