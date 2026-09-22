import AdminHeader from "@/components/admin/AdminHeader";
import RefreshButton from "@/components/admin/RefreshButton";
import PaginationLinks from "@/components/admin/PaginationLinks";

const EVENT_LABELS = {
  failed_admin_login: "Failed admin login",
  rate_limit_exceeded: "Rate limit exceeded",
  invalid_breach_request: "Invalid breach-check request",
};

export default function SecurityEventsTable({ events, pagination }) {
  return (
    <div>
      <AdminHeader
        title="Security Events"
        description="Failed logins, rate-limit hits, and invalid requests. IPs are hashed."
        actions={<RefreshButton />}
      />

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-bg-surface text-text-dim">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Hashed IP</th>
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
                <td className="px-4 py-3 font-medium text-text-primary">
                  {EVENT_LABELS[event.type] || event.type}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(event.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-dim">
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
