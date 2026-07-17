import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/plan", label: "Plan a Trip" },
    { path: "/saved", label: "Saved Trips" },
  ];

  return (
    <nav className="bg-gray-950/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:rotate-[25deg] transition-transform duration-300">🎒</span>
          <span className="text-xl font-syne font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Travel</span>
            <span className="text-amber-400">Yatri</span>
          </span>
        </Link>
        <div className="flex gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 relative py-1 ${
                  isActive
                    ? "text-teal-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 to-amber-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

