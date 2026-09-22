"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function ChecksTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-dim">
        No checks recorded in the last 14 days.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0E1524",
            fontSize: 13,
            color: "#F8FAFC",
          }}
          labelStyle={{ color: "#94A3B8" }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Legend
          formatter={(value) => <span style={{ color: "#94A3B8", fontSize: 12 }}>{value}</span>}
        />
        <Bar dataKey="clean" stackId="checks" name="Clean" fill="#10B981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="breached" stackId="checks" name="Breached" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
