import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TripPlanner from "./pages/TripPlanner";
import Results from "./pages/Results";
import SavedTrips from "./pages/SavedTrips";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomCursor from "./components/CustomCursor";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100 bg-grid-pattern relative flex flex-col justify-between">
          <div>
            <div className="noise-overlay" />
            <CustomCursor />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plan" element={<TripPlanner />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/saved" element={<SavedTrips />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
