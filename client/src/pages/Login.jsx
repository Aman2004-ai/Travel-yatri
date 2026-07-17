import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
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
            Log In Explorer
          </h1>
          <p className="text-gray-400 text-xs font-medium">
            Welcome back to TravelYatri. Connect and manage your regret-free trips.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-450 text-xs mb-6 font-semibold animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-400 text-teal-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-350 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/5 cursor-none"
          >
            {loading ? "Verifying Credentials..." : "Log In & Continue →"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="text-teal-450 hover:text-teal-400 font-bold transition-all underline cursor-none"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
