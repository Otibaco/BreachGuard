import connectToDatabase from "@/lib/connectDB";
import SecurityEvent from "@/models/SecurityEvent";

/**
 * Logs a security event. Never stores raw credentials. IPs must already
 * be hashed by the caller before reaching this function.
 */
export async function logSecurityEvent({ type, ipHash, metadata = {} }) {
  try {
    await connectToDatabase();
    await SecurityEvent.create({ type, ipHash, metadata });
  } catch {
    // Logging must never break the primary request flow.
  }
}

export async function getSecurityEvents({ page = 1, limit = 25 } = {}) {
  try {
    await connectToDatabase();

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 25));
    const skip = (safePage - 1) * safeLimit;

    const [events, total] = await Promise.all([
      SecurityEvent.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      SecurityEvent.countDocuments({}),
    ]);

    return {
      events,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    };
  } catch (error) {
    console.error("Security events unavailable because MongoDB is unreachable:", error?.message || error);
    return {
      events: [],
      pagination: {
        page: 1,
        limit: Math.min(100, Math.max(1, Number(limit) || 25)),
        total: 0,
        totalPages: 1,
      },
    };
  }
}
