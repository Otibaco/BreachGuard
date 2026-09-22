import { ListChecks, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import RefreshButton from "@/components/admin/RefreshButton";
import StatCard from "@/components/admin/StatCard";
import ChecksTrendChart from "@/components/charts/ChecksTrendChart";
import RiskDistributionChart from "@/components/charts/RiskDistributionChart";

export default function DashboardOverview({ statistics }) {
  const { totals, riskDistribution, checksOverTime } = statistics;

  return (
    <div>
      <AdminHeader
        title="Overview"
        description="Aggregate breach-check activity, updated live."
        actions={<RefreshButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Checks" value={totals.totalChecks} icon={ListChecks} />
        <StatCard label="Breached" value={totals.breached} icon={ShieldAlert} accent />
        <StatCard label="Clean" value={totals.clean} icon={ShieldCheck} />
        <StatCard label="High Risk" value={totals.highRisk} icon={TrendingUp} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-text-secondary font-heading">
            Checks over time (14 days)
          </h2>
          <div className="mt-4">
            <ChecksTrendChart data={checksOverTime} />
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-text-secondary font-heading">
            Risk distribution
          </h2>
          <div className="mt-4">
            <RiskDistributionChart distribution={riskDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
