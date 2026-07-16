const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const tripRoutes = require("./routes/trip");
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("TravelYatri API is running");
});

const PORT = process.env.PORT || 5003;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously (won't block server startup)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
} else {
  console.warn("WARNING: MONGO_URI is not defined in .env file.");
}