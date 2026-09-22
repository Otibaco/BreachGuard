import { getChecks, getStatistics } from "@/controllers/adminController";
import AdminShell from "@/components/admin/AdminShell";
import ChecksTable from "@/components/admin/ChecksTable";

export const metadata = {
  title: "Checks — BreachGuard Control Center",
};

export const dynamic = "force-dynamic";

export default async function ChecksPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const status = searchParams?.status === "breached" || searchParams?.status === "clean"
    ? searchParams.status
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
