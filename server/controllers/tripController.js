const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Gem = require("../models/Gem");
const Contributor = require("../models/Contributor");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { saveTripLocal, getAllTripsLocal, getTripByIdLocal, deleteTripLocal, updateTripLocal } = require("../utils/localDb");
const { generateMockTrip } = require("../utils/mockGenerator");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI trip itinerary
const generateTrip = async (req, res) => {
  const { startLocation, destination, days, budget, travelers } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ message: "Destination and days are required" });
  }

  let data;
  let rawTextItinerary = "";
  let generatedByAI = false;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert travel assistant for the travel planning platform "Yatrabhai" (tagline: "Your Regret-Free Travel Companion").
      Generate a detailed, end-to-end, safety-first, structured travel plan from "${startLocation || "Lucknow"}" to "${destination}" for ${days} days.
      Budget tier: "${budget || "Medium"}"
      Travelers type: "${travelers || "Solo"}"

      Generate a valid JSON object matching the following structure. Do not wrap it in markdown code block syntax. Ensure it conforms exactly to this schema:
      {
        "trains": [
          {
            "trainNo": "e.g. 12916",
            "trainName": "e.g. Ashram Express",
            "departureTime": "e.g. 15:20",
            "arrivalTime": "e.g. 07:40",
            "duration": "e.g. 16h 20m",
            "classRecommend": "e.g. 3A (Third AC)",
            "safeRating": "e.g. Safe / High Guard",
            "approxFare": 1200
          }
        ],
        "itinerary": [
          {
            "dayNumber": 1,
            "theme": "Arrival & Heritage walk",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Check-in & Rest",
                "description": "Check into the recommended hostel/hotel and freshen up.",
                "safetyTip": "Use official pre-paid autos from station.",
                "cost": 0
              }
            ]
          }
        ],
        "accommodations": [
          {
            "name": "e.g. Zostel Ahmedabad",
            "area": "Navrangpura (Safe & central)",
            "safeForSoloTravelers": "Highly Safe",
            "type": "Hostel",
            "approxPriceRange": "₹600 - ₹1200 per night",
            "reason": "Great social vibe, secure lockers, female-only dorms available."
          }
        ],
        "localTransport": [
          {
            "mode": "Ahmedabad Metro",
            "costEstimate": "₹10 - ₹30 per trip",
            "description": "Fast, safe, and air-conditioned connectivity between East and West Ahmedabad.",
            "safetyTip": "Highly recommended for solo female travelers; separate coaches/seats are available."
          }
        ],
        "mapPins": [
          {
            "name": "Sabarmati Ashram",
            "lat": 23.0603,
            "lng": 72.5808,
            "description": "Historic residence of Mahatma Gandhi along the Sabarmati river.",
            "day": 1
          }
        ],
        "budgetBreakdown": {
          "stay": 4000,
          "food": 3000,
          "transport": 3500,
          "activities": 2500,
          "miscellaneous": 2000
        },
        "packingList": [
          "Comfortable walking shoes",
          "Power bank",
          "Modest clothing for temples",
          "Water bottle",
          "Hand sanitizer"
        ]
      }

      For trains: Find realistic train recommendations from ${startLocation || "Lucknow"} to ${destination} (or nearby major hubs) or suggest top public transit routing options if direct trains are unavailable.
      For mapPins: Provide accurate latitude (lat) and longitude (lng) values (e.g. for Sabarmati Ashram: lat=23.0603, lng=72.5808) so that Leaflet maps can display them. Include at least 3-6 pins representing key points in the itinerary.
      For safety: Provide practical tips and guidelines for solo travelers, and ensure stay recommendations highlight safe areas.
    `;

    const result = await model.generateContent(prompt);
    rawTextItinerary = result.response.text();
    data = JSON.parse(rawTextItinerary);
    generatedByAI = true;
  } catch (error) {
    console.warn("AI generation failed or API key invalid. Falling back to mock data generator. Error:", error.message);
    data = generateMockTrip(startLocation, destination, days, budget, travelers);
    rawTextItinerary = JSON.stringify(data);
  }

  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    const tripData = {
      startLocation: startLocation || "Lucknow",
      destination,
      days,
      budget: budget || "Medium",
      travelers: travelers || "Solo",
      trains: data.trains || [],
      itinerary: data.itinerary || [],
      accommodations: data.accommodations || [],
      localTransport: data.localTransport || [],
      mapPins: data.mapPins || [],
      budgetBreakdown: data.budgetBreakdown || {},
      packingList: data.packingList || [],
      rawTextItinerary,
    };

    if (req.user) {
      tripData.user = req.user.id;
    }

    let trip;
    if (isMongoConnected) {
      trip = new Trip(tripData);
      await trip.save();
    } else {
      console.warn("MongoDB is offline. Saving trip locally to data/trips.json");
      trip = saveTripLocal(tripData);
    }

    res.status(201).json({
      message: generatedByAI ? "Trip generated successfully" : "Trip generated successfully (mock fallback)",
      trip,
    });
  } catch (error) {
    console.error("Failed to save trip:", error.message);
    res.status(500).json({ message: "Failed to generate trip", error: error.message });
  }
};

// Get all saved trips
const getAllTrips = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(trips);
    } else {
      const trips = getAllTripsLocal();
      res.status(200).json(trips);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single trip by ID
const getTripById = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    let trip;
    if (isMongoConnected) {
      trip = await Trip.findById(req.params.id);
    } else {
      trip = getTripByIdLocal(req.params.id);
    }
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      await Trip.findByIdAndDelete(req.params.id);
    } else {
      deleteTripLocal(req.params.id);
    }
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a trip itinerary/details (Save customization)
const updateTrip = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    let trip;
    if (isMongoConnected) {
      trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
    } else {
      trip = updateTripLocal(req.params.id, req.body);
    }
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json({ message: "Trip customized successfully", trip });
  } catch (error) {
    res.status(500).json({ message: "Failed to customize trip", error: error.message });
  }
};

// Fetch community-contributed gems by destination
const getGemsByDestination = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    let gems = [];
    if (isMongoConnected) {
      const destination = req.params.destination;
      gems = await Gem.find({
        destination: { $regex: new RegExp(destination, "i") },
      }).sort({ createdAt: -1 });
    }
    res.status(200).json(gems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch local gems", error: error.message });
  }
};

// Contribute a hidden gem with gamification linking
const createGem = async (req, res) => {
  const { destination, name, area, review, contributorName, image } = req.body;
  if (!destination || !name || !area || !review || !contributorName) {
    return res.status(400).json({ message: "All contribution fields are required" });
  }

  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    let gemData = {
      destination,
      name,
      area,
      review,
      contributorName,
      image,
      pointsEarned: 50,
    };

    if (isMongoConnected) {
      // Case-insensitive lookup for Contributor
      let contributor = await Contributor.findOne({
        name: { $regex: new RegExp(`^${contributorName.trim()}$`, "i") },
      });

      if (contributor) {
        contributor.points += 50;
      } else {
        contributor = new Contributor({
          name: contributorName.trim(),
          points: 50,
        });
      }

      // Gamification milestones
      if (contributor.points >= 300) {
        contributor.level = "Super Local";
        contributor.badge = "👑 Super Local";
      } else if (contributor.points >= 150) {
        contributor.level = "City Guide";
        contributor.badge = "🏅 City Guide";
      } else {
        contributor.level = "Local Explorer";
        contributor.badge = "🎒 Local Explorer";
      }

      const newGem = new Gem(gemData);
      newGem.contributor = contributor._id;
      await newGem.save();

      contributor.gemsContributed.push(newGem._id);
      await contributor.save();

      gemData = newGem.toObject();
      gemData.contributorLevel = contributor.level;
      gemData.contributorBadge = contributor.badge;
      gemData.contributorPoints = contributor.points;
    }

    res.status(201).json({
      message: "Contribution saved successfully! 50 points awarded to contributor.",
      gem: gemData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save contribution", error: error.message });
  }
};

// Fetch Top Contributors Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    let contributors = [];
    if (isMongoConnected) {
      contributors = await Contributor.find()
        .sort({ points: -1 })
        .limit(10)
        .select("name points level badge");
    }
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
// Link an anonymous trip to the logged-in user
const saveTripToAccount = async (req, res) => {
  const { tripId } = req.body;
  if (!tripId) {
    return res.status(400).json({ message: "Trip ID is required" });
  }

  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // If the trip already belongs to someone else
      if (trip.user && trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "This trip belongs to another account" });
      }

      trip.user = req.user.id;
      await trip.save();

      res.status(200).json({ message: "Trip successfully linked to your account", trip });
    } else {
      res.status(400).json({ message: "MongoDB is offline, cannot link account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to save trip to account", error: error.message });
  }
};

module.exports = {
  generateTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
  updateTrip,
  getGemsByDestination,
  createGem,
  getLeaderboard,
  saveTripToAccount,
};

