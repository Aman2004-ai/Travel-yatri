import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip itinerary?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/trips/${id}`);
      setTrips(trips.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] relative z-10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto" />
          <p className="text-gray-400 font-semibold font-mono text-sm">Loading saved journeys...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
      
      {/* Background glowing blur */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-syne font-black uppercase text-white">
            📁 Saved Journeys
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Revisit, review, and delete your generated travel plans.</p>
        </div>
        <Link
          to="/plan"
          className="bg-amber-450 text-teal-950 px-6 py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-all text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10"
        >
          + Plan New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-24 text-gray-500 border border-white/5 bg-gray-900/10 rounded-3xl backdrop-blur-md">
          <div className="text-7xl mb-4 animate-bounce">🗺️</div>
          <p className="text-lg font-bold mb-6 text-white uppercase font-syne tracking-wide">No journeys saved yet</p>
          <Link to="/plan" className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">
            Plan your first trip →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-gray-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 shadow-xl relative overflow-hidden"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-teal-500/0 to-amber-500/0 group-hover:from-teal-500/5 group-hover:to-amber-500/5 rounded-2xl pointer-events-none transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-1.5 leading-tight">
                    <span>🌍</span> {trip.startLocation || "Lucknow"} → {trip.destination}
                  </h2>
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="text-gray-500 hover:text-red-400 text-base transition-colors p-1"
                    title="Delete Itinerary"
                  >
                    🗑️
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap text-[9px] font-bold uppercase tracking-wider mb-5">
                  <span className="bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/10">
                    📅 {trip.days} Days
                  </span>
                  <span className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full border border-amber-400/10">
                    Budget: {trip.budget}
                  </span>
                  <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/10">
                    👤 {trip.travelers}
                  </span>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/5 pt-4 flex flex-col gap-3">
                <span className="text-[9px] text-gray-500 font-mono">
                  Generated: {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <Link
                  to={`/results/${trip._id}`}
                  className="block text-center bg-teal-700 hover:bg-teal-650 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  View Full Plan →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedTrips;
