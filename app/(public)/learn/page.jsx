import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Repeat,
  Fingerprint,
  ShieldCheck,
  Ban,
  ArrowRight,
  DatabaseZap,
  ListOrdered,
  Gauge,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";
import SectionNav from "@/components/public-page-components/SectionNav";
import SplitSection from "@/components/public-page-components/SplitSection";
import Navbar from "@/components/public-page-components/Navbar";
import Footer from "@/components/public-page-components/Footer";

export const metadata = {
  title: "Learn — BreachGuard",
  description:
    "Understand data breaches, credential exposure, password reuse, multi-factor authentication, and what to do after a breach.",
};

const NAV_ITEMS = [
  { id: "what-is-a-breach", label: "Data breach" },
  { id: "credential-exposure", label: "Credential exposure" },
  { id: "password-reuse", label: "Password reuse" },
  { id: "mfa", label: "Multi-factor auth" },
  { id: "after-a-breach", label: "After a breach" },
  { id: "risk-score", label: "Risk score" },
  { id: "clean-result", label: "Clean results" },
  { id: "not-do", label: "What we don't do" },
];

const RISK_LEVELS = [
  { range: "0–29", label: "LOW", color: "bg-clean" },
  { range: "30–59", label: "MEDIUM", color: "bg-warning-amber" },
  { range: "60–79", label: "HIGH", color: "bg-critical-high" },
  { range: "80–100", label: "CRITICAL", color: "bg-critical" },
];

const RECOVERY_STEPS = [
  {
    title: "Change affected passwords",
    body: "Change passwords associated with affected accounts, especially if the exposed information includes passwords.",
  },
  {
    title: "Stop reusing passwords",
    body: "If the same password is used elsewhere, change it on those accounts too.",
  },
  {
    title: "Enable MFA",
    body: "Turn on multi-factor authentication for important accounts where available.",
  },
  {
    title: "Review your accounts",
    body: "Look for unusual activity, unfamiliar login attempts, or unexpected account changes.",
  },
  {
    title: "Stay alert",
    body: "Be cautious of suspicious emails, messages, and links that may attempt to take advantage of exposed information.",
  },
];

