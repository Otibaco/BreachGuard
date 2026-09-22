import Reveal from "@/components/ui/reveal";

/**
 * The core layout building block for /learn and /about: a sticky label
 * column (index + icon + heading) on the left, and a wider content
 * column on the right. This is what keeps long-form pages from reading
 * as one cramped narrow strip of text down the middle of the screen.
 */
export default function SplitSection({
  id,
  index,
  icon: Icon,
  title,
  subtitle,
  first = false,
  children,
}) {
  return (
    <Reveal
      as="section"
      id={id}
      className={`scroll-mt-32 grid gap-6 lg:grid-cols-12 lg:gap-12 py-12 sm:py-14 ${
        first ? "" : "border-t border-border-subtle"
      }`}
    >
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          {index && (
            <p className="font-mono text-xs text-text-dim mb-3">{index}</p>
          )}
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/25 text-brand-cyan">
                <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
              </span>
            )}
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary leading-snug">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="mt-2 text-sm font-mono text-text-dim">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-8 space-y-4">{children}</div>
    </Reveal>
  );
}
