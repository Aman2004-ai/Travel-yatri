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
} = require("../controllers/tripController");

router.post("/generate", generateTrip);
router.get("/", getAllTrips);

// Local Contributor Gems routes (must sit above :id catch-all)
router.get("/gems/:destination", getGemsByDestination);
router.post("/gems", createGem);
router.get("/leaderboard/list", getLeaderboard);

router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
