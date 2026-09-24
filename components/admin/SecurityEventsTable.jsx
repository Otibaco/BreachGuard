import AdminHeader from "@/components/admin/AdminHeader";
import RefreshButton from "@/components/admin/RefreshButton";
import PaginationLinks from "@/components/admin/PaginationLinks";

const EVENT_LABELS = {
  failed_admin_login: "Failed admin login",
  rate_limit_exceeded: "Rate limit exceeded",
  invalid_breach_request: "Invalid breach-check request",
  breach_api_error: "Breach API error",
};

export default function SecurityEventsTable({ events, pagination }) {
  return (
    <div>
      <AdminHeader
        title="Security Events"
        description="Failed logins, rate-limit hits, and invalid requests. IPs are hashed."
        actions={<RefreshButton />}
      />

      <div className="max-h-[420px] overflow-auto rounded-2xl border border-border-subtle bg-bg-card">
        <table className="min-w-[560px] w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border-subtle bg-bg-surface text-text-dim">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Event</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Hashed IP</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-dim">
                  No security events recorded yet.
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event._id.toString()} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                  {EVENT_LABELS[event.type] || event.type}
                </td>
                <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                  {new Date(event.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-dim whitespace-nowrap">
                  {event.ipHash?.slice(0, 16)}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationLinks basePath="/control-center/security-events" pagination={pagination} />
    </div>
  );
}
