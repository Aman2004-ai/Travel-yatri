const mongoose = require("mongoose");

const contributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    points: { type: Number, default: 50 },
    level: { type: String, default: "Local Explorer" },
    badge: { type: String, default: "🎒 Local Explorer" },
    gemsContributed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gem" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contributor", contributorSchema);
