"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/**
 * Re-fetches this page's server-rendered data via router.refresh(),
 * without a full page reload - the modern App Router equivalent of the
 * reference project's manual "Refresh" button.
 */
export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border-medium bg-bg-card px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-brand-primary/40 hover:text-text-primary disabled:opacity-60"
    >
      <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
      Refresh
    </button>
  );
}
