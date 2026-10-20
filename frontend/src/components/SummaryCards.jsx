import { useSession } from "../context/SessionContext";
import { Activity, ShieldCheck, ShieldAlert, BatteryMedium } from "lucide-react";

function SummaryCards() {
  const { sessions } = useSession();

  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  const avgPerformance = hasSessions
    ? Math.round(sessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / sessions.length)
    : null;

  const fatigueValues = hasSessions
    ? sessions
        .map((s) => (typeof s.fatigue === "number" ? s.fatigue : s.fatigue_score))
        .filter((f) => typeof f === "number")
    : [];

  const avgFatigue = fatigueValues.length > 0
    ? Math.round(fatigueValues.reduce((a, b) => a + b, 0) / fatigueValues.length)
    : null;

  const lastRisk = hasSessions
    ? sessions[sessions.length - 1].injury_risk || "Low"
    : null;

  const getRiskBadge = (risk) => {
    if (!risk) return { text: "No Data", color: "bg-slate-100 dark:bg-[#1B2E4B] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#223854]" };
    const lower = risk.toLowerCase();
    if (lower === "low") {
      return { text: "Low Risk", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60" };
    }
    if (lower === "medium") {
      return { text: "Moderate Risk", color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60" };
    }
    return { text: "High Risk", color: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60" };
  };

  const getPerformanceBadge = (avg) => {
    if (avg === null) return null;
    if (avg >= 75) {
      return {
        text: "Target Met (75+)",
        color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      };
    }
    return {
      text: `${avg} / 75 Target`,
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    };
  };

  const riskBadge = getRiskBadge(lastRisk);
  const perfBadge = getPerformanceBadge(avgPerformance);

  const cards = [
    {
      title: "Average Performance",
      value: avgPerformance !== null ? `${avgPerformance}` : "—",
      unit: avgPerformance !== null ? "/ 100" : "",
      subtext: hasSessions
        ? `Evaluated across ${sessions.length} logged ${sessions.length === 1 ? "session" : "sessions"}`
        : "Submit a session to analyze",
      icon: <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      badge: perfBadge ? (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${perfBadge.color}`}>
          {perfBadge.text}
        </span>
      ) : null,
    },
    {
      title: "Strain Risk Index",
      value: lastRisk || "—",
      unit: "",
      subtext: hasSessions ? "Non-diagnostic load to recovery balance" : "Requires session metrics",
      icon: lastRisk && lastRisk.toLowerCase() === "high" ? (
        <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
      ) : (
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      ),
      badge: hasSessions ? (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${riskBadge.color}`}>
          {riskBadge.text}
        </span>
      ) : null,
    },
    {
      title: "Average Fatigue Level",
      value: avgFatigue !== null ? `${avgFatigue}` : "—",
      unit: avgFatigue !== null ? "/ 100" : "",
      subtext: hasSessions
        ? `Averaged across ${fatigueValues.length} recorded ${fatigueValues.length === 1 ? "session" : "sessions"}`
        : "Awaiting baseline entries",
      icon: <BatteryMedium className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
      badge: hasSessions && avgFatigue !== null ? (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
          avgFatigue < 40
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
            : avgFatigue < 70
            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
            : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60"
        }`}>
          {avgFatigue < 40 ? "Optimal" : avgFatigue < 70 ? "Moderate" : "Elevated"}
        </span>
      ) : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-[#334d70] transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#1B2E4B] flex items-center justify-center">
                  {card.icon}
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">
                  {card.title}
                </h2>
              </div>
              {card.badge}
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{card.unit}</span>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
