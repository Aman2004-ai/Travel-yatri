# TravelYatri ✈️ — AI-Powered Travel Planning Web App

> Built by Aman Jaiswal | React.js · Node.js · Express.js · MongoDB · Gemini AI

---

## 📁 Project Structure

```
TravelYatri/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── TripPlanner.jsx
│   │   │   ├── Results.jsx
│   │   │   └── SavedTrips.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env
└── server/                  # Node.js Backend
    ├── models/Trip.js
    ├── controllers/tripController.js
    ├── routes/trip.js
    ├── index.js
    ├── package.json
    └── .env
```

---

## 🚀 Setup Instructions (Step-by-Step)

### Step 1 — Get your API keys

**MongoDB Atlas (Free)**
1. Go to https://www.mongodb.com/atlas
2. Create a free account → Create a Cluster (free tier)
3. Click "Connect" → "Drivers" → Copy the connection string
4. Replace `<username>` and `<password>` with your credentials

**Google Gemini API (Free)**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key" → Copy it

---

### Step 2 — Setup the Backend (Server)

```bash
cd TravelYatri/server
npm install
```

Open `server/.env` and fill in your keys:
```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.mongodb.net/travelyatri
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Start the backend:
```bash
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

---

### Step 3 — Setup the Frontend (Client)

Open a new terminal:
```bash
cd TravelYatri/client
npm install
npm run dev
```

Open your browser: http://localhost:3000

---

## ✅ Features

- 🤖 AI-powered itinerary generation using Google Gemini
- 🌍 Plan trips by destination, days, budget, and traveler type
- 💾 Save all generated trips to MongoDB
- 📋 View and delete saved trips
- 📱 Fully responsive design with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Tailwind CSS, React Router |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (via Mongoose)            |
| AI         | Google Gemini 1.5 Flash API       |
| HTTP Client| Axios                             |
| Dev Tools  | Vite, Nodemon                     |

---

## 📡 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/trips/generate       | Generate AI trip plan    |
| GET    | /api/trips                | Get all saved trips      |
| GET    | /api/trips/:id            | Get single trip          |
| DELETE | /api/trips/:id            | Delete a trip            |

---

## 👨‍💻 Author

**Aman Jaiswal**  
B.Tech CSE, Pranveer Singh Institute of Technology, Kanpur  
GitHub: aman-j0007
