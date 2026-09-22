import { getStatistics } from "@/controllers/adminController";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata = {
  title: "Overview — BreachGuard Control Center",
};

// Auth is enforced once, centrally, by the root middleware.js - this page
// assumes it only ever renders for an authenticated admin.
export const dynamic = "force-dynamic";

export default async function ControlCenterPage() {
  const statistics = await getStatistics();

  return (
    <AdminShell>
      <DashboardOverview statistics={statistics} />
    </AdminShell>
  );
}