export default function LearnPage() {
  return (
    <>
    <Navbar />
      {/* Hero */}
      <section className="relative border-b border-border-subtle bg-gradient-to-b from-bg-hero-from via-bg-hero-via to-bg-canvas px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan font-mono mb-3">
            Learn
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            Learn about your digital security
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-light">
            Understanding what happens after a data breach can help you
            make better decisions about your accounts, passwords, and
            personal information.
          </p>
        </Reveal>
      </section>

      <SectionNav items={NAV_ITEMS} />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SplitSection
          id="what-is-a-breach"
          index="01"
          icon={DatabaseZap}
          title="What is a data breach?"
          first
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            A data breach occurs when information held by an organization
            is accessed, exposed, or disclosed without authorization.
            Depending on the incident, exposed information may include
            email addresses, usernames, passwords, or other personal
            data.
          </p>
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            BreachGuard checks whether an email address appears in known
            breach records provided by its configured breach-data source.
          </p>

          <div className="flex gap-3 rounded-xl border-l-4 border-warning-amber bg-warning-bg/25 px-5 py-4">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-warning-amber" />
            <p className="text-sm sm:text-base leading-relaxed text-text-light">
              <span className="font-semibold text-warning">Important:</span>{" "}
              A result depends on the coverage of the breach-data
              provider. A clean result does not guarantee that an email
              has never appeared in a breach.
            </p>
          </div>
        </SplitSection>

        <SplitSection
          id="credential-exposure"
          index="02"
          icon={Fingerprint}
          title="What does credential exposure mean?"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            Credential exposure means that account-related information,
            such as an email address, username, or password, has
            appeared in exposed data associated with a breach.
          </p>
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            The type of information exposed matters. An exposed email
            address and an exposed password do not present the same
            level of risk.
          </p>
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            This is why BreachGuard considers data sensitivity when
            calculating its risk score.
          </p>
        </SplitSection>

        <SplitSection
          id="password-reuse"
          index="03"
          icon={Repeat}
          title="Why is password reuse dangerous?"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            Reusing the same password across multiple services creates a
            connection between your accounts. If that password is
            exposed in one breach, attackers may attempt to use it on
            other services.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
            <p className="sm:col-span-2 text-xs font-bold uppercase tracking-widest text-text-dim font-mono">
              What to do
            </p>
            {[
              "Use a different password for every important account.",
              "Change passwords that may have been exposed.",
              "Avoid using previously exposed passwords.",
              "Consider using a reputable password manager.",
            ].map((tip) => (
              <div key={tip} className="flex gap-3 text-base leading-relaxed text-text-light">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-clean" />
                {tip}
              </div>
            ))}
          </div>
        </SplitSection>

        <SplitSection
          id="mfa"
          index="04"
          icon={KeyRound}
          title="What is multi-factor authentication?"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            Multi-factor authentication (MFA) adds another verification
            step when signing in to an account. Instead of relying only
            on a password, the account may require an additional factor
            such as an authentication app, security key, or another
            supported verification method.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 border-t border-border-subtle pt-6 mt-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-dim font-mono">
                Why it matters
              </p>
              <p className="mt-2 text-base leading-relaxed text-text-light">
                MFA can provide additional protection when a password has
                been compromised.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-dim font-mono">
                What to do
              </p>
              <p className="mt-2 text-base leading-relaxed text-text-light">
                Enable MFA on important accounts whenever the service
                supports it.
              </p>
            </div>
          </div>
        </SplitSection>

        <SplitSection
          id="after-a-breach"
          index="05"
          icon={ListOrdered}
          title="What should you do after a breach?"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            If your email appears in a known breach:
          </p>

          <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
            {RECOVERY_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-border-medium bg-bg-card font-mono text-sm text-brand-cyan">
                  {index + 1}
                </span>
                <div>
                  <p className="font-heading font-semibold text-text-primary">{step.title}</p>
                  <p className="mt-1 text-base leading-relaxed text-text-light">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </SplitSection>

        <SplitSection
          id="risk-score"
          index="06"
          icon={Gauge}
          title="Understanding your BreachGuard risk score"
          subtitle="0 – 100"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            BreachGuard uses a transparent 0–100 heuristic score. The
            score considers three factors:
          </p>

          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle border-y border-border-subtle">
            {[
              { title: "Breach frequency", body: "How many known breaches contain the email." },
              { title: "Recency", body: "How recently the most relevant breach occurred." },
              { title: "Data sensitivity", body: "What types of information were exposed." },
            ].map((factor) => (
              <div key={factor.title} className="py-5 sm:px-6 sm:first:pl-0">
                <p className="font-heading font-semibold text-text-primary">{factor.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{factor.body}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8 pt-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-dim font-mono mb-3">
                Risk levels
              </p>
              <div className="divide-y divide-border-subtle border-y border-border-subtle">
                {RISK_LEVELS.map((level) => (
                  <div key={level.label} className="flex items-center gap-3 py-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${level.color}`} />
                    <span className="font-mono text-sm text-text-muted w-16 shrink-0">
                      {level.range}
                    </span>
                    <span className="font-heading text-sm font-semibold text-text-primary tracking-wide">
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-base leading-relaxed text-text-muted self-end">
              The BreachGuard score is an educational heuristic designed
              to communicate relative exposure. It is not a certified
              security assessment.
            </p>
          </div>
        </SplitSection>

        <SplitSection
          id="clean-result"
          index="07"
          icon={ShieldCheck}
          title="What a clean result means"
          subtitle="No known breach found"
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            If BreachGuard does not find your email in the breach records
            checked, it means no matching record was found in the
            available breach-data source.
          </p>
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            It does not guarantee that your email has never been
            exposed.
          </p>

          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-text-dim font-mono mb-3">
              Continue to:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {[
                "use unique passwords",
                "enable MFA",
                "avoid password reuse",
                "monitor important accounts",
              ].map((tip) => (
                <li key={tip} className="flex gap-2.5 text-base text-text-light">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-clean" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </SplitSection>

        <SplitSection id="not-do" index="08" icon={Ban} title="What BreachGuard does not do">
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            BreachGuard is designed for breach awareness and risk
            communication. It does not continuously monitor accounts or
            provide real-time breach alerts.
          </p>
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            It does not ask users for passwords and does not require an
            account to perform a lookup.
          </p>

          <div className="pt-4">
            <Link
              href="/#email-checker"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-hover px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Check your email
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SplitSection>
      </div>
      <Footer />
    </>
  );
}
