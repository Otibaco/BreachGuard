import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationLinks({ basePath, pagination, extraParams = "" }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;
  const suffix = extraParams ? `&${extraParams}` : "";
  const prevHref = `${basePath}?page=${page - 1}${suffix}`;
  const nextHref = `${basePath}?page=${page + 1}${suffix}`;

  return (
    <div className="flex items-center justify-between text-sm text-text-muted mt-4">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={prevHref}
            className="focus-ring inline-flex items-center gap-1 rounded-lg border border-border-medium bg-bg-card px-3 py-1.5 hover:border-brand-primary/40"
          >
            <ChevronLeft size={14} /> Prev
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-bg-card px-3 py-1.5 opacity-40">
            <ChevronLeft size={14} /> Prev
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={nextHref}
            className="focus-ring inline-flex items-center gap-1 rounded-lg border border-border-medium bg-bg-card px-3 py-1.5 hover:border-brand-primary/40"
          >
            Next <ChevronRight size={14} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-bg-card px-3 py-1.5 opacity-40">
            Next <ChevronRight size={14} />
          </span>
        )}
      </div>
    </div>
  );
}
