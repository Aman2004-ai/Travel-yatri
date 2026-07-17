import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 flex items-center justify-center relative overflow-hidden select-none">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-gray-900/40 border border-white/5 rounded-3xl p-8 shadow-2xl relative backdrop-blur-2xl text-left">
        <div className="absolute -inset-px bg-gradient-to-br from-teal-500/10 to-transparent rounded-3xl pointer-events-none" />

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-syne font-black uppercase tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-gray-400 text-xs font-medium">
            Join TravelYatri to save itineraries and coordinate regret-free group expenses.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-450 text-xs mb-6 font-semibold animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aman Jaiswal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-950/80 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. wanderer@travel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-950/80 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-950/80 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-950/80 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-400 text-teal-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-350 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/5 cursor-none pt-4"
          >
            {loading ? "Creating Profile..." : "Sign Up & Continue →"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="text-teal-450 hover:text-teal-400 font-bold transition-all underline cursor-none"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
