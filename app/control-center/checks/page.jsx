import { getChecks, getStatistics } from "@/controllers/adminController";
import AdminShell from "@/components/admin/AdminShell";
import ChecksTable from "@/components/admin/ChecksTable";

export const metadata = {
  title: "Checks — BreachGuard Control Center",
};

export const dynamic = "force-dynamic";

export default async function ChecksPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const status = params?.status === "breached" || params?.status === "clean"
    ? params.status
    : undefined;

  const [{ checks, pagination }, statistics] = await Promise.all([
    getChecks({ page, limit: 20, status }),
    getStatistics(),
  ]);

  const counts = {
    total: statistics.totals.totalChecks,
    breached: statistics.totals.breached,
    clean: statistics.totals.clean,
  };

  return (
    <AdminShell>
      <ChecksTable
        checks={checks}
        pagination={pagination}
        currentStatus={status}
        counts={counts}
      />
    </AdminShell>
  );
}
