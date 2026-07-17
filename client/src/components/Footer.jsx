import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  // Modal State
  const [activeModal, setActiveModal] = useState(null);

  // Modal Copy Data
  const modalContentMap = {
    aiPlanner: {
      title: "🤖 AI Planner",
      content: "India's first single-line travel engine. Enter phrases like 'Lucknow se Gujarat, 5 din' and get a complete, structured day-by-day timeline instantly without browsing 50 different tabs."
    },
    savedTrips: {
      title: "📁 Saved Trips",
      content: "Your personal travel vault. Access your pre-planned itineraries, check offline routing details, and track your active journeys even when you are low on network."
    },
    localGems: {
      title: "💎 Local Gems",
      content: "Say goodbye to corporate paid reviews. Explore raw, hidden spots, authentic local food joints, and secret shortcuts crowdsourced directly from people who live there."
    },
    localContributors: {
      title: "🏅 Local Contributors",
      content: "The heart of TravelYatri. A self-sustaining network where real locals contribute verified ground reality data, earn reward points, and unlock sponsored trips."
    },
    aboutUs: {
      title: "ℹ️ About TravelYatri",
      content: "Hazaron travel websites hain, par ghumne ka plan banana aaj bhi ek jhanjhat hai. TravelYatri ek tools ka generic bundle nahi hai—yeh ek travel intelligence ecosystem hai jo planning fatigue aur outdated online reviews ki samasya ko solve karta hai. We combine generative AI with a community reward model to give you 100% authentic, regret-free journeys. Developed with ❤️ by Aman Jaiswal."
    },
    contactSupport: {
      title: "✉️ Contact Support",
      content: "Got feedback, found a bug, or want to join as a local contributor? Drop a line at support@travelyatri.com. We respond faster than a local train."
    },
    privacyPolicy: {
      title: "🛡️ Privacy Policy",
      content: "We respect your data. Your planned trips, destination queries, and local uploads are securely stored and never sold to third-party ad networks. Safe travel, safe data."
    },
    termsOfService: {
      title: "📝 Terms of Service",
      content: "TravelYatri is built for explorers. While our AI and local contributors work hard to provide highly accurate routes and budget estimates, we advise checking live platform schedules before departure."
    },
    itineraryPlannerIndia: {
      title: "🗺️ Best Itinerary Planner India",
      content: "Our routing algorithms calculate connectivity, coordinate train listings, and map sightseeing pins across major tourist circuits. Click below to test compile a 7-day heritage trip to Rajasthan!",
      action: { label: "Plan 7-Day Rajasthan Trip 🎒", link: "/plan?destination=Rajasthan&days=7" }
    },
    femaleSafety: {
      title: "🛡️ Solo Female Travel Safety",
      content: "TravelYatri filters stay picks and transit modes based on ground safety indexes. We highlight verified female-only hostel dorms, dedicated train coaches, and well-lit routes. Click below to plan a safe Kerala solo trip!",
      action: { label: "Plan Safe Kerala Trip 🌴", link: "/plan?destination=Kerala&travelers=Solo%20Female&days=5" }
    },
    irctcSchedules: {
      title: "🚆 IRCTC Railway Schedules",
      content: "We map optimal train schedules, recommend travel classes (e.g. 3A), calculate approximate fares, and check safety parameters to streamline your IRCTC railway bookings."
    },
    safeStays: {
      title: "🏠 Safe Stay Recommendations",
      content: "Instead of commercial listings, we prioritize social hostels, safe homestays, and community-recommended accommodations vetted directly by our network of local contributors."
    }
  };

  const openInfoModal = (key) => {
    setActiveModal(modalContentMap[key] || null);
  };

  return (
    <footer className="bg-gray-950 border-t border-white/5 py-16 mt-24 relative z-10 text-left no-print">
      {/* Subtle bottom glowing mesh */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        
        {/* Brand Column (Left - 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:rotate-[25deg] transition-transform duration-300">🎒</span>
            <span className="text-xl font-syne font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Travel</span>
              <span className="text-amber-400">Yatri</span>
            </span>
          </Link>
          <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-teal-400">
            YOUR REGRET-FREE TRAVEL COMPANION
          </p>
          <p className="text-xs text-gray-450 leading-relaxed max-w-sm font-medium">
            "Plan smarter, travel safer, and eliminate planning fatigue. TravelYatri uses Agentic AI to coordinate itineraries, train routing, and budget constraints in seconds, backed by authentic ground-level insights from real local communities."
          </p>
        </div>

        {/* Space Spacer (1 col) */}
        <div className="hidden lg:block lg:col-span-1" />

        {/* Product Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Product
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => openInfoModal("aiPlanner")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                AI Planner
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("savedTrips")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Saved Trips
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("localGems")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Local Gems
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("localContributors")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Local Contributors
              </button>
            </li>
          </ul>
        </div>

        {/* Company Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Company
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => openInfoModal("aboutUs")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("contactSupport")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Contact Support
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("privacyPolicy")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("termsOfService")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Terms of Service
              </button>
            </li>
          </ul>
        </div>

        {/* Popular Searches Column (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Popular Searches
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => openInfoModal("itineraryPlannerIndia")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Best itinerary planner India
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("femaleSafety")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Solo female travel safety
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("irctcSchedules")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                IRCTC railway schedules
              </button>
            </li>
            <li>
              <button onClick={() => openInfoModal("safeStays")} className="text-gray-400 hover:text-white transition-colors cursor-none text-left">
                Safe stay recommendations
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">
        <div>
          © 2026 TravelYatri. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span>Built for Regret-Free Adventures</span>
          <span>•</span>
          <span>India Travel Intelligence</span>
        </div>
      </div>

      {/* DYNAMIC INFORMATION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-gray-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8 space-y-6 text-left animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-400 text-lg p-1.5 transition-colors cursor-none"
            >
              ✕
            </button>

            <div className="space-y-2">
              <h3 className="text-lg font-syne font-black uppercase text-white tracking-wide">
                {activeModal.title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                {activeModal.content}
              </p>
            </div>

            {/* If there is a quick link trigger action */}
            {activeModal.action ? (
              <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase text-white cursor-none"
                >
                  Close
                </button>
                <Link
                  to={activeModal.action.link}
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-amber-450 hover:bg-amber-400 text-teal-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-none"
                >
                  {activeModal.action.label}
                </Link>
              </div>
            ) : (
              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-650 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-none"
                >
                  Got It
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
