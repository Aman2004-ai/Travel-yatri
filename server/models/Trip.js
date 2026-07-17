const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    startLocation: { type: String, default: "Lucknow" },
    destination: { type: String, required: true },
    days: { type: Number, required: true },
    budget: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    travelers: { type: String, default: "Solo" },
    trains: [
      {
        trainNo: String,
        trainName: String,
        departureTime: String,
        arrivalTime: String,
        duration: String,
        classRecommend: String,
        safeRating: String,
        approxFare: Number,
      },
    ],
    itinerary: [
      {
        dayNumber: Number,
        theme: String,
        activities: [
          {
            time: String,
            title: String,
            description: String,
            safetyTip: String,
            cost: Number,
          },
        ],
      },
    ],
    accommodations: [
      {
        name: String,
        area: String,
        safeForSoloTravelers: String,
        type: String,
        approxPriceRange: String,
        reason: String,
      },
    ],
    localTransport: [
      {
        mode: String,
        costEstimate: String,
        description: String,
        safetyTip: String,
      },
    ],
    mapPins: [
      {
        name: String,
        lat: Number,
        lng: Number,
        description: String,
        day: Number,
      },
    ],
    budgetBreakdown: {
      stay: Number,
      food: Number,
      transport: Number,
      activities: Number,
      miscellaneous: Number,
    },
    packingList: [String],
    rawTextItinerary: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);

