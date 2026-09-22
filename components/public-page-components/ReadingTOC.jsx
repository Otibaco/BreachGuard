"use client";

import { useEffect, useState } from "react";

export default function ReadingTOC({ items }) {
  const [activeId, setActiveId] = useState(items?.[0]?.id);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden xl:block">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-dim font-mono mb-4">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border-subtle">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block -ml-px border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                  active
                    ? "border-brand-cyan text-brand-cyan font-medium"
                    : "border-transparent text-text-dim hover:text-text-muted"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
