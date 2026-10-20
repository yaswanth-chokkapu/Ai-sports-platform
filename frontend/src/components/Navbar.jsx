import { NavLink } from "react-router-dom";
import { Activity, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { toggleTheme, isDark } = useTheme();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Performance", path: "/performance" },
    { name: "Injury & Fatigue", path: "/injury" },
    { name: "AI Voice Coach", path: "/coach" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-[#0D1B2A] border-b border-[#223854]/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 text-white no-underline group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">AthleteX</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Analytics</span>
            </div>
          </NavLink>

          {/* Right Side: Navigation Links & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all no-underline whitespace-nowrap ${
                      isActive
                        ? "bg-[#1B2E4B] text-white font-semibold border border-blue-500/40 shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-slate-700/80"></div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Navy Mode"}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Navy Mode"}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1B2E4B] border border-transparent hover:border-[#223854] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 flex items-center justify-center"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
