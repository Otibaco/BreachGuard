import { ListChecks, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import RefreshButton from "@/components/admin/RefreshButton";
import StatCard from "@/components/admin/StatCard";
import ChecksTrendChart from "@/components/charts/ChecksTrendChart";
import RiskDistributionChart from "@/components/charts/RiskDistributionChart";

export default function DashboardOverview({ statistics }) {
  const { totals, riskDistribution, checksOverTime } = statistics;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Overview"
        description="Aggregate breach-check activity, updated live."
        actions={<RefreshButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Checks" value={totals.totalChecks} icon={ListChecks} />
        <StatCard label="Breached" value={totals.breached} icon={ShieldAlert} accent />
        <StatCard label="Clean" value={totals.clean} icon={ShieldCheck} />
        <StatCard label="High Risk" value={totals.highRisk} icon={TrendingUp} accent />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-sm shadow-black/10 sm:p-5 lg:p-6">
          <h2 className="text-sm font-semibold text-text-secondary font-heading">
            Checks over time (14 days)
          </h2>
          <div className="mt-4 h-[260px] w-full overflow-hidden">
            <ChecksTrendChart data={checksOverTime} />
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-sm shadow-black/10 sm:p-5 lg:p-6">
          <h2 className="text-sm font-semibold text-text-secondary font-heading">
            Risk distribution
          </h2>
          <div className="mt-4 h-[260px] w-full overflow-hidden">
            <RiskDistributionChart distribution={riskDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
