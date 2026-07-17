import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import TripMap from "../components/TripMap";
import { useAuth } from "../context/AuthContext";

// Error Boundary to prevent Leaflet from crashing the whole page
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Map rendering crash caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-left text-xs space-y-2">
          <h3 className="font-extrabold text-sm uppercase text-red-500">🗺️ Map Rendering Error</h3>
          <p className="font-mono">{this.state.error?.toString()}</p>
          <p className="text-gray-400">Please refresh or plan another journey. If this is a mock trip, coordinates might be out of range.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [linkingAccount, setLinkingAccount] = useState(false);

  // Itinerary Customizer States
  const [localItinerary, setLocalItinerary] = useState([]);
  const [customized, setCustomized] = useState(false);
  const [savingCustomization, setSavingCustomization] = useState(false);
  const [newActForm, setNewActForm] = useState({ dayIndex: -1, time: "", title: "", description: "", cost: 0, safetyTip: "" });

  // Community Contributed Gems States
  const [communityGems, setCommunityGems] = useState([]);
  const [openGemModal, setOpenGemModal] = useState(false);
  const [gemForm, setGemForm] = useState({ name: "", area: "", review: "", contributorName: "", image: "" });
  const [leaderboard, setLeaderboard] = useState([]);

  // Group Expense Splitter States
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ desc: "", amount: "", paidBy: "" });
  
  // Interactive Packing Checklist States
  const [packedItems, setPackedItems] = useState({});

  const weatherDictionary = {
    ladakh: { temp: "12°C", desc: "🌤️ Chilly & windy. Carry heavy layers, thermals, and windbreakers." },
    kerala: { temp: "29°C", desc: "🌧️ Humid & wet. Rain showers expected. Carry umbrellas and quick-dry apparel." },
    varanasi: { temp: "33°C", desc: "☀️ Hot & spiritual. Carry light cotton fabrics, hats, and sunblock." },
    goa: { temp: "30°C", desc: "🏖️ Warm beach weather. Carry shorts, sunglasses, and flip-flops." },
    gujarat: { temp: "31°C", desc: "🌤️ Warm & dry. Carry light cotton clothing and comfortable walking shoes." },
    rajasthan: { temp: "34°C", desc: "☀️ Dry heat. Keep hydrated, wear sunglasses and light loose cottons." },
    manali: { temp: "16°C", desc: "❄️ Cool mountain breeze. Carry light sweaters or jackets." },
    jaipur: { temp: "33°C", desc: "☀️ Sunny & clear. Light apparel recommended." }
  };

  const getDestinationWeather = () => {
    if (!trip || !trip.destination) return { temp: "26°C", desc: "🌤️ Pleasant weather. Comfortable cottons and walking shoes recommended." };
    const destKey = trip.destination.toLowerCase().split(" ")[0];
    return weatherDictionary[destKey] || { temp: "25°C", desc: "🌤️ Pleasant weather. Comfortable walking shoes and standard layers recommended." };
  };

  const calculateSettlements = () => {
    if (expenses.length === 0) return { total: 0, perPerson: 0, settlements: [] };

    const participantsSet = new Set(expenses.map(e => e.paidBy.trim()));
    if (participantsSet.size <= 1) {
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      return { total, perPerson: total, settlements: [] };
    }

    const participants = Array.from(participantsSet);
    const numPeople = participants.length;

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = total / numPeople;

    const balances = {};
    participants.forEach(p => {
      balances[p] = 0;
    });

    expenses.forEach(e => {
      balances[e.paidBy.trim()] += e.amount;
    });

    const netBalances = [];
    participants.forEach(p => {
      netBalances.push({ name: p, balance: balances[p] - perPerson });
    });

    const debtors = netBalances.filter(x => x.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = netBalances.filter(x => x.balance > 0).sort((a, b) => b.balance - a.balance);

    const settlements = [];
    let debtorIdx = 0;
    let creditorIdx = 0;

    const localDebtors = debtors.map(d => ({ ...d }));
    const localCreditors = creditors.map(c => ({ ...c }));

    while (debtorIdx < localDebtors.length && creditorIdx < localCreditors.length) {
      const debtor = localDebtors[debtorIdx];
      const creditor = localCreditors[creditorIdx];

      const owedAmount = Math.min(Math.abs(debtor.balance), creditor.balance);

      if (owedAmount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(owedAmount),
        });
      }

      debtor.balance += owedAmount;
      creditor.balance -= owedAmount;

      if (Math.abs(debtor.balance) < 0.01) debtorIdx++;
      if (Math.abs(creditor.balance) < 0.01) creditorIdx++;
    }

    return { total, perPerson: Math.round(perPerson), settlements };
  };

  useEffect(() => {
    const fetchTripAndGems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/${id}`);
        setTrip(res.data);
        setLocalItinerary(res.data.itinerary || []);
        
        // Fetch community local contributed gems
        try {
          const gemsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/gems/${res.data.destination}`);
          setCommunityGems(gemsRes.data || []);
        } catch (gErr) {
          console.warn("Could not load community gems:", gErr.message);
        }

        // Fetch leaderboard stats
        try {
          const lbRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/leaderboard/list`);
          setLeaderboard(lbRes.data || []);
        } catch (lErr) {
          console.warn("Could not load leaderboard:", lErr.message);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load trip details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTripAndGems();
  }, [id]);

  // Itinerary Customizer: Delete Activity
  const handleDeleteActivity = (dayIndex, actIndex) => {
    const updated = [...localItinerary];
    updated[dayIndex].activities.splice(actIndex, 1);
    setLocalItinerary(updated);
    setCustomized(true);
  };

  // Itinerary Customizer: Move Activity Up/Down
  const handleMoveActivity = (dayIndex, actIndex, direction) => {
    const updated = [...localItinerary];
    const activities = updated[dayIndex].activities;
    const newIndex = actIndex + direction;
    if (newIndex >= 0 && newIndex < activities.length) {
      const temp = activities[actIndex];
      activities[actIndex] = activities[newIndex];
      activities[newIndex] = temp;
      setLocalItinerary(updated);
      setCustomized(true);
    }
  };

  // Itinerary Customizer: Add Custom Activity
  const handleAddActivity = (dayIndex) => {
    if (!newActForm.title || !newActForm.time) {
      alert("Please fill in the Time and Title of the activity.");
      return;
    }
    const updated = [...localItinerary];
    updated[dayIndex].activities.push({
      time: newActForm.time,
      title: newActForm.title,
      description: newActForm.description || "Local activity details",
      cost: Number(newActForm.cost) || 0,
      safetyTip: newActForm.safetyTip || "",
    });
    setLocalItinerary(updated);
    setCustomized(true);
    setNewActForm({ dayIndex: -1, time: "", title: "", description: "", cost: 0, safetyTip: "" });
  };

  // Itinerary Customizer: Save Customizations to MongoDB
  const handleSaveCustomization = async () => {
    setSavingCustomization(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/trips/${id}`, {
        itinerary: localItinerary,
      });
      setTrip(res.data.trip);
      setLocalItinerary(res.data.trip.itinerary || []);
      setCustomized(false);
      alert("Itinerary customized and saved successfully in database! ⚡");
    } catch (err) {
      console.error(err);
      alert("Failed to save itinerary changes.");
    } finally {
      setSavingCustomization(false);
    }
  };

  // Link anonymous trip to account
  const handleSaveToAccount = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setLinkingAccount(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/trips/save-to-account`, {
        tripId: trip._id,
      });
      alert("Journey successfully linked to your account! 📁");
      setTrip(res.data.trip);
    } catch (err) {
      console.error("Failed to link trip:", err);
      alert(err.response?.data?.message || "Failed to save trip to account.");
    } finally {
      setLinkingAccount(false);
    }
  };

  // WhatsApp Exporter
  const handleWhatsAppShare = () => {
    let shareText = `*TravelYatri AI Travel Plan: ${trip.destination}* 🎒\n`;
    shareText += `📅 Days: ${trip.days} | 🚩 Origin: ${trip.startLocation || "Lucknow"} | 💰 Budget: ${trip.budget}\n\n`;

    localItinerary.forEach((day) => {
      shareText += `*Day ${day.dayNumber}: ${day.theme || "Sightseeing"}*\n`;
      day.activities.forEach((act) => {
        shareText += `• ${act.time} - _${act.title}_: ${act.description} ${act.cost > 0 ? `(Est: ₹${act.cost})` : "(Free)"}\n`;
        if (act.safetyTip) shareText += `  ⚠️ Safety: ${act.safetyTip}\n`;
      });
      shareText += `\n`;
    });

    shareText += `Build your regret-free travel plan on TravelYatri! ✨`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  // Local Contributor: Submit a Gem
  const handleSubmittingGem = async (e) => {
    e.preventDefault();
    if (!gemForm.name || !gemForm.area || !gemForm.review || !gemForm.contributorName) {
      alert("Please fill in all contribution fields.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/trips/gems`, {
        ...gemForm,
        destination: trip.destination,
      });
      
      const newGem = res.data.gem;
      alert(`Awesome! 50 points awarded to ${newGem.contributorName}! Current Badge: ${newGem.contributorBadge || "🎒 Local Explorer"} (${newGem.contributorPoints || 50} pts) 🏅`);
      
      setCommunityGems([newGem, ...communityGems]);
      setGemForm({ name: "", area: "", review: "", contributorName: "", image: "" });
      setOpenGemModal(false);

      // Refetch leaderboard list to update points dynamically
      try {
        const lbRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/leaderboard/list`);
        setLeaderboard(lbRes.data || []);
      } catch (lErr) {
        console.warn("Could not refresh leaderboard:", lErr.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit local contribution.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] relative z-10">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-teal-500/10 border-t-teal-400 rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-3xl">✈️</span>
          </div>
          <p className="text-gray-400 font-semibold font-mono text-sm">Compiling map routes & schedules...</p>
        </div>
      </div>
    );

  if (error || !trip)
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4 relative z-10">
        <p className="text-red-400 font-bold text-lg">⚠️ {error || "Trip not found."}</p>
        <Link
          to="/plan"
          className="inline-block bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all"
        >
          Plan a new trip
        </Link>
      </div>
    );

  const isStructured = localItinerary && localItinerary.length > 0;

  const tabs = [
    { id: "itinerary", label: "📅 Itinerary", count: localItinerary?.length },
    { id: "trains", label: "🚆 Train Schedule", count: trip.trains?.length },
    { id: "stay", label: "🏠 Stay & Transit", count: trip.accommodations?.length },
    { id: "gems", label: "💎 Local Gems", count: communityGems?.length },
    { id: "map", label: "📍 Live Map", count: trip.mapPins?.length },
    { id: "budget", label: "💳 Budget & Items", count: trip.packingList?.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
      
      {/* Background blurring orb */}
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header Panel */}
      <div className="bg-gray-900/50 border border-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute -inset-px bg-gradient-to-r from-teal-500/10 to-amber-500/10 rounded-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between flex-wrap gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-block bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {trip.travelers || "Solo"} Journey
            </span>
            <h1 className="text-3xl md:text-5xl font-syne font-black uppercase text-white flex items-center gap-2">
              <span>🌍</span> {trip.destination}
            </h1>
            <div className="flex gap-4 md:gap-6 flex-wrap text-gray-400 text-xs mt-3 font-semibold font-mono">
              <span className="text-teal-400">🚩 Origin: {trip.startLocation || "Lucknow"}</span>
              <span>📅 {trip.days} Days</span>
              <span className="text-amber-500">💰 {trip.budget} Budget</span>
            </div>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap no-print">
            {/* Link to Account Button */}
            {!trip.user ? (
              <button
                onClick={handleSaveToAccount}
                disabled={linkingAccount}
                className="bg-amber-450 hover:bg-amber-400 text-teal-950 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-none"
                title="Save this trip to your profile"
              >
                {linkingAccount ? "Saving..." : user ? "Save to Profile 💾" : "Login to Save 🔒"}
              </button>
            ) : (
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 py-3 rounded-xl uppercase tracking-wider font-mono">
                ✓ Saved to Account
              </span>
            )}

            {/* WhatsApp Exporter */}
            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/10 cursor-none"
              title="Share itinerary to WhatsApp"
            >
              Share 💬
            </button>

            {/* Print / PDF Exporter */}
            <button
              onClick={() => window.print()}
              className="bg-teal-700/40 text-teal-400 border border-teal-500/20 hover:bg-teal-700/60 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-none"
              title="Download Plan as PDF"
            >
              PDF 📄
            </button>

            <Link
              to="/plan"
              className="bg-white/5 text-white border border-white/10 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              + Plan New
            </Link>
          </div>
        </div>
      </div>

      {customized && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between no-print">
          <span className="text-xs font-semibold text-amber-400">
            ⚠️ You have unsaved customizations (added, deleted or moved activities).
          </span>
          <button
            onClick={handleSaveCustomization}
            disabled={savingCustomization}
            className="bg-amber-450 hover:bg-amber-400 text-teal-950 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md"
          >
            {savingCustomization ? "Saving..." : "Save Custom Plan ⚡"}
          </button>
        </div>
      )}

      {isStructured ? (
        <div className="space-y-8">
          
          {/* Tab Trigger Bar */}
          <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-2 md:gap-4 pb-px no-print">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                    isActive
                      ? "border-teal-400 text-teal-400 shadow-[0_4px_12px_rgba(20,184,166,0.05)]"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-[10px] bg-white/5 text-teal-400 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Display Panel */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-3xl border border-white/5 p-6 md:p-8 shadow-2xl">
            
            {/* ITINERARY TAB */}
            {activeTab === "itinerary" && (
              <div className="space-y-8">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-2">
                      Day-by-Day Timeline
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Manage daily schedules. Use controls to rearrange activities, delete entries, or insert new custom plans.</p>
                  </div>
                  {customized && (
                    <button
                      onClick={handleSaveCustomization}
                      className="bg-amber-450 text-teal-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10 no-print"
                    >
                      Save Changes 💾
                    </button>
                  )}
                </div>

                <div className="space-y-8 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-[1px] before:bg-teal-500/20">
                  {localItinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-10 space-y-4">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-gray-900 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold text-xs shadow-md z-10">
                        {day.dayNumber}
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2 inline-block">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-450">
                            Day {day.dayNumber} : {day.theme || "Exploration & Transit"}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {day.activities.map((act, actIdx) => (
                            <div
                              key={actIdx}
                              className="bg-gray-900/40 border border-white/5 hover:border-teal-500/20 rounded-2xl p-5 transition-all hover:bg-gray-900/60 hover:shadow-lg"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div className="space-y-1">
                                  <span className="inline-block bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                                    ⏰ {act.time}
                                  </span>
                                  <h4 className="font-bold text-white text-sm md:text-base">{act.title}</h4>
                                </div>

                                {/* Customizer Controls (Hidden during PDF prints) */}
                                <div className="flex items-center gap-1.5 no-print">
                                  <button
                                    onClick={() => handleMoveActivity(idx, actIdx, -1)}
                                    disabled={actIdx === 0}
                                    className="bg-white/5 border border-white/10 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    onClick={() => handleMoveActivity(idx, actIdx, 1)}
                                    disabled={actIdx === day.activities.length - 1}
                                    className="bg-white/5 border border-white/10 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Down"
                                  >
                                    ▼
                                  </button>
                                  <button
                                    onClick={() => handleDeleteActivity(idx, actIdx)}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    title="Delete Activity"
                                  >
                                    🗑️
                                  </button>
                                </div>

                                {act.cost !== undefined && (
                                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/5 px-2.5 py-1 rounded-full border border-amber-400/10">
                                    {act.cost === 0 ? "Free Entry" : `Est: ₹${act.cost}`}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{act.description}</p>

                              {act.safetyTip && (
                                <div className="mt-4 bg-amber-500/5 border border-amber-500/10 text-amber-300 rounded-xl p-3 text-xs flex items-start gap-2.5">
                                  <span className="text-sm mt-0.5">🛡️</span>
                                  <div>
                                    <span className="font-bold block text-[9px] uppercase tracking-wider text-amber-500">Safety Tip</span>
                                    {act.safetyTip}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Customizer Add Activity Section */}
                        <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-2xl p-4 no-print mt-2">
                          {newActForm.dayIndex === idx ? (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add Activity</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  placeholder="Time (e.g. 02:00 PM)"
                                  value={newActForm.time}
                                  onChange={(e) => setNewActForm({ ...newActForm, time: e.target.value })}
                                  className="px-3 py-2 bg-gray-950 border border-white/5 rounded-xl text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Title (e.g. Visit local museum)"
                                  value={newActForm.title}
                                  onChange={(e) => setNewActForm({ ...newActForm, title: e.target.value })}
                                  className="px-3 py-2 bg-gray-950 border border-white/5 rounded-xl text-xs text-white"
                                />
                                <input
                                  type="number"
                                  placeholder="Cost (e.g. 150)"
                                  value={newActForm.cost || ""}
                                  onChange={(e) => setNewActForm({ ...newActForm, cost: e.target.value })}
                                  className="px-3 py-2 bg-gray-950 border border-white/5 rounded-xl text-xs text-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Description (e.g. Scenic historical walks)"
                                  value={newActForm.description}
                                  onChange={(e) => setNewActForm({ ...newActForm, description: e.target.value })}
                                  className="px-3 py-2 bg-gray-950 border border-white/5 rounded-xl text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Safety Tip (e.g. Avoid evening travel)"
                                  value={newActForm.safetyTip}
                                  onChange={(e) => setNewActForm({ ...newActForm, safetyTip: e.target.value })}
                                  className="px-3 py-2 bg-gray-950 border border-white/5 rounded-xl text-xs text-white"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setNewActForm({ dayIndex: -1, time: "", title: "", description: "", cost: 0, safetyTip: "" })}
                                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase font-bold text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddActivity(idx)}
                                  className="px-4 py-1.5 bg-teal-700 text-white rounded-xl text-[10px] uppercase font-bold"
                                >
                                  Add Activity
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setNewActForm({ dayIndex: idx, time: "", title: "", description: "", cost: 0, safetyTip: "" })}
                              className="text-xs font-bold text-teal-400 hover:text-teal-350 flex items-center gap-1.5 transition-colors"
                            >
                              + Add custom activity to Day {day.dayNumber}
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRAINS SCHEDULE TAB */}
            {activeTab === "trains" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-1">
                    Railway Schedules
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">Direct train connections from {trip.startLocation || "Lucknow"} to {trip.destination}.</p>
                </div>

                {trip.trains && trip.trains.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trip.trains.map((train, idx) => (
                      <div key={idx} className="border border-white/5 rounded-3xl p-5 bg-gradient-to-br from-white/[0.02] to-transparent shadow-xl flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
                        <div>
                          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/10">
                              🚂 Train #{train.trainNo}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                              ⭐ {train.safeRating || "Safe"}
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-base md:text-lg mb-4">{train.trainName}</h3>

                          <div className="grid grid-cols-3 gap-2 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4 font-mono">
                            <div>
                              <span className="text-[9px] text-gray-500 block uppercase">Depart</span>
                              <span className="font-extrabold text-white text-sm">{train.departureTime}</span>
                            </div>
                            <div className="border-x border-white/5 flex flex-col justify-center">
                              <span className="text-[9px] text-gray-500 block uppercase">Duration</span>
                              <span className="font-semibold text-gray-400 text-xs">{train.duration}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 block uppercase">Arrive</span>
                              <span className="font-extrabold text-white text-sm">{train.arrivalTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-400">Class Recommend:</span>
                            <span className="text-teal-400 font-bold bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/10">{train.classRecommend}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-400">Average Cost:</span>
                            <span className="text-amber-400 font-bold">₹{train.approxFare}</span>
                          </div>
                          <a
                            href="https://www.irctc.co.in/nget/train-search"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-teal-700 text-white text-xs font-bold py-3 rounded-xl hover:bg-teal-650 transition-colors mt-3 uppercase tracking-wider no-print"
                          >
                            Book on IRCTC 🎟
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white/[0.01] rounded-2xl border border-white/5">
                    <p>No specific trains recommended. Check public routes manually.</p>
                  </div>
                )}
              </div>
            )}

            {/* STAY & TRANSIT TAB */}
            {activeTab === "stay" && (
              <div className="space-y-10">
                {/* Lodging */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-1">
                      🏠 Stays & Hostels
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Safe lodging picks rated highly for solo travelers and location index.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trip.accommodations && trip.accommodations.map((acc, idx) => (
                      <div key={idx} className="border border-white/5 rounded-3xl p-5 bg-gradient-to-br from-white/[0.01] to-transparent flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/10">
                              {acc.type}
                            </span>
                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${
                              acc.safeForSoloTravelers?.toLowerCase().includes("highly") 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            }`}>
                              🛡️ {acc.safeForSoloTravelers || "Safe Zone"}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base md:text-lg mb-1">{acc.name}</h3>
                          <p className="text-xs font-semibold text-teal-400 mb-4">📍 Region: {acc.area}</p>
                          <p className="text-xs text-gray-400 leading-relaxed mb-4">{acc.reason}</p>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-4 text-xs font-bold items-center">
                          <span className="text-gray-500">Estimated Cost:</span>
                          <span className="text-amber-400">{acc.approxPriceRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Transport Guide */}
                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div>
                    <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-1">
                      🚕 Local Transport
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Cost indices and safety advices for inside-city transits.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.localTransport && trip.localTransport.map((trans, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <h4 className="font-bold text-teal-400 text-sm md:text-base mb-1">{trans.mode}</h4>
                        <span className="inline-block text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/10 px-2 py-0.5 rounded-full mb-3">
                          Est: {trans.costEstimate}
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{trans.description}</p>
                        {trans.safetyTip && (
                          <div className="bg-gray-900/60 border border-white/5 rounded-xl p-3 text-[11px] text-gray-300">
                            <strong>Safety Check:</strong> {trans.safetyTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOCAL CONTRIBUTED GEMS TAB */}
            {activeTab === "gems" && (
              <div className="space-y-6">
                <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-1">
                      💎 Local Contributed Gems
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Offbeat spots, safety advice, and hidden attractions shared by verified locals.</p>
                  </div>
                  <button
                    onClick={() => setOpenGemModal(true)}
                    className="bg-amber-450 text-teal-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10 no-print"
                  >
                    + Share a Gem
                  </button>
                </div>

                {/* Grid Split: 8 cols for Gems, 4 cols for Contributor Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  
                  {/* Left Column: Gems Cards */}
                  <div className="lg:col-span-8 space-y-6">
                    {communityGems && communityGems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {communityGems.map((gem, idx) => (
                          <div key={idx} className="border border-white/5 rounded-3xl p-0 bg-gradient-to-br from-white/[0.01] to-transparent shadow-xl relative overflow-hidden flex flex-col justify-between avoid-page-break">
                            {gem.image && (
                              <div className="h-44 w-full overflow-hidden relative select-none pointer-events-none mb-3 border-b border-white/5">
                                <img src={gem.image} alt={gem.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                              </div>
                            )}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/10">
                                    📍 {gem.area}
                                  </span>
                                  <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                    👤 {gem.contributorName}
                                  </span>
                                </div>
                                <h3 className="font-bold text-white text-base md:text-lg mb-2">{gem.name}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed mb-4">"{gem.review}"</p>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3 font-mono">
                                <span>Contribution: +50 Pts</span>
                                <span>{gem.createdAt ? new Date(gem.createdAt).toLocaleDateString("en-IN") : "Recently"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 bg-white/[0.01] rounded-2xl border border-white/5">
                        <p>No community gems submitted for {trip.destination} yet. Be the first to share one!</p>
                        <button
                          onClick={() => setOpenGemModal(true)}
                          className="mt-4 bg-teal-700 hover:bg-teal-650 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors"
                        >
                          Share Hidden Gem
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Leaderboard Card (Hidden in prints) */}
                  <div className="lg:col-span-4 space-y-6 no-print">
                    <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                      <div className="absolute -inset-px bg-gradient-to-br from-teal-500/5 to-amber-500/5 rounded-3xl pointer-events-none" />
                      <div className="relative z-10 space-y-4">
                        <div className="border-b border-white/5 pb-3">
                          <h3 className="font-syne font-black text-sm uppercase text-amber-450 tracking-wider flex items-center gap-2">
                            🏆 Contributor Rankings
                          </h3>
                          <p className="text-[10px] text-gray-405 mt-1">Verified Local Community Leaderboard</p>
                        </div>

                        {leaderboard && leaderboard.length > 0 ? (
                          <div className="space-y-3 font-semibold text-xs">
                            {leaderboard.map((user, idx) => {
                              let rankBadge = "🎖️";
                              if (idx === 0) rankBadge = "🥇 1st";
                              if (idx === 1) rankBadge = "🥈 2nd";
                              if (idx === 2) rankBadge = "🥉 3rd";

                              return (
                                <div key={idx} className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:bg-white/[0.04] transition-all">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px]">{rankBadge}</span>
                                      <span className="text-white font-bold">{user.name}</span>
                                    </div>
                                    <span className="text-[8px] font-black uppercase text-teal-400 block tracking-wider font-mono">
                                      {user.badge}
                                    </span>
                                  </div>
                                  <span className="font-mono text-amber-450 text-xs font-extrabold">{user.points} pts</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500 text-center py-6">No leaderboard rankings available yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* LIVE MAP TAB */}
            {activeTab === "map" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl md:text-3xl font-syne font-extrabold uppercase text-white mb-1">
                    📍 Live Coordinate Map
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">A digital pinboard map showing places in the itinerary. Click markers for details.</p>
                </div>
                {trip.mapPins && trip.mapPins.length > 0 ? (
                  <MapErrorBoundary>
                    <TripMap pins={trip.mapPins} />
                  </MapErrorBoundary>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white/[0.01] rounded-2xl border border-white/5">
                    <p>No map pins found for this itinerary.</p>
                  </div>
                )}
              </div>
            )}

            {/* BUDGET & ITEMS TAB */}
            {activeTab === "budget" && (
              <div className="space-y-8 text-left">
                
                {/* Weather & Packing Advisory Banner */}
                {(() => {
                  const weather = getDestinationWeather();
                  return (
                    <div className="bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border border-teal-500/20 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌤️</span>
                          <h3 className="font-syne font-black text-sm uppercase text-teal-400 tracking-wider">
                            Climate & Packing Vane — {trip.destination}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                          {weather.desc}
                        </p>
                      </div>
                      <div className="bg-teal-500/10 border border-teal-500/20 px-4 py-2.5 rounded-2xl font-mono text-center shrink-0">
                        <span className="text-[10px] block text-teal-450 uppercase font-black tracking-wider">Current Forecast</span>
                        <span className="text-xl font-extrabold text-white">{weather.temp}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Grid layout splitting Costs/Packing list & Group Expense Splitter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Cost Breakdown & Packing Checklist (7 cols) */}
                  <div className="lg:col-span-7 space-y-8">
                    
                    {/* Cost Breakdown */}
                    <div className="space-y-4">
                      <h2 className="text-lg md:text-xl font-syne font-black uppercase text-white tracking-wide">
                        💳 Cost Breakdown
                      </h2>
                      {trip.budgetBreakdown ? (
                        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4 shadow-lg">
                          {(() => {
                            const b = trip.budgetBreakdown;
                            const total = (b.stay || 0) + (b.food || 0) + (b.transport || 0) + (b.activities || 0) + (b.miscellaneous || 0);
                            return (
                              <>
                                <div className="space-y-3 font-mono text-xs">
                                  <div className="flex justify-between text-gray-400">
                                    <span>🏠 Accommodations</span>
                                    <span className="font-extrabold text-white">₹{b.stay || 0}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>🍔 Food & Dining</span>
                                    <span className="font-extrabold text-white">₹{b.food || 0}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>🚕 Local/Rail Transit</span>
                                    <span className="font-extrabold text-white">₹{b.transport || 0}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>🎟️ Entry fees/Tickets</span>
                                    <span className="font-extrabold text-white">₹{b.activities || 0}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>🎒 Miscellaneous</span>
                                    <span className="font-extrabold text-white">₹{b.miscellaneous || 0}</span>
                                  </div>
                                </div>
                                <div className="border-t border-white/5 pt-4 flex justify-between items-center font-syne">
                                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Total Estimate</span>
                                  <span className="text-xl font-black text-amber-400">₹{total}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs">No budget breakdown available.</p>
                      )}
                    </div>

                    {/* Packing list */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h2 className="text-lg md:text-xl font-syne font-black uppercase text-white tracking-wide">
                          🎒 Packing Checklist
                        </h2>
                        {trip.packingList && trip.packingList.length > 0 && (() => {
                          const totalItems = trip.packingList.length;
                          const checkedCount = Object.values(packedItems).filter(Boolean).length;
                          const progressPercent = Math.round((checkedCount / totalItems) * 100);
                          return (
                            <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/10">
                              Packed: {checkedCount}/{totalItems} ({progressPercent}%)
                            </span>
                          );
                        })()}
                      </div>
                      
                      {trip.packingList && trip.packingList.length > 0 ? (
                        <div className="bg-amber-400/[0.01] border border-amber-400/10 rounded-2xl p-6 shadow-lg space-y-4">
                          {/* Progress Bar (Glow effect) */}
                          {(() => {
                            const totalItems = trip.packingList.length;
                            const checkedCount = Object.values(packedItems).filter(Boolean).length;
                            const progressPercent = Math.round((checkedCount / totalItems) * 100);
                            return (
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                <div
                                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            );
                          })()}

                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold">
                            {trip.packingList.map((item, idx) => {
                              const isChecked = !!packedItems[idx];
                              return (
                                <li
                                  key={idx}
                                  onClick={() => setPackedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                  className={`flex items-center gap-3 text-xs cursor-none select-none p-2 rounded-xl border border-transparent hover:bg-white/[0.02] hover:border-white/5 transition-all ${
                                    isChecked ? "text-gray-500 line-through opacity-60" : "text-gray-300"
                                  }`}
                                >
                                  {/* Custom Checkbox */}
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                    isChecked
                                      ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                      : "border-white/10 hover:border-white/20"
                                  }`}>
                                    {isChecked && <span className="text-[10px] font-black">✓</span>}
                                  </div>
                                  <span>{item}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-550 text-xs">No packing recommendations generated.</p>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Group Expense Splitter widget (5 cols) (Hidden on print) */}
                  <div className="lg:col-span-5 bg-gray-900/30 border border-white/5 p-6 rounded-3xl shadow-xl space-y-6 relative overflow-hidden no-print">
                    <div className="absolute -inset-px bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                    
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="font-syne font-black text-sm uppercase text-amber-400 tracking-wider flex items-center gap-2">
                        💸 Group Expense Splitter
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1">Split expenses easily among co-travelers</p>
                    </div>

                    {/* Expense Inputs */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!expenseForm.desc || !expenseForm.amount || !expenseForm.paidBy) return;
                        setExpenses([
                          ...expenses,
                          {
                            desc: expenseForm.desc,
                            amount: parseFloat(expenseForm.amount),
                            paidBy: expenseForm.paidBy.trim()
                          }
                        ]);
                        setExpenseForm({ desc: "", amount: "", paidBy: expenseForm.paidBy }); // Keep payer name for fast entry
                      }}
                      className="space-y-3.5"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Paid By (e.g. Aman)"
                          value={expenseForm.paidBy}
                          onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                          className="px-3.5 py-2.5 bg-gray-950/70 border border-white/5 rounded-xl focus:outline-none focus:border-amber-400/40 text-white text-xs font-semibold cursor-none"
                        />
                        <input
                          type="number"
                          placeholder="Amount (₹)"
                          min="1"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          className="px-3.5 py-2.5 bg-gray-950/70 border border-white/5 rounded-xl focus:outline-none focus:border-amber-400/40 text-white text-xs font-mono font-bold cursor-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="What was this spent on? (e.g. Dinner, Taxi)"
                          value={expenseForm.desc}
                          onChange={(e) => setExpenseForm({ ...expenseForm, desc: e.target.value })}
                          className="flex-1 px-3.5 py-2.5 bg-gray-950/70 border border-white/5 rounded-xl focus:outline-none focus:border-amber-400/40 text-white text-xs font-semibold cursor-none"
                        />
                        <button
                          type="submit"
                          className="bg-amber-400 text-teal-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-350 cursor-none shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    </form>

                    {/* Expense Logs */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-widest block">
                        Expense Log ({expenses.length})
                      </span>
                      {expenses.length > 0 ? (
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {expenses.map((exp, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-xs font-semibold">
                              <div className="space-y-0.5">
                                <span className="text-white font-bold text-xs">{exp.desc}</span>
                                <span className="text-[9px] text-gray-500 block uppercase font-black font-mono">Paid by {exp.paidBy}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-white text-xs">₹{exp.amount}</span>
                                <button
                                  onClick={() => setExpenses(expenses.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-300 text-[10px] cursor-none"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-500 italic py-2">No custom expenses added yet.</p>
                      )}
                    </div>

                    {/* Settlement sheets */}
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block">
                        Balances & Settlements
                      </span>

                      {(() => {
                        const { total, perPerson, settlements } = calculateSettlements();
                        if (expenses.length === 0) {
                          return <p className="text-[11px] text-gray-500 italic">Add expenses above to calculate settlements.</p>;
                        }
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between text-[11px] text-gray-400 font-mono font-bold bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                              <span>Total Spent: <span className="text-white">₹{total}</span></span>
                              <span>Share/Person: <span className="text-white">₹{perPerson}</span></span>
                            </div>
                            
                            {settlements.length > 0 ? (
                              <div className="space-y-2">
                                {settlements.map((s, idx) => (
                                  <div key={idx} className="bg-teal-500/5 border border-teal-500/10 p-3 rounded-xl text-teal-300 text-xs font-semibold">
                                    👉 <span className="font-bold text-white">{s.from}</span> owes <span className="font-bold text-white">{s.to}</span> <span className="text-amber-400 font-extrabold">₹{s.amount}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-emerald-400 text-xs font-semibold text-center">
                                All expenses balanced! No debts outstanding.
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6">
          <h2 className="text-2xl font-syne font-extrabold uppercase text-white">Itinerary Details</h2>
          <div className="prose max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
            {trip.itinerary || trip.rawTextItinerary}
          </div>
        </div>
      )}

      {/* SUBMIT LOCAL GEM MODAL */}
      {openGemModal && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setOpenGemModal(false)}
              className="absolute top-4 right-4 z-50 text-white hover:text-amber-450 text-lg p-1"
            >
              ✕
            </button>
            <div className="p-6 md:p-8 space-y-6 text-left">
              <div className="space-y-1">
                <h3 className="text-lg font-syne font-extrabold uppercase text-white">Share a Hidden Gem</h3>
                <p className="text-gray-400 text-xs">Help other travelers discover offbeat places and get rewarded with 50 points!</p>
              </div>

              <form onSubmit={handleSubmittingGem} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={gemForm.contributorName}
                    onChange={(e) => setGemForm({ ...gemForm, contributorName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-1.5">
                    Gem Attraction Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Secret Sunset Cliff"
                    value={gemForm.name}
                    onChange={(e) => setGemForm({ ...gemForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-1.5">
                    Location Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. South Vagator, Goa"
                    value={gemForm.area}
                    onChange={(e) => setGemForm({ ...gemForm, area: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-1.5">
                    Why visit? Review & Safety advice
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe how to go, what is special, and solo-traveler safety indexes."
                    value={gemForm.review}
                    onChange={(e) => setGemForm({ ...gemForm, review: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-405 mb-1.5">
                    Attach Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setGemForm({ ...gemForm, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 cursor-none"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setOpenGemModal(false)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-450 text-teal-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 shadow-md shadow-amber-500/10"
                  >
                    Submit & Earn Points
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PRINT-ONLY COMPLETE ITINERARY REPORT (A to Z Guide Book) */}
      <div className="print-only hidden space-y-8 text-left text-gray-950 bg-white p-8">
        
        {/* Print Header */}
        <div className="border-b-4 border-teal-700 pb-4 mb-6">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-teal-800">
            TRAVELYATRI AI Travel Companion
          </h1>
          <p className="text-sm font-semibold text-gray-600">
            Your Regret-Free Travel Plan to {trip.destination}
          </p>
          <div className="grid grid-cols-4 gap-4 mt-4 text-xs font-mono text-gray-705">
            <div><strong>Origin:</strong> {trip.startLocation || "Lucknow"}</div>
            <div><strong>Duration:</strong> {trip.days} Days</div>
            <div><strong>Budget Tier:</strong> {trip.budget}</div>
            <div><strong>Travelers:</strong> {trip.travelers}</div>
          </div>
        </div>

        {/* 1. Day-by-Day Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2">
            📅 Day-by-Day Timeline
          </h2>
          {localItinerary.map((day, idx) => (
            <div key={idx} className="space-y-3 avoid-page-break">
              <h3 className="text-sm font-extrabold text-teal-700 uppercase">
                Day {day.dayNumber}: {day.theme || "Sightseeing & Explore"}
              </h3>
              <div className="pl-4 border-l-2 border-teal-500/30 space-y-4">
                {day.activities.map((act, actIdx) => (
                  <div key={actIdx} className="text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-gray-800">
                      <span>⏰ {act.time} - {act.title}</span>
                      {act.cost > 0 && <span className="text-amber-700 font-mono font-bold">(Est: ₹{act.cost})</span>}
                    </div>
                    <p className="text-gray-600 font-medium">{act.description}</p>
                    {act.safetyTip && (
                      <p className="text-amber-750 font-semibold italic bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        🛡️ Safety: {act.safetyTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 2. Railway Schedules */}
        {trip.trains && trip.trains.length > 0 && (
          <div className="space-y-4 page-break-before">
            <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2">
              🚆 Recommended Railway Options
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {trip.trains.map((train, idx) => (
                <div key={idx} className="border border-gray-300 p-4 rounded-xl text-xs space-y-2 avoid-page-break">
                  <h3 className="font-bold text-gray-800">{train.trainName} (Train #{train.trainNo})</h3>
                  <p className="text-gray-600 font-mono">
                    {train.departureTime} ➜ {train.arrivalTime} ({train.duration})
                  </p>
                  <p className="text-gray-600">
                    <strong>Class:</strong> {train.classRecommend} | <strong>Fare:</strong> ₹{train.approxFare}
                  </p>
                  <p className="text-emerald-700 font-semibold">Security Check: {train.safeRating || "Safe Transit"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Safe Stays & Transit */}
        <div className="space-y-6 page-break-before">
          <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2">
            🏠 Recommended Lodging & Local Transits
          </h2>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-teal-700 border-b border-gray-100 pb-1">Lodging Options</h3>
            <div className="grid grid-cols-2 gap-4">
              {trip.accommodations && trip.accommodations.map((acc, idx) => (
                <div key={idx} className="border border-gray-300 p-4 rounded-xl text-xs space-y-1 avoid-page-break">
                  <h4 className="font-bold text-gray-800">{acc.name} ({acc.type})</h4>
                  <p className="text-teal-750 font-semibold">Area: {acc.area}</p>
                  <p className="text-gray-600 font-medium">{acc.reason}</p>
                  <p className="font-bold text-amber-700">{acc.approxPriceRange}</p>
                  <p className="text-emerald-700 font-semibold text-[10px]">Security: {acc.safeForSoloTravelers || "Highly Safe"}</p>
                </div>
              ))}
            </div>
          </div>

          {trip.localTransport && trip.localTransport.length > 0 && (
            <div className="space-y-4 pt-4 avoid-page-break">
              <h3 className="text-sm font-bold text-teal-700 border-b border-gray-100 pb-1">Local Transport Guides</h3>
              <div className="grid grid-cols-2 gap-4">
                {trip.localTransport.map((trans, idx) => (
                  <div key={idx} className="border border-gray-300 p-4 rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-gray-800">{trans.mode}</h4>
                    <p className="text-gray-600">Cost: {trans.costEstimate}</p>
                    <p className="text-gray-650 font-medium">{trans.description}</p>
                    {trans.safetyTip && <p className="italic text-amber-750 font-semibold">Safety: {trans.safetyTip}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Budget & Packing Checklist */}
        <div className="grid grid-cols-2 gap-6 page-break-before">
          <div>
            <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2 mb-4">
              💳 Budget Allocation
            </h2>
            {trip.budgetBreakdown && (
              <div className="border border-gray-300 p-4 rounded-xl text-xs space-y-2 font-mono text-gray-700">
                <div>Accommodations: ₹{trip.budgetBreakdown.stay || 0}</div>
                <div>Food & Dining: ₹{trip.budgetBreakdown.food || 0}</div>
                <div>Transit & Travel: ₹{trip.budgetBreakdown.transport || 0}</div>
                <div>Tickets & Entry: ₹{trip.budgetBreakdown.activities || 0}</div>
                <div>Miscellaneous: ₹{trip.budgetBreakdown.miscellaneous || 0}</div>
                <div className="border-t border-gray-300 pt-2 font-bold text-teal-800 text-sm">
                  Total Budget: ₹{
                    (trip.budgetBreakdown.stay || 0) + 
                    (trip.budgetBreakdown.food || 0) + 
                    (trip.budgetBreakdown.transport || 0) + 
                    (trip.budgetBreakdown.activities || 0) + 
                    (trip.budgetBreakdown.miscellaneous || 0)
                  }
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2 mb-4">
              🎒 Packing Checklist
            </h2>
            <ul className="list-disc pl-5 text-xs space-y-2 text-gray-700 font-medium">
              {trip.packingList && trip.packingList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Local Community Contributed Gems */}
        {communityGems && communityGems.length > 0 && (
          <div className="space-y-4 page-break-before">
            <h2 className="text-xl font-bold text-teal-800 border-b-2 border-gray-200 pb-2">
              💎 Local Contributor Gems
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {communityGems.map((gem, idx) => (
                <div key={idx} className="border border-gray-300 p-4 rounded-xl text-xs avoid-page-break">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">{gem.name}</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                      📍 {gem.area}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">"{gem.review}"</p>
                  <p className="text-[9px] text-gray-500 mt-2 font-mono">Verified Local: {gem.contributorName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-4 mt-12 justify-center flex-wrap no-print">
        <Link
          to="/saved"
          className="bg-white/5 text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          📁 Saved Journeys
        </Link>
        <Link
          to="/plan"
          className="bg-teal-700 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-650 transition-colors shadow-lg shadow-teal-700/10"
        >
          ✈️ Plan Another Trip
        </Link>
      </div>
    </div>
  );
}

export default Results;
