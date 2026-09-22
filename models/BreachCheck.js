import mongoose from "mongoose";

// Deliberately does NOT store the raw email address. Only aggregate,
// non-identifying information is persisted, per the project's privacy rule.
const BreachCheckSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["breached", "clean"],
      required: true,
    },
    breachCount: {
      type: Number,
      required: true,
      default: 0,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BreachCheckSchema.index({ createdAt: -1 });

export default mongoose.models.BreachCheck ||
  mongoose.model("BreachCheck", BreachCheckSchema);
