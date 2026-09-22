import Link from "next/link";
import { Repeat, KeyRound, Fingerprint, ListChecks, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/reveal";

const topics = [
  {
    icon: Repeat,
    title: "Password reuse",
    description:
      "Using the same password across multiple accounts can allow one exposed password to put several accounts at risk.",
    href: "/learn#password-reuse",
  },
  {
    icon: KeyRound,
    title: "Multi-factor authentication",
    description: "Add another layer of protection to your accounts, even if your password is exposed.",
    href: "/learn#mfa",
  },
  {
    icon: Fingerprint,
    title: "Credential exposure",
    description:
      "Understand what it means when your email, username, password, or other information appears in a breach.",
    href: "/learn#credential-exposure",
  },
  {
    icon: ListChecks,
    title: "After a breach",
    description: "Learn the practical steps to take when your information has been exposed.",
    href: "/learn#after-a-breach",
  },
];

export default function SecurityTopics() {
  return (
    <section className="border-t border-border-subtle bg-bg-canvas py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan font-mono mb-2">
            Stay protected
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
            Know what to do after a breach.
          </h2>
          <p className="mt-3 text-text-muted leading-relaxed">
            Finding your email in a breach is only the first step. Learn
            how credential exposure, password reuse, and multi-factor
            authentication affect your security — and what you can do to
            reduce your risk.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, index) => (
            <Reveal key={topic.title} delay={index * 0.06}>
              <Link
                href={topic.href}
                className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-card p-6 hover:border-brand-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-cyan">
                  <topic.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-heading font-semibold text-text-primary group-hover:text-brand-cyan transition-colors">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted flex-1">
                  {topic.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan">
                  Read more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/learn"
            className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-brand-cyan hover:text-brand-primary transition-colors"
          >
            Learn more about staying secure
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
