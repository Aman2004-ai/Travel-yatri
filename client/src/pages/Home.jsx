import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  // Accordion state for the interactive preview card on the right
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  
  // Modal state for the Curated Destination blogs (TripAdvisor style)
  const [selectedExperience, setSelectedExperience] = useState(null);

  const previewItems = [
    {
      title: "Sabarmati Ashram Visit",
      emoji: "🕌",
      tag: "Necessary",
      tagColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
      desc: "Quiet ghats, rich history. Perfect morning check-in to escape mid-day heat.",
      timing: "⏰ 09:00 AM - 11:30 AM",
      safety: "🛡️ Highly Safe Zone (Active security)",
      cost: "Free Entry",
    },
    {
      title: "Law Garden Street Market",
      emoji: "🛍️",
      tag: "Optional",
      tagColor: "bg-amber-500/20 border-amber-500/30 text-amber-400",
      desc: "Go only if you want to buy traditional handicrafts, bandhani sarees, and street food.",
      timing: "⏰ 06:00 PM - 09:30 PM",
      safety: "🛡️ Crowded (Watch for pickpockets)",
      cost: "Est: ₹200 - ₹500",
    },
    {
      title: "Commercial Traffic Malls",
      emoji: "🗼",
      tag: "Skip",
      tagColor: "bg-red-500/20 border-red-500/30 text-red-400",
      desc: "Sells standard items that you can find anywhere else. Heavy city traffic, massive skip on short 5-day trips.",
      timing: "⏰ Avoid afternoon rush",
      safety: "🛡️ Safe but very congested",
      cost: "Waste of Time",
    },
  ];

  const features = [
    { icon: "🤖", title: "AI-Powered End-to-End Plans", desc: "Get day-by-day itineraries, safe stay areas, and local transport options in one click." },
    { icon: "🛡️", title: "Safety First (Solo Friendly)", desc: "Specially curated local transport tips and safety ratings for solo or female travelers." },
    { icon: "🚆", title: "Smart Train Suggestions", desc: "Know the best trains, timings, recommended classes, and average ticket costs." },
    { icon: "📍", title: "Interactive Pinboard Maps", desc: "Every key destination and activity mapped visually via OpenStreetMap/Leaflet." },
  ];

  // Detailed Experiential blog guides (TripAdvisor style)
  const featuredExperiences = [
    {
      title: "Ladakh Mountain Trails",
      tag: "Adventure",
      tagBg: "bg-teal-500/20 border-teal-500/35 text-teal-350",
      image: "/images/ladakh.jpg",
      difficulty: "Hard Terrain",
      season: "June to September",
      safetyIndex: "Highly Secure (Border checks present)",
      safetyTip: "High Altitude: rest 24h on arrival to prevent acute mountain sickness (AMS).",
      intro: "Known as the 'Land of High Passes', Ladakh is a cold desert in India's Jammu & Kashmir region. Surrounded by rugged valleys and barren mountains, it is a dream destination for adventure enthusiasts and spiritual seekers alike.",
      attractions: [
        { name: "Pangong Tso Lake", emoji: "🌊", desc: "A breathtaking high-altitude endorheic lake famous for changing its color from turquoise to deep blue." },
        { name: "Khardung La Pass", emoji: "🏔️", desc: "One of the world's highest motorable passes at 17,582 ft, offering majestic views of the Karakoram range." },
        { name: "Thiksey Monastery", emoji: "🕌", desc: "A magnificent twelve-story Tibetan Buddhist complex resembling Tibet's Potala Palace." }
      ],
      foods: [
        { name: "Thukpa", desc: "Warm Tibetan noodle soup packed with fresh local vegetables." },
        { name: "Skyu", desc: "Traditional Ladakh pasta dish slow-cooked with root veggies." },
        { name: "Kahwa", desc: "Himalayan green tea infused with saffron, cardamom, and almonds." }
      ]
    },
    {
      title: "Kerala Backwater Serenity",
      tag: "Serene & Stays",
      tagBg: "bg-emerald-500/20 border-emerald-500/35 text-emerald-350",
      image: "/images/kerala.jpg",
      difficulty: "Easy Comfort",
      season: "September to March",
      safetyIndex: "Very Safe (Tourist-friendly locals)",
      safetyTip: "Always verify licensed houseboats carrying DTPC approval tags to prevent pricing scams.",
      intro: "Kerala, famously called 'God's Own Country', is a serene tropical paradise. Its network of brackish lagoons, palm-fringed canals, and traditional villages offers a slow-paced escape from chaotic urban life.",
      attractions: [
        { name: "Alleppey Houseboats", emoji: "⛵", desc: "Rent a luxury thatch-roofed Kettuvallam and glide slowly through the coconut-groved canals." },
        { name: "Munnar Tea Estates", emoji: "🍃", desc: "Verdant green hills carpeted with tea plantations, offering cool weather and nature trails." },
        { name: "Varkala Cliff Beach", emoji: "🏖️", desc: "Unique geological cliffs directly overlooking the Arabian sea, with active seaside cafes." }
      ],
      foods: [
        { name: "Karimeen Pollichathu", desc: "Pearl spot fish marinated in spices and grilled inside a banana leaf." },
        { name: "Idiyappam with Curry", desc: "Steamed rice noodles served with aromatic coconut veg/chicken stew." },
        { name: "Sadya Feast", desc: "A massive multi-course vegetarian banquet served on a banana leaf." }
      ]
    },
    {
      title: "Varanasi Ganges Aarti",
      tag: "Spiritual Culture",
      tagBg: "bg-amber-500/20 border-amber-500/35 text-amber-350",
      image: "/images/varanasi.jpg",
      difficulty: "Moderate Crowds",
      season: "October to March",
      safetyIndex: "Moderate (Be alert at crowded ghats)",
      safetyTip: "Pre-negotiate boat fares before boarding. Avoid walking in isolated alleys after dark.",
      intro: "Varanasi is one of the oldest continuously inhabited cities in the world. Located on the banks of the sacred river Ganges, it represents the spiritual heart of India, where ancient rituals are practiced daily.",
      attractions: [
        { name: "Dashashwamedh Ghat", emoji: "🔥", desc: "The main ghat where the legendary Ganga Aarti (evening fire ritual) takes place with chants." },
        { name: "Kashi Vishwanath Temple", emoji: "🏰", desc: "The ancient gold-plated spire temple dedicated to Lord Shiva, featuring high cultural significance." },
        { name: "Sarnath Buddhist Site", emoji: "🧘", desc: "The peaceful park outside the city where Gautama Buddha gave his first sermon after enlightenment." }
      ],
      foods: [
        { name: "Kachori Sabzi", desc: "Flaky fried bread filled with lentils, served with spicy potato curry." },
        { name: "Tamatar Chaat", desc: "Varanasi's signature savory tomato snack topped with sugar syrup." },
        { name: "Banarasi Lassi", desc: "Thick, creamy yogurt drink topped with rabri, malai, and pistachios." }
      ]
    },
    {
      title: "Goa Coastal Escapes",
      tag: "Leisure Retreat",
      tagBg: "bg-violet-500/20 border-violet-500/35 text-violet-350",
      image: "/images/goa.jpg",
      difficulty: "Relaxed Vibe",
      season: "November to February",
      safetyIndex: "Safe (High tourist patrol)",
      safetyTip: "Stick to populated beaches; do not go swimming during high tide or after consuming alcohol.",
      intro: "Goa is India's pocket-sized paradise on the western coast. Renowned for its pristine sandy beaches, active shacks, historic Portuguese churches, and lush spice plantations.",
      attractions: [
        { name: "Palolem Crescent Beach", emoji: "🌴", desc: "A scenic beach in South Goa known for its calm waters, beach huts, and dolphin boat rides." },
        { name: "Dudhsagar Waterfalls", emoji: "💦", desc: "A massive four-tiered waterfall cascading down the forested mountains of the Western Ghats." },
        { name: "Fort Aguada", emoji: "🏰", desc: "A preserved 17th-century Portuguese fortress and lighthouse overlooking the Arabian Sea." }
      ],
      foods: [
        { name: "Goan Fish Curry", desc: "Fresh fish slow-cooked in a tangy, spicy coconut and tamarind gravy." },
        { name: "Bebinca", desc: "Traditional multi-layered Goan cake made with coconut milk and eggs." },
        { name: "Rava Fried Prawns", desc: "Crispy semolina-coated prawns fried with local Goan spices." }
      ]
    },
  ];

  const popularDestinations = [
    { name: "Goa", emoji: "🏖️", type: "Beach & Party" },
    { name: "Manali", emoji: "🏔️", type: "Mountains & Snow" },
    { name: "Jaipur", emoji: "🏰", type: "Heritage & Culture" },
    { name: "Kerala", emoji: "🌴", type: "Backwaters & Nature" },
    { name: "Varanasi", emoji: "🕌", type: "Spiritual & Ghats" },
    { name: "Ladakh", emoji: "🌄", type: "Adventure & Valleys" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-150 overflow-hidden relative pb-20">
      
      {/* Cinematic Hero Background Image with low-opacity overlay (IndRoute Style) */}
      <div className="absolute top-0 left-0 right-0 h-[650px] md:h-[750px] z-0 overflow-hidden select-none pointer-events-none">
        <img
          src="/images/hero_bg.jpg"
          alt="Scenic Varanasi Ghats sunrise travel companion backdrop"
          className="w-full h-full object-cover opacity-20"
        />
        {/* Deep mesh gradient to blend it smoothly into the obsidian dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-transparent" />
      </div>

      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none animate-float-1 z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none animate-float-2 z-0" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[125px] pointer-events-none animate-float-3 z-0" />

      {/* Kinetic Big Header Background (Outline text style) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[15vw] font-syne font-black text-white/[0.015] border-text border-white/[0.02] uppercase tracking-widest whitespace-nowrap z-0">
        TRAVELYATRI
      </div>

      {/* Hero / Landing Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-28 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-teal-400 uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
            Your Regret-Free Travel Companion
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-syne font-black tracking-tight leading-none uppercase">
              Bina Jhanjhat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-amber-400 to-orange-500">
                Travel Planning
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-xl font-normal leading-relaxed">
              Why browse 20 sites? TravelYatri handles the logistics. We generate structured timelines, train schedules, lodging details, local transport guidelines, and maps in seconds.
            </p>
          </div>

          {/* Interactive Button Group with Glow */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/plan"
              className="bg-amber-400 text-teal-950 font-extrabold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:bg-amber-400 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Plan A Trip Now →
            </Link>
            <Link
              to="/saved"
              className="bg-white/5 text-white border border-white/10 font-bold px-6 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              📁 Saved Trips
            </Link>
          </div>
        </div>

        {/* Right Side: Collapsible Mockup Preview Card */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-40 transition duration-1000" />
          
          <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 transform hover:scale-[1.01] hover:-rotate-0.5 transition-all duration-555">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">Gujarat Solo Trip — Day 2</h3>
                <p className="text-[10px] text-teal-400 font-bold uppercase mt-0.5">Culture & Comfort</p>
              </div>
              <span className="bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-teal-500/20">
                Tap to Expand
              </span>
            </div>

            <div className="space-y-3">
              {previewItems.map((item, idx) => {
                const isOpen = activePreviewIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActivePreviewIndex(isOpen ? -1 : idx)}
                    className={`border rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
                      isOpen
                        ? "bg-white/10 border-teal-500/30"
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Collapsed Header */}
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{item.emoji}</span> {item.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${item.tagColor}`}>
                          {item.tag}
                        </span>
                        <span className={`text-gray-500 text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Expandable Details Container */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isOpen ? "max-h-[200px] mt-3 pt-3 border-t border-white/5 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[11px] text-gray-300 leading-relaxed mb-3">{item.desc}</p>
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-amber-400">
                        <div>
                          <span className="text-gray-500 block uppercase text-[8px]">Schedule</span>
                          <span>{item.timing}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block uppercase text-[8px]">Budget Info</span>
                          <span>{item.cost}</span>
                        </div>
                        <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                          <span className="text-gray-500 block uppercase text-[8px]">Security index</span>
                          <span className="text-emerald-400 font-semibold">{item.safety}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CURATED FEATURED PHOTO EXPERIENCES SECTION */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-36 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            Featured Experiences
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-black uppercase text-white tracking-tight">
            Curated Indian Retreats
          </h2>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
            Click on any card to explore TripAdvisor-style travel blogs, top sights, local cuisines, and safety advisories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredExperiences.map((exp, i) => (
            <div
              key={i}
              onClick={() => setSelectedExperience(exp)}
              className="bg-gray-900/30 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden hover:border-amber-400/40 hover:bg-gray-900/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between cursor-pointer"
            >
              {/* Photo Box */}
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                <span className={`absolute top-4 left-4 text-[9px] font-black uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${exp.tagBg}`}>
                  {exp.tag}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                    {exp.intro}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-bold uppercase">Difficulty:</span>
                    <span className="text-white font-mono">{exp.difficulty}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-amber-400 font-bold block mb-0.5">🛡️ Safety Advisory:</span>
                    <span className="text-gray-300 leading-normal line-clamp-1">{exp.safetyTip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRIPADVISOR-STYLE BLOG MODAL */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedExperience(null)}
              className="absolute top-4 right-4 z-50 bg-gray-950/60 border border-white/10 text-white hover:text-amber-400 p-2.5 rounded-full transition-colors backdrop-blur-md"
            >
              ✕
            </button>

            {/* Banner Image */}
            <div className="h-56 md:h-72 w-full relative overflow-hidden shrink-0">
              <img
                src={selectedExperience.image}
                alt={selectedExperience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-teal-500 text-teal-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md mb-2 inline-block">
                  Featured Destination
                </span>
                <h2 className="text-2xl md:text-4xl font-syne font-black uppercase text-white leading-none">
                  {selectedExperience.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Blog Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/5 pb-6 font-mono text-[10px]">
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-gray-500 block uppercase mb-1">Best Season</span>
                  <span className="text-white font-bold">{selectedExperience.season}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-gray-500 block uppercase mb-1">Terrain Difficulty</span>
                  <span className="text-white font-bold">{selectedExperience.difficulty}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-gray-500 block uppercase mb-1">Security Score</span>
                  <span className="text-emerald-400 font-bold">{selectedExperience.safetyIndex}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col justify-center">
                  <Link
                    to={`/plan?destination=${selectedExperience.title.split(" ")[0]}`}
                    onClick={() => setSelectedExperience(null)}
                    className="bg-amber-400 hover:bg-amber-300 text-teal-950 text-center font-bold py-2 rounded-xl transition-all"
                  >
                    PLAN TRIP 🎒
                  </Link>
                </div>
              </div>

              {/* Introduction */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-lg">About the Experience</h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
                  {selectedExperience.intro}
                </p>
              </div>

              {/* Sights/Attractions (TripAdvisor Style) */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                  🗺️ Top Tourist Attractions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedExperience.attractions.map((att, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{att.emoji}</span>
                        <h4 className="font-extrabold text-white text-xs leading-tight">{att.name}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal">{att.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culinary Guide */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                  🍲 Local Culinary Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedExperience.foods.map((food, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      <h4 className="font-bold text-amber-400 text-xs mb-1">🍽️ {food.name}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">{food.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Advisory Warning Panel */}
              <div className="bg-amber-500/5 border border-amber-500/20 text-amber-300 rounded-2xl p-4 text-xs space-y-1">
                <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-500">
                  ⚠️ Solo Traveler & Safety Advisory
                </span>
                <p className="leading-relaxed font-medium">
                  {selectedExperience.safetyTip}
                </p>
              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 bg-gray-950/70 border-t border-white/5 flex justify-end gap-3 shrink-0 backdrop-blur-md">
              <button
                onClick={() => setSelectedExperience(null)}
                className="bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Close
              </button>
              <Link
                to={`/plan?destination=${selectedExperience.title.split(" ")[0]}`}
                onClick={() => setSelectedExperience(null)}
                className="bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-lg"
              >
                Generate Custom Itinerary ⚡
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Feature Grid - Deep Textured Obsidian Box */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-36 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-syne font-black uppercase text-white tracking-tight">
            Regret-Free Architecture
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Every feature is designed to reduce decision fatigue, keeping your journey streamlined and highly secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-gray-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(20,184,166,0.05)] group/card"
            >
              <div className="text-4xl mb-4 bg-white/5 border border-white/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover/card:bg-teal-500/10 group-hover/card:border-teal-500/20 transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg text-amber-400 mb-2 group-hover/card:text-teal-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Journeys Section */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-36 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-syne font-black uppercase text-white tracking-tight">
            Popular Journeys
          </h2>
          <p className="text-gray-400 text-sm mt-3">Click templates to build customized plans instantly.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest, i) => (
            <Link
              key={i}
              to={`/plan?destination=${dest.name}`}
              className="bg-gray-900/30 backdrop-blur-md rounded-2xl p-5 text-center border border-white/5 hover:border-amber-400/50 hover:bg-gray-900/60 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{dest.emoji}</div>
              <p className="font-extrabold text-white text-sm tracking-wide">{dest.name}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{dest.type}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Solo Female Travel Safety Banner */}
      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10">
        <div className="bg-gradient-to-r from-teal-900/40 via-teal-950/40 to-emerald-950/40 border border-teal-500/20 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 backdrop-blur-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4">
            <span className="inline-block bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-xs uppercase px-3 py-1 rounded-full">
              Safety Optimization
            </span>
            <h2 className="text-2xl md:text-3xl font-syne font-extrabold uppercase">Solo & Female Safety Filters</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              We check safety indices of areas, suggest high-rated lodging (such as Zostel, female-only spaces), and transit suggestions featuring dedicated carriages to make your solo travels completely hassle-free.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/plan"
              className="bg-amber-400 text-teal-950 font-extrabold px-8 py-4 rounded-xl hover:bg-amber-350 transition-all duration-300 block text-center shadow-lg shadow-amber-500/10"
            >
              Plan Solo Journey →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
