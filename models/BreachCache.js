import mongoose from "mongoose";

// Keyed by a one-way hash of the normalized email, never the raw address.
// Short-lived cache to reduce duplicate calls to the external breach API.
const BreachCacheSchema = new mongoose.Schema({
  emailHash: {
    type: String,
    required: true,
    unique: true,
  },
  normalizedResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index: MongoDB automatically removes documents once expiresAt passes.
BreachCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.BreachCache ||
  mongoose.model("BreachCache", BreachCacheSchema);
