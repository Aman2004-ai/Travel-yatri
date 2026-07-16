const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_FILE = path.join(__dirname, "../data/trips.json");

// Ensure directory exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const readTrips = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading local trips:", err.message);
    return [];
  }
};

const writeTrips = (trips) => {
  try {
    ensureDirectoryExistence(DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(trips, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local trips:", err.message);
  }
};

const saveTripLocal = (tripData) => {
  const trips = readTrips();
  
  // Clone tripData and assign ID + timestamps if not present
  const record = { ...tripData };
  if (!record._id) {
    record._id = crypto.randomBytes(12).toString("hex");
  }
  record.createdAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();
  
  trips.unshift(record);
  writeTrips(trips);
  return record;
};

const getAllTripsLocal = () => {
  return readTrips();
};

const getTripByIdLocal = (id) => {
  const trips = readTrips();
  return trips.find((t) => t._id === id) || null;
};

const deleteTripLocal = (id) => {
  const trips = readTrips();
  const filtered = trips.filter((t) => t._id !== id);
  writeTrips(filtered);
  return true;
};

const updateTripLocal = (id, updateData) => {
  const trips = readTrips();
  const idx = trips.findIndex((t) => t._id === id);
  if (idx === -1) return null;
  trips[idx] = { ...trips[idx], ...updateData, updatedAt: new Date().toISOString() };
  writeTrips(trips);
  return trips[idx];
};

module.exports = {
  saveTripLocal,
  getAllTripsLocal,
  getTripByIdLocal,
  deleteTripLocal,
  updateTripLocal,
};

