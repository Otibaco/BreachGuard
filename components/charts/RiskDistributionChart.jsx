"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
  LOW: "#10B981",
  MEDIUM: "#FBBF24",
  HIGH: "#EF4444",
  CRITICAL: "#DC2626",
};

export default function RiskDistributionChart({ distribution }) {
  const data = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    .map((level) => ({ name: level, value: distribution?.[level] || 0 }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-dim">
        No checks recorded yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0E1524",
            fontSize: 13,
            color: "#F8FAFC",
          }}
          itemStyle={{ color: "#F8FAFC" }}
        />
        <Legend
          verticalAlign="bottom"
          height={32}
          formatter={(value) => <span style={{ color: "#94A3B8", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
