import { useSession } from "../context/SessionContext";
import { LayoutDashboard, CheckCircle2 } from "lucide-react";
import SummaryCards from "../components/SummaryCards";
import WeeklyPerformanceChart from "../components/WeeklyPerformanceChart";
import ActionCards from "../components/ActionCards";

function Home() {
  const { sessions } = useSession();
  const sessionCount = Array.isArray(sessions) ? sessions.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Performance Dashboard
            </h1>
          </div>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500">
            Real-time biometric load tracking, fatigue progression, and injury risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            System Operational
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sessionCount} {sessionCount === 1 ? "Session" : "Sessions"} Logged
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
