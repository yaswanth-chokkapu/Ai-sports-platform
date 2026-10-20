import { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { LayoutDashboard, CheckCircle2 } from "lucide-react";
import SummaryCards from "../components/SummaryCards";
import WeeklyPerformanceChart from "../components/WeeklyPerformanceChart";
import ActionCards from "../components/ActionCards";

function Home() {
  const { sessions } = useSession();
  const sessionCount = Array.isArray(sessions) ? sessions.length : 0;

  const [engineStatus, setEngineStatus] = useState("checking"); // 'checking' | 'connected' | 'offline'

  const BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:8000" : "");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    fetch(`${BASE_URL}/`, { signal: controller.signal })
      .then((res) => {
        if (!active) return;
        clearTimeout(timeoutId);
        if (res.ok) {
          setEngineStatus("connected");
        } else {
          setEngineStatus("offline");
        }
      })
      .catch(() => {
        if (active) {
          setEngineStatus("offline");
        }
      });

    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [BASE_URL]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#223854]">
        <div>
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Performance Dashboard
            </h1>
          </div>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Real-time biometric load tracking, fatigue progression, and injury risk assessments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Honest Engine Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#132238] border border-slate-200 dark:border-[#223854] text-xs font-medium text-slate-700 dark:text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                engineStatus === "connected"
                  ? "bg-emerald-500"
                  : engineStatus === "checking"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-amber-400"
              }`}
            ></span>
            <span>
              {engineStatus === "connected"
                ? "Analytics Engine Online"
                : engineStatus === "checking"
                ? "Checking Engine..."
                : "Local Cache Active"}
            </span>
          </div>

          {/* Real Session Count Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {sessionCount} {sessionCount === 1 ? "Session" : "Sessions"} Logged
            </span>
          </div>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <section aria-label="Key Performance Indicators">
        <SummaryCards />
      </section>

      {/* Performance Trajectory Graph */}
      <section aria-label="Weekly Performance Progression">
        <WeeklyPerformanceChart />
      </section>

      {/* Quick Action Navigation Cards */}
      <section aria-label="Quick Actions">
        <ActionCards />
      </section>
    </div>
  );
}

export default Home;
