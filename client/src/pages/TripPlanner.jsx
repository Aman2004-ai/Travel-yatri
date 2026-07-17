import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function TripPlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    startLocation: "Lucknow",
    destination: searchParams.get("destination") || "",
    days: "",
    budget: "Medium",
    travelers: "Solo",
    prioritizeSafety: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step-by-step progress logging state
  const [stepStates, setStepStates] = useState([
    { text: "Analyzing connectivity configurations...", icon: "🔍", status: "pending" },
    { text: "Mapping optimum routes and coordinates...", icon: "🗺️", status: "pending" },
    { text: "Verifying local stays and budget constraints...", icon: "🏨", status: "pending" },
    { text: "Injecting local contributor hidden gems...", icon: "✨", status: "pending" },
  ]);

  // Trivia facts cycling
  const triviaFacts = [
    "Did you know? Indian Railways carries over 23 million passengers daily, which is equivalent to the entire population of Australia!",
    "Did you know? Kerala's houseboats (Kettuvallams) were originally used to carry rice cargo and are built without using a single nail!",
    "Did you know? Ladakh is home to the magnetic hill, a gravity hill where vehicles appear to roll uphill against gravity!",
    "Did you know? Varanasi is widely considered one of the oldest continuously inhabited cities in the world, dating back over 3,000 years.",
    "Did you know? Goa is the smallest Indian state by area but has the highest GDP per capita, making it a very prosperous coastal retreat.",
    "Did you know? The Great Wall of India at Kumbalgarh Fort is the second-longest continuous wall in the world, stretching over 36 kilometers!",
  ];

  const [triviaIndex, setTriviaIndex] = useState(0);

  // Timer for step-by-step console simulation
  useEffect(() => {
    let timers = [];
    if (loading) {
      // Step 1: Loading
      setStepStates([
        { text: `Analyzing connectivity from ${formData.startLocation || "Lucknow"}...`, icon: "🔍", status: "loading" },
        { text: `Mapping the best route in ${formData.destination || "destination"}...`, icon: "🗺️", status: "pending" },
        { text: "Verifying local stays and budget constraints...", icon: "🏨", status: "pending" },
        { text: "Injecting local contributor hidden gems...", icon: "✨", status: "pending" },
      ]);

      // Step 2 starts loading at 3.5s, Step 1 completes
      timers.push(setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[0].status = "done";
          next[1].status = "loading";
          return next;
        });
      }, 3500));

      // Step 3 starts loading at 7.0s, Step 2 completes
      timers.push(setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[1].status = "done";
          next[2].status = "loading";
          return next;
        });
      }, 7000));

      // Step 4 starts loading at 10.5s, Step 3 completes
      timers.push(setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[2].status = "done";
          next[3].status = "loading";
          return next;
        });
      }, 10500));

      // Step 4 completes at 14.0s
      timers.push(setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[3].status = "done";
          return next;
        });
      }, 14000));
    }
    return () => timers.forEach(t => clearTimeout(t));
  }, [loading, formData.startLocation, formData.destination]);

  // Interval for cycling trivia cards (slowed to 6s for better readability)
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTriviaIndex(prev => (prev + 1) % triviaFacts.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.startLocation || !formData.destination || !formData.days) {
      setError("Please fill in starting city, destination, and days.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/trips/generate`,
        formData
      );
      navigate(`/results/${res.data.trip._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please check your internet or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
      
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none -z-10" />

      {loading ? (
        /* Futuristic Real-Time Terminal Loader */
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 text-center py-8">
          
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Spinning Neon Rings */}
            <div className="absolute inset-0 border-4 border-teal-500/10 border-t-teal-400 rounded-full animate-spin duration-1000" />
            <div className="absolute inset-2 border-4 border-amber-500/15 border-b-amber-400 rounded-full animate-spin duration-700 reverse" />
            <span className="text-4xl animate-bounce">🎒</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-syne font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-400">
              TravelYatri Travel Engine
            </h2>
            <p className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">
              Compiling your regret-free travel itinerary
            </p>
          </div>

          {/* Simulated Real-Time System Checks */}
          <div className="bg-gray-900/60 border border-white/5 p-6 rounded-3xl w-full max-w-md text-left space-y-4 font-mono text-xs shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute -inset-px bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[10px] text-gray-500">
              <span>SYSTEM: VERIFYING CHECKS</span>
              <span className="animate-ping w-1.5 h-1.5 bg-teal-400 rounded-full" />
            </div>
            
            <div className="space-y-3">
              {stepStates.map((step, idx) => {
                let statusIcon = "●";
                let statusColor = "text-gray-600";
                
                if (step.status === "loading") {
                  statusIcon = "🔄";
                  statusColor = "text-amber-400 animate-spin inline-block";
                } else if (step.status === "done") {
                  statusIcon = "✓";
                  statusColor = "text-teal-400 font-bold";
                }

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`w-5 text-center text-xs ${statusColor}`}>
                      {statusIcon}
                    </span>
                    <span className={`flex-1 ${step.status === "pending" ? "text-gray-600" : step.status === "loading" ? "text-amber-300" : "text-white"}`}>
                      {step.icon} {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Travel Trivia Carousel Card (Flashes facts about places) */}
          <div className="bg-teal-500/5 border border-teal-500/10 p-5 rounded-2xl w-full max-w-md text-center text-xs text-teal-350 italic shadow-xl relative overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="font-mono text-[9px] uppercase tracking-widest text-teal-500 block mb-1.5 font-bold">
              💡 Did you know?
            </span>
            <p className="leading-relaxed font-medium">
              {triviaFacts[triviaIndex]}
            </p>
          </div>

        </div>
      ) : (
        <>
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-4xl font-syne font-black uppercase text-white tracking-tight">
              Create Travel Plan
            </h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Fill in your logistics, and TravelYatri AI will prepare your end-to-end trip details.
            </p>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl relative">
            <div className="absolute -inset-px bg-gradient-to-r from-teal-500/20 to-amber-500/20 rounded-3xl -z-10 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Start Location */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                    🏁 Start Location
                  </label>
                  <input
                    type="text"
                    name="startLocation"
                    value={formData.startLocation}
                    onChange={handleChange}
                    placeholder="e.g. Lucknow"
                    className="w-full px-4 py-3 bg-gray-950/70 border border-white/5 focus:border-teal-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/20 text-white font-medium text-sm transition-all"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                    🌍 Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Gujarat"
                    className="w-full px-4 py-3 bg-gray-950/70 border border-white/5 focus:border-teal-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/20 text-white font-medium text-sm transition-all"
                  />
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                  📅 Number of Days (1 - 30)
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 bg-gray-950/70 border border-white/5 focus:border-teal-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/20 text-white font-medium text-sm transition-all"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                  💰 Budget Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Low", "Medium", "High"].map((b) => {
                    const isSelected = formData.budget === b;
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setFormData({ ...formData, budget: b })}
                        className={`py-3.5 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                          isSelected
                            ? "border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                            : "border-white/5 bg-gray-950/20 text-gray-400 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        {b === "Low" ? "🪙 Low" : b === "Medium" ? "💳 Med" : "💎 High"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                  👥 Travelers
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-950/70 border border-white/5 focus:border-teal-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/20 text-white font-semibold text-sm transition-all"
                >
                  <option className="bg-gray-950" value="Solo">Solo Traveler</option>
                  <option className="bg-gray-950" value="Solo Female">Solo Female Traveler</option>
                  <option className="bg-gray-950" value="Couple">Couple</option>
                  <option className="bg-gray-950" value="Family">Family Group</option>
                  <option className="bg-gray-950" value="Friends">Friends Group</option>
                </select>
              </div>

              {/* Safety Preference Checkbox */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  id="prioritizeSafety"
                  name="prioritizeSafety"
                  checked={formData.prioritizeSafety}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-teal-500 border-white/15 bg-gray-950 focus:ring-0 accent-teal-550 cursor-none"
                />
                <label htmlFor="prioritizeSafety" className="text-xs text-gray-300 font-bold select-none cursor-none">
                  🛡️ Prioritize safety checks (hostels, female coaches, area safety index scores)
                </label>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl text-left">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-400 text-teal-950 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              >
                ✨ Compile My Plan
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default TripPlanner;
