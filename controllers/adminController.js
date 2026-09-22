import connectToDatabase from "@/lib/connectDB";
import BreachCheck from "@/models/BreachCheck";

/**
 * getStatistics()
 *
 * Aggregate dashboard numbers, computed live from MongoDB - never hardcoded.
 */
export async function getStatistics() {
  await connectToDatabase();

  const [totals, riskDistribution, checksOverTime] = await Promise.all([
    getTotals(),
    getRiskDistribution(),
    getChecksOverTime(),
  ]);

  return { totals, riskDistribution, checksOverTime };
}

async function getTotals() {
  const [totalChecks, breached, clean, highRisk] = await Promise.all([
    BreachCheck.countDocuments({}),
    BreachCheck.countDocuments({ status: "breached" }),
    BreachCheck.countDocuments({ status: "clean" }),
    BreachCheck.countDocuments({ riskLevel: { $in: ["HIGH", "CRITICAL"] } }),
  ]);

  return { totalChecks, breached, clean, highRisk };
}

async function getRiskDistribution() {
  const results = await BreachCheck.aggregate([
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
  ]);

  const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  for (const row of results) {
    if (row._id in distribution) distribution[row._id] = row.count;
  }
  return distribution;
}

async function getChecksOverTime() {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const results = await BreachCheck.aggregate([
    { $match: { createdAt: { $gte: fourteenDaysAgo } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const byDate = new Map();
  for (const row of results) {
    const date = row._id.date;
    if (!byDate.has(date)) byDate.set(date, { date, breached: 0, clean: 0 });
    const entry = byDate.get(date);
    if (row._id.status === "breached") entry.breached = row.count;
    else if (row._id.status === "clean") entry.clean = row.count;
  }

  return Array.from(byDate.values());
}

/**
 * getChecks()
 *
 * Paginated list of recent aggregate checks. Never includes raw emails,
 * because none are stored. Pass `status: "breached" | "clean"` to filter.
 */
export async function getChecks({ page = 1, limit = 20, status } = {}) {
  await connectToDatabase();

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const filter = status === "breached" || status === "clean" ? { status } : {};

  const [checks, total] = await Promise.all([
    BreachCheck.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    BreachCheck.countDocuments(filter),
  ]);

  return {
    checks,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}
