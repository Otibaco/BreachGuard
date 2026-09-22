"use client";

import { useEffect, useState } from "react";

/**
 * A horizontal, sticky "jump to" bar for long-form pages - sits just
 * below the main navbar and highlights the section currently in view.
 * This replaces a sidebar TOC so the content itself can use the full
 * page width instead of being squeezed into a narrow leftover column.
 */
export default function SectionNav({ items }) {
  const [activeId, setActiveId] = useState(items?.[0]?.id);

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="sticky top-[72px] z-30 border-b border-border-subtle bg-bg-canvas/90 backdrop-blur-xl">
      <nav
        aria-label="On this page"
        className="mx-auto max-w-6xl overflow-x-auto px-3 py-2.5 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex min-w-max items-center gap-2 text-sm whitespace-nowrap">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`flex items-center rounded-full border px-3 py-2 text-[11px] font-medium tracking-[0.08em] uppercase transition-all duration-200 sm:px-3.5 sm:text-xs ${
                    active
                      ? "border-brand-primary/30 bg-brand-primary/12 text-brand-cyan shadow-[0_0_18px_rgba(56,189,248,0.15)]"
                      : "border-white/5 bg-white/[0.02] text-text-muted hover:border-white/10 hover:bg-white/[0.04] hover:text-text-secondary"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
