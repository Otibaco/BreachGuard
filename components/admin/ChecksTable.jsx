import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import RefreshButton from "@/components/admin/RefreshButton";
import PaginationLinks from "@/components/admin/PaginationLinks";

const STATUS_STYLES = {
  breached: "text-critical-light",
  clean: "text-clean-light",
};

const RISK_STYLES = {
  LOW: "text-clean-light",
  MEDIUM: "text-warning",
  HIGH: "text-critical-light",
  CRITICAL: "text-critical-text",
};

const TABS = [
  { key: "all", label: "All", status: undefined },
  { key: "breached", label: "Breached", status: "breached" },
  { key: "clean", label: "Clean", status: "clean" },
];

export default function ChecksTable({ checks, pagination, currentStatus, counts }) {
  const activeKey = currentStatus || "all";

  return (
    <div>
      <AdminHeader
        title="Recent Breach Checks"
        description="Aggregate results only. Raw email addresses are never stored."
        actions={<RefreshButton />}
      />

      <div className="mb-5 overflow-x-auto border-b border-border-subtle">
        <div className="flex min-w-max items-center gap-1 pb-1">
          {TABS.map((tab) => {
            const active = tab.key === activeKey;
            const count =
              tab.key === "all" ? counts.total : tab.key === "breached" ? counts.breached : counts.clean;
            const href = tab.status ? `/control-center/checks?status=${tab.status}` : "/control-center/checks";

            return (
              <Link
                key={tab.key}
                href={href}
                className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
                  active
                    ? "border-brand-cyan text-brand-cyan"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label} <span className="font-mono text-[10px] text-text-dim sm:text-xs">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto rounded-2xl border border-border-subtle bg-bg-card">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border-subtle bg-bg-surface text-text-dim">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Risk Level</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Breach Count</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {checks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-dim">
                  No checks recorded yet.
                </td>
              </tr>
            )}
            {checks.map((check) => (
              <tr key={check._id.toString()} className="border-b border-border-subtle last:border-0">
                <td className={`px-4 py-3 font-semibold font-mono text-xs uppercase whitespace-nowrap ${STATUS_STYLES[check.status]}`}>
                  {check.status}
                </td>
                <td className={`px-4 py-3 font-medium whitespace-nowrap ${RISK_STYLES[check.riskLevel]}`}>
                  {check.riskLevel}
                </td>
                <td className="px-4 py-3 text-text-muted whitespace-nowrap">{check.breachCount}</td>
                <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                  {new Date(check.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationLinks
        basePath="/control-center/checks"
        pagination={pagination}
        extraParams={currentStatus ? `status=${currentStatus}` : ""}
      />
    </div>
  );
}
