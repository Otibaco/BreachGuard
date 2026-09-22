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
    <div className="sticky top-16 z-30 border-b border-border-subtle bg-bg-canvas/95 backdrop-blur-md">
      <nav
        aria-label="On this page"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex items-center gap-1 py-3 text-sm whitespace-nowrap">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`inline-block rounded-full px-3.5 py-1.5 transition-colors ${
                    active
                      ? "bg-brand-primary/15 text-brand-cyan font-medium"
                      : "text-text-muted hover:text-text-secondary"
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
