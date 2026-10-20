import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  BatteryMedium,
  TrendingUp,
  Sparkles,
  Info,
  Plus,
} from "lucide-react";
import FatigueChart from "../components/FatigueChart";

function cleanEmojiText(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/\p{Extended_Pictographic}|\p{Emoji_Presentation}/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getRiskBadge(level) {
  if (!level) {
    return {
      text: "No Data",
      color: "bg-slate-100 dark:bg-[#1B2E4B] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#223854]",
      label: "Awaiting Assessment",
    };
  }
  const lower = level.toLowerCase();
  if (lower === "low") {
    return {
      text: "Low Risk",
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      label: "Balanced Training Load",
    };
  }
  if (lower === "medium") {
    return {
      text: "Moderate Risk",
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      label: "Elevated Acute Workload",
    };
  }
  return {
    text: "High Risk",
    color: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60",
    label: "Excessive Strain / Rest Recommended",
  };
}

function Injury() {
  const { sessions } = useSession();

  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  if (!hasSessions) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="pb-6 border-b border-slate-200 dark:border-[#223854]">
          <div className="flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Injury & Fatigue Surveillance
            </h1>
          </div>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Workload strain monitoring, fatigue accumulation trends, and recovery guidance.
          </p>
        </header>

        <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#223854] bg-slate-50/70 dark:bg-[#1B2E4B]/40 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-200/60 dark:bg-[#162842] flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 m-0">
            No Active Telemetry Recorded
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-5">
            Log and evaluate your first training session to calculate baseline acute workload strain and fatigue accumulation.
          </p>
          <Link
            to="/performance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors no-underline"
          >
            <Plus className="w-4 h-4" />
            Evaluate First Session
          </Link>
        </div>
      </div>
    );
  }

  const latest = sessions[sessions.length - 1];

  const latestFatigue =
    typeof latest.fatigue === "number"
      ? latest.fatigue
      : typeof latest.fatigue_score === "number"
      ? latest.fatigue_score
      : null;

  const fatigueHistory = sessions
    .filter(
      (s) =>
        typeof s.fatigue === "number" ||
        typeof s.fatigue_score === "number"
    )
    .map((s) => ({
      date: s.date,
      time: s.time,
      fatigue:
        typeof s.fatigue === "number" ? s.fatigue : s.fatigue_score,
    }));

  const avgFatigue =
    fatigueHistory.length > 0
      ? Math.round(
          fatigueHistory.reduce((a, b) => a + b.fatigue, 0) /
            fatigueHistory.length
        )
      : null;

  const riskBadge = getRiskBadge(latest.injury_risk);
  const rawSuggestions = Array.isArray(latest.suggestions) ? latest.suggestions : [];
  const sanitizedSuggestions = rawSuggestions.map(cleanEmojiText).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-slate-200 dark:border-[#223854]">
        <div className="flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Injury & Fatigue Surveillance
          </h1>
        </div>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Workload strain monitoring, fatigue accumulation trends, and recovery guidance.
        </p>
      </header>

      {/* KPI Cards Row */}
      <section aria-label="Strain and Fatigue Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Workload Strain Risk */}
        <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#1B2E4B] flex items-center justify-center">
                  {latest.injury_risk && latest.injury_risk.toLowerCase() === "high" ? (
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">
                  Strain Risk Index
                </h2>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${riskBadge.color}`}>
                {riskBadge.text}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {latest.injury_risk || "—"}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {riskBadge.label} (ratio of load to recovery)
          </p>
        </div>

        {/* Current Session Fatigue */}
        <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#1B2E4B] flex items-center justify-center">
                  <BatteryMedium className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">
                  Latest Session Fatigue
                </h2>
              </div>
              {latestFatigue !== null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  latestFatigue < 40
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                    : latestFatigue < 70
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                    : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60"
                }`}>
                  {latestFatigue < 40 ? "Optimal" : latestFatigue < 70 ? "Moderate" : "Elevated"}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {latestFatigue !== null ? latestFatigue : "—"}
              </span>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/ 100</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Acute physical exertion reported in latest workout
          </p>
        </div>

        {/* Rolling Average Fatigue */}
        <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#1B2E4B] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">
                  Rolling Workload Fatigue
                </h2>
              </div>
              {avgFatigue !== null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  avgFatigue < 40
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                    : avgFatigue < 70
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                    : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60"
                }`}>
                  {avgFatigue < 40 ? "Optimal" : avgFatigue < 70 ? "Moderate" : "Elevated"}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {avgFatigue !== null ? avgFatigue : "—"}
              </span>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/ 100</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Averaged across {fatigueHistory.length} recorded {fatigueHistory.length === 1 ? "session" : "sessions"}
          </p>
        </div>
      </section>

      {/* Fatigue Trend Chart Section */}
      <section className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
                Fatigue Progression Across Sessions
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Workload strain accumulation per recorded training session
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1B2E4B] border border-transparent dark:border-[#223854] px-2.5 py-1 rounded-md self-start sm:self-auto font-mono">
            Scale: 0 – 100
          </span>
        </div>

        {fatigueHistory.length >= 2 ? (
          <FatigueChart history={fatigueHistory} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#223854] bg-slate-50/70 dark:bg-[#1B2E4B]/40 p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm m-0">
              Complete at least two training sessions to unlock longitudinal fatigue trend analysis and accumulation rates.
            </p>
          </div>
        )}
      </section>

      {/* Injury Prevention Insights */}
      {sanitizedSuggestions.length > 0 && (
        <section className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-[#1B2E4B]">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
              Injury Prevention Insights
            </h2>
          </div>

          <ul className="space-y-2.5 p-0 m-0 list-none">
            {sanitizedSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#162842] border border-slate-200/70 dark:border-[#223854] text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Non-Diagnostic Clinical Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#162842]/70 border border-slate-200 dark:border-[#223854] flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <Info className="w-4 h-4 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
        <p className="m-0 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-300 font-semibold">Athletic Guidance Notice:</strong>{" "}
          Strain risk indices and fatigue metrics represent algorithmic workload assessments derived from biometric input and perceived exertion. This platform does not provide medical clearance or clinical diagnoses. Athletes experiencing acute or persistent musculoskeletal discomfort should seek professional medical evaluation.
        </p>
      </div>
    </div>
  );
}

export default Injury;
