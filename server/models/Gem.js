const mongoose = require("mongoose");

const gemSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    name: { type: String, required: true },
    area: { type: String, required: true },
    review: { type: String, required: true },
    contributorName: { type: String, required: true },
    contributor: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor" },
    pointsEarned: { type: Number, default: 50 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gem", gemSchema);
