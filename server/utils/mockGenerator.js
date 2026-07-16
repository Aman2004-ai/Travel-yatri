const generateMockTrip = (startLocation, destination, days, budget, travelers) => {
  const destLower = destination.toLowerCase();
  
  let lat = 23.0225;
  let lng = 72.5714;
  let points = [
    { name: "City Center", latOffset: 0.0, lngOffset: 0.0, desc: "A bustling central spot to explore local culture." },
    { name: "Historic Museum", latOffset: 0.015, lngOffset: -0.01, desc: "Explore local historical exhibits and arts." },
    { name: "Scenic Park & Lake", latOffset: -0.02, lngOffset: 0.02, desc: "Relaxing views and peaceful evening walks." },
    { name: "Local Street Market", latOffset: 0.01, lngOffset: 0.03, desc: "Famous for traditional shopping and local street food." },
    { name: "Botanical Garden", latOffset: -0.03, lngOffset: -0.02, desc: "A lush green environment with exotic flora." }
  ];

  if (destLower.includes("gujarat") || destLower.includes("ahmedabad")) {
    lat = 23.0225;
    lng = 72.5714;
    points = [
      { name: "Sabarmati Ashram", latOffset: 0.0378, lngOffset: 0.0094, desc: "Tranquil ashram of Mahatma Gandhi by the river." },
      { name: "Adalaj Stepwell", latOffset: 0.1444, lngOffset: 0.0141, desc: "Stunning 5-story deep underground stepwell architecture." },
      { name: "Kankaria Lake", latOffset: -0.0210, lngOffset: 0.0306, desc: "Lively lakefront with recreational activities." },
      { name: "Sidi Saiyyed Mosque", latOffset: 0.0044, lngOffset: -0.0069, desc: "Famous for the intricately carved stone lattice work." }
    ];
  } else if (destLower.includes("jaipur")) {
    lat = 26.9124;
    lng = 75.7873;
    points = [
      { name: "Hawa Mahal", latOffset: 0.0117, lngOffset: 0.0397, desc: "The iconic Palace of Winds with red and pink sandstone." },
      { name: "Amer Fort", latOffset: 0.0735, lngOffset: 0.0527, desc: "Grand hilltop fort complex with scenic views." },
      { name: "City Palace", latOffset: 0.0097, lngOffset: 0.0392, desc: "Royal residence showcasing Rajasthani and Mughal art." },
      { name: "Jantar Mantar", latOffset: 0.0101, lngOffset: 0.0398, desc: "Historic UNESCO observatory with giant stone sundials." }
    ];
  } else if (destLower.includes("manali")) {
    lat = 32.2396;
    lng = 77.1887;
    points = [
      { name: "Hadimba Temple", latOffset: 0.0035, lngOffset: -0.0105, desc: "Wooden temple dedicated to Hadimba Devi, set in pine forests." },
      { name: "Solang Valley", latOffset: 0.0789, lngOffset: -0.0315, desc: "Popular spot for paragliding, skiing, and snow activities." },
      { name: "Old Manali", latOffset: 0.0085, lngOffset: -0.0095, desc: "Charming cafes, narrow lanes, and rustic wooden houses." },
      { name: "Jogini Waterfall", latOffset: 0.0255, lngOffset: 0.0045, desc: "Picturesque waterfall reached via a short, scenic trek." }
    ];
  } else if (destLower.includes("delhi")) {
    lat = 28.6139;
    lng = 77.2090;
    points = [
      { name: "India Gate", latOffset: -0.0017, lngOffset: 0.0195, desc: "War memorial archway surrounded by lawns." },
      { name: "Qutub Minar", latOffset: -0.0911, lngOffset: -0.0210, desc: "Tallest brick minaret in the world, dating back to 1199." },
      { name: "Red Fort", latOffset: 0.0425, lngOffset: 0.0635, desc: "Massive red sandstone fortress of the Mughal empire." },
      { name: "Humayun's Tomb", latOffset: -0.0225, lngOffset: 0.0410, desc: "Beautiful garden tomb precursor to the Taj Mahal." }
    ];
  }

  const mapPins = points.map((p, idx) => ({
    name: p.name,
    lat: Number((lat + p.latOffset).toFixed(4)),
    lng: Number((lng + p.lngOffset).toFixed(4)),
    description: p.desc,
    day: Math.min(Math.floor(idx / 2) + 1, days)
  }));

  const trains = [
    {
      trainNo: "12915",
      trainName: `Express from ${startLocation} to ${destination}`,
      departureTime: "07:30 AM",
      arrivalTime: "10:15 PM",
      duration: "14h 45m",
      classRecommend: "3A (Third AC)",
      safeRating: "Highly Safe / Well Guarded",
      approxFare: budget === "Low" ? 850 : budget === "Medium" ? 1450 : 2200
    },
    {
      trainNo: "22902",
      trainName: `Superfast Route (${startLocation} ➔ ${destination})`,
      departureTime: "09:40 PM",
      arrivalTime: "11:20 AM",
      duration: "13h 40m",
      classRecommend: "2A (Second AC)",
      safeRating: "Safe / CCTVs in coaches",
      approxFare: budget === "Low" ? 950 : budget === "Medium" ? 1650 : 2500
    }
  ];

  const accommodations = [
    {
      name: `Zostel ${destination}`,
      area: "Central safe neighborhood",
      safeForSoloTravelers: "Highly Safe (24/7 Security)",
      type: "Hostel",
      approxPriceRange: budget === "Low" ? "₹600 - ₹900" : budget === "Medium" ? "₹1200 - ₹1800" : "₹2500 - ₹4000",
      reason: "Social atmosphere, modern security card locks, very popular among backpackers."
    },
    {
      name: `${destination} Heritage Inn`,
      area: "Safe tourist corridor",
      safeForSoloTravelers: "Safe (Family-run)",
      type: "Hotel",
      approxPriceRange: budget === "Low" ? "₹1000 - ₹1500" : budget === "Medium" ? "₹2500 - ₹3500" : "₹5000 - ₹8000",
      reason: "Highly rated on security, cozy private rooms, helpful local manager."
    }
  ];

  const localTransport = [
    {
      mode: `${destination} Metro / E-Rickshaws`,
      costEstimate: "₹20 - ₹50 per trip",
      description: "Cheap, fast and environmentally friendly way to get around town.",
      safetyTip: "Highly crowded during rush hours, separate sections/coaches are available."
    },
    {
      mode: "Prepaid Autos / App Cabs",
      costEstimate: "₹100 - ₹250 per trip",
      description: "Convenient point-to-point transit from local stations and hotels.",
      safetyTip: "Always confirm the ride match OTP or fare before getting in."
    }
  ];

  const itinerary = [];
  const themes = [
    "Arrival, Check-in & Evening Heritage Walk",
    "Sightseeing, Iconic Landmarks & Sunset Spot",
    "Local Food Exploration & Traditional Shopping",
    "Offbeat Trails, Local Culture & Nature Escape",
    "Final Day Souvenir Hunting & Departure"
  ];

  for (let i = 1; i <= days; i++) {
    const dayTheme = themes[(i - 1) % themes.length];
    const activities = [
      {
        time: "09:00 AM",
        title: i === 1 ? "Check-in & Settle Down" : "Morning Breakfast & Briefing",
        description: i === 1 
          ? `Arrive at the hotel/hostel in ${destination}, check-in, unpack and refresh.`
          : "Enjoy traditional local breakfast nearby and plan the day's route.",
        safetyTip: "Keep your luggage locked in hostel lockers.",
        cost: 0
      },
      {
        time: "11:30 AM",
        title: `Explore ${mapPins[(i - 1) % mapPins.length]?.name || "Local Landmark"}`,
        description: `Visit the landmark and admire the history and craftsmanship. Perfect for photos.`,
        safetyTip: "Beware of unauthorized tour guides requesting high commissions.",
        cost: budget === "Low" ? 20 : budget === "Medium" ? 100 : 300
      },
      {
        time: "03:30 PM",
        title: `Lunch & Culinary Tour`,
        description: "Taste local delicacies and authentic street food at a highly-rated hygiene-first eatery.",
        safetyTip: "Drink only bottled mineral water.",
        cost: budget === "Low" ? 150 : budget === "Medium" ? 350 : 800
      },
      {
        time: "06:00 PM",
        title: i === days ? "Souvenir Shopping & Wrap-up" : "Sunset Viewpoint or Evening Garden stroll",
        description: i === days
          ? "Browse local markets for souvenirs, handicrafts, and regional spices."
          : "Watch the spectacular sunset and relax in a tranquil park environment.",
        safetyTip: "Prefer cashless digital payments (UPI/Cards) over carrying heavy cash.",
        cost: budget === "Low" ? 100 : budget === "Medium" ? 400 : 1000
      }
    ];

    itinerary.push({
      dayNumber: i,
      theme: dayTheme,
      activities
    });
  }

  const budgetBreakdown = {
    stay: budget === "Low" ? 800 * days : budget === "Medium" ? 2000 * days : 5000 * days,
    food: budget === "Low" ? 500 * days : budget === "Medium" ? 1200 * days : 2500 * days,
    transport: budget === "Low" ? 400 * days : budget === "Medium" ? 1000 * days : 2000 * days,
    activities: budget === "Low" ? 300 * days : budget === "Medium" ? 800 * days : 1800 * days,
    miscellaneous: budget === "Low" ? 200 * days : budget === "Medium" ? 500 * days : 1200 * days
  };

  const packingList = [
    "Comfortable walking shoes",
    "Power bank & charger",
    "Modest clothing for spiritual sites",
    "Personal medicine kit",
    "Refillable water bottle",
    "Digital copies of identity documents"
  ];

  return {
    trains,
    itinerary,
    accommodations,
    localTransport,
    mapPins,
    budgetBreakdown,
    packingList
  };
};

module.exports = { generateMockTrip };
