const express = require("express");
const router = express.Router();
const {
  generateTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
  updateTrip,
  getGemsByDestination,
  createGem,
  getLeaderboard,
  saveTripToAccount,
} = require("../controllers/tripController");
const { requireAuth, optionalAuth } = require("../middleware/auth");

router.post("/generate", optionalAuth, generateTrip);
router.get("/", requireAuth, getAllTrips);
router.post("/save-to-account", requireAuth, saveTripToAccount);

// Local Contributor Gems routes (must sit above :id catch-all)
router.get("/gems/:destination", getGemsByDestination);
router.post("/gems", createGem);
router.get("/leaderboard/list", getLeaderboard);

router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
