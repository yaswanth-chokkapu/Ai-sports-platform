import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Performance", path: "/performance" },
    { name: "Injury & Fatigue", path: "/injury" },
    { name: "AI Voice Coach", path: "/coach" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 text-white no-underline group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">AthleteX</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Analytics</span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all no-underline ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
