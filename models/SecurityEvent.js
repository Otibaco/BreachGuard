import mongoose from "mongoose";

const SecurityEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "failed_admin_login",
        "rate_limit_exceeded",
        "invalid_breach_request",
      ],
      required: true,
    },
    ipHash: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SecurityEventSchema.index({ createdAt: -1 });

export default mongoose.models.SecurityEvent ||
  mongoose.model("SecurityEvent", SecurityEventSchema);
