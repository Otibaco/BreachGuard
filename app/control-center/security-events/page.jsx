import { getSecurityEvents } from "@/controllers/securityEventController";
import AdminShell from "@/components/admin/AdminShell";
import SecurityEventsTable from "@/components/admin/SecurityEventsTable";

export const metadata = {
  title: "Security Events — BreachGuard Control Center",
};

export const dynamic = "force-dynamic";

export default async function SecurityEventsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { events, pagination } = await getSecurityEvents({ page, limit: 25 });

  return (
    <AdminShell>
      <SecurityEventsTable events={events} pagination={pagination} />
    </AdminShell>
  );
}
