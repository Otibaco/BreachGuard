import Link from "next/link";
import {
  ScanSearch,
  BarChart3,
  MessageSquare,
  GraduationCap,
  Lock,
  Database,
  Server,
  ArrowRight,
  Target,
  EyeOff,
  Layers,
  AlertTriangle,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";
import SplitSection from "@/components/public-page-components/SplitSection";
import Navbar from "@/components/public-page-components/Navbar";
import Footer from "@/components/public-page-components/Footer";

export const metadata = {
  title: "About — BreachGuard",
  description:
    "What BreachGuard is, how it works, its privacy and security principles, the technology behind it, and its limitations.",
};

const HOW_IT_WORKS = [
  {
    number: "01",
    icon: ScanSearch,
    title: "Breach lookup",
    body: "A submitted email is checked against known breach records through an authorized third-party breach-data API.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Risk assessment",
    body: "The returned breach information is normalized and evaluated using BreachGuard's risk-scoring model.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Risk communication",
    body: "The system presents a 0–100 score, risk level, exposed data categories, and relevant recommendations.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Cybersecurity awareness",
    body: "Users receive practical guidance covering topics such as password reuse, credential exposure, multi-factor authentication, and actions to take after a breach.",
  },
];

const PRIVACY_PRINCIPLES = [
  {
    icon: Lock,
    title: "Your password is never required.",
    body: "BreachGuard does not ask users to provide their passwords when performing an email breach check.",
  },
  {
    icon: Database,
    title: "Minimal logging",
    body: "The system is designed to store aggregate breach-check information rather than raw email addresses by default.",
  },
  {
    icon: Server,
    title: "Server-side API protection",
    body: "External breach API credentials are kept on the server. The browser never receives the breach API key.",
  },
];

const TECH_STACK = [
  { term: "Frontend", value: "Next.js App Router, TypeScript, Tailwind CSS" },
  { term: "Backend", value: "Next.js server-side functionality, controllers, services, and route handlers" },
  { term: "Database", value: "MongoDB with Mongoose" },
  { term: "Security", value: "bcrypt, authentication middleware, server-side validation, rate limiting" },
  { term: "Visualization", value: "Recharts and Framer Motion" },
  { term: "Breach Intelligence", value: "Authorized third-party breach-data API" },
];

const LIMITATIONS = [
  {
    title: "Breach data is not exhaustive",
    body: "BreachGuard depends on the coverage of its configured third-party breach-data provider. Not every breach may be represented in the available dataset.",
  },
  {
    title: "The risk score is an estimate",
    body: "The BreachGuard score is a heuristic designed to communicate exposure using breach frequency, recency, and data sensitivity. It is not a certified security assessment.",
  },
  {
    title: "No ownership verification",
    body: "BreachGuard does not verify that the person performing a lookup owns the email address. This is intentional because the public lookup does not require user authentication.",
  },
  {
    title: "No real-time monitoring",
    body: "BreachGuard does not continuously monitor an email address or send real-time breach alerts.",
  },
];

export default function AboutPage() {
  return (
    <>
    <Navbar />
      {/* Hero */}
      <section className="relative border-b border-border-subtle bg-gradient-to-b from-bg-hero-from via-bg-hero-via to-bg-canvas px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan font-mono mb-3">
            About
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            About BreachGuard
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-light">
            BreachGuard is an email breach detection, risk assessment, and
            cybersecurity awareness platform designed to help people
            understand whether their email address appears in known data
            breaches and what that exposure may mean.
          </p>
        </Reveal>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why BreachGuard */}
        <SplitSection
          id="why"
          index="Why BreachGuard"
          icon={Target}
          title="From detection to understanding"
          first
        >
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            Knowing that an email address has appeared in a breach is
            only part of the problem. BreachGuard combines breach lookup
            with an explainable risk score and practical cybersecurity
            recommendations to help users understand their exposure and
            take appropriate next steps.
          </p>
        </SplitSection>

        {/* How it works */}
        <SplitSection id="how-it-works" index="Process" icon={Layers} title="How BreachGuard works">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number}>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-brand-cyan">{step.number}</span>
                  <step.icon className="w-4 h-4 text-brand-cyan" strokeWidth={1.75} />
                  <p className="font-heading font-semibold text-text-primary">{step.title}</p>
                </div>
                <p className="mt-2 text-base leading-relaxed text-text-light">{step.body}</p>
              </div>
            ))}
          </div>
        </SplitSection>

        {/* Privacy by design */}
        <SplitSection id="privacy" index="Privacy" icon={EyeOff} title="Privacy by design">
          <div className="grid sm:grid-cols-3 gap-x-8 gap-y-8">
            {PRIVACY_PRINCIPLES.map((item) => (
              <div key={item.title}>
                <item.icon className="w-5 h-5 text-clean" strokeWidth={1.75} />
                <p className="mt-3 font-heading font-semibold text-text-primary leading-snug">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </SplitSection>

        {/* Security */}
        <SplitSection id="security" index="Security" icon={Lock} title="Security" subtitle="Built with defensive security practices">
          <p className="max-w-[65ch] text-base sm:text-lg leading-[1.8] text-text-light">
            BreachGuard incorporates practical security controls
            including input validation, rate limiting, secure
            administrator authentication, password hashing, protected
            administrative routes, controlled error handling, and
            protection of sensitive configuration values.
          </p>
        </SplitSection>

        {/* Technology */}
        <SplitSection id="technology" index="Stack" icon={Server} title="Technology">
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {TECH_STACK.map((row) => (
              <div key={row.term} className="border-b border-border-subtle pb-3">
                <dt className="text-sm font-semibold text-text-primary font-mono">{row.term}</dt>
                <dd className="mt-1 text-sm text-text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>
        </SplitSection>

        {/* Limitations */}
        <SplitSection id="limitations" index="Scope" icon={AlertTriangle} title="Limitations">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {LIMITATIONS.map((item) => (
              <div key={item.title} className="border-l-2 border-border-medium pl-5">
                <p className="font-heading font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1.5 text-base leading-relaxed text-text-light">{item.body}</p>
              </div>
            ))}
          </div>
        </SplitSection>
      </div>

      {/* Final CTA */}
      <Reveal className="border-t border-border-subtle px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
          Understand your exposure
        </h2>
        <p className="mt-3 text-base leading-relaxed text-text-light max-w-md mx-auto">
          Check an email address against known breach records and learn
          what your result means.
        </p>
        <Link
          href="/#email-checker"
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-hover px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Check your email
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>

      <Footer />
    </>
  );
}
