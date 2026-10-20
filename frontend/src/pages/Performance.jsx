import { useState, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { Gauge, Sliders, Sparkles, AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import PerformanceRadar from "../components/PerformanceRadar";
import { API_BASE_URL } from "../config/api";

function cleanEmojiText(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/\p{Extended_Pictographic}|\p{Emoji_Presentation}/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function Performance() {
  const { addSession } = useSession();

  /* =========================
     INPUT STATES
     ========================= */
  const [trainingLoad, setTrainingLoad] = useState(60);
  const [heartRate, setHeartRate] = useState(130);
  const [sessionDuration, setSessionDuration] = useState(75);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [fatigueScore, setFatigueScore] = useState(45);
  const [recoveryScore, setRecoveryScore] = useState(70);
  const [previousInjury, setPreviousInjury] = useState(false);

  /* =========================
     OUTPUT STATES
     ========================= */
  const [performance, setPerformance] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("Evaluating Biometrics...");
  const [error, setError] = useState(null);

  const coldStartTimerRef = useRef(null);

  /* =========================
     BACKEND CALL WITH COLD-START SUPPORT
     ========================= */
  async function checkPerformance() {
    setLoading(true);
    setError(null);
    setLoadingStage("Evaluating Biometrics...");

    // If request takes longer than 3.5s, update message to inform user of Render container wake-up
    if (coldStartTimerRef.current) clearTimeout(coldStartTimerRef.current);
    coldStartTimerRef.current = setTimeout(() => {
      setLoadingStage("Waking analytics engine (Render cold start may take ~30s)...");
    }, 3500);

    const payload = {
      training_load: trainingLoad,
      heart_rate: heartRate,
      session_duration: sessionDuration,
      sleep_hours: sleepHours,
      fatigue_score: fatigueScore,
      recovery_score: recoveryScore,
      previous_injury: previousInjury,
    };

    let lastError = null;
    let data = null;

    try {
      // Bounded retry (max 2 attempts) to absorb transient 502/503 during Render spin-up
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(`${API_BASE_URL}/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
          }

          data = await response.json();
          break;
        } catch (fetchErr) {
          lastError = fetchErr;
          if (attempt === 1) {
            setLoadingStage("Engine waking up, retrying connection (attempt 2 of 2)...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }

      if (!data || !data.performance || typeof data.performance.overall_score !== "number") {
        throw lastError || new Error("Invalid or empty response received from analytics engine.");
      }

      const sanitizedSuggestions = Array.isArray(data.suggestions)
        ? data.suggestions.map(cleanEmojiText)
        : [];

      setPerformance(data.performance);
      setInjuryRisk(data.injury_risk);
      setFatigue(data.fatigue_trend);
      setSuggestions(sanitizedSuggestions);
      setAnalyzed(true);

      const now = new Date();
      addSession({
        date: now.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now.getTime(),
        overall_score: data.performance.overall_score,
        fatigue: data.fatigue_trend?.average_fatigue ?? data.fatigue_trend?.history?.[0] ?? fatigueScore,
        injury_risk: data.injury_risk?.risk_level ?? "Low",
        metrics: data.performance.metrics,
        suggestions: sanitizedSuggestions,
      });
    } catch (err) {
      console.error("Backend error:", err);
      setError(
        `Unable to connect to analytics engine (${err.message}). If the Render instance was sleeping, it may still be finishing initialization. Please try again.`
      );
    } finally {
      if (coldStartTimerRef.current) {
        clearTimeout(coldStartTimerRef.current);
        coldStartTimerRef.current = null;
      }
      setLoading(false);
    }
  }

  const sliderFields = [
    {
      label: "Training Load",
      val: trainingLoad,
      set: setTrainingLoad,
      min: 0,
      max: 100,
      unit: "%",
      hint: "Perceived intensity scale",
    },
    {
      label: "Heart Rate",
      val: heartRate,
      set: setHeartRate,
      min: 60,
      max: 200,
      unit: "bpm",
      hint: "Average session cardiovascular load",
    },
    {
      label: "Session Duration",
      val: sessionDuration,
      set: setSessionDuration,
      min: 10,
      max: 180,
      unit: "min",
      hint: "Active training duration",
    },
    {
      label: "Sleep Duration",
      val: sleepHours,
      set: setSleepHours,
      min: 3,
      max: 12,
      step: 0.5,
      unit: "hrs",
      hint: "Rest previous evening",
    },
    {
      label: "Fatigue Score",
      val: fatigueScore,
      set: setFatigueScore,
      min: 0,
      max: 100,
      unit: "/ 100",
      hint: "Subjective muscle soreness / tiredness",
    },
    {
      label: "Recovery Score",
      val: recoveryScore,
      set: setRecoveryScore,
      min: 0,
      max: 100,
      unit: "/ 100",
      hint: "Readiness from sleep and nutrition",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#223854]">
        <div>
          <div className="flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Performance Diagnostics
            </h1>
          </div>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Calibrate workout inputs to calculate your acute overall performance and strain index.
          </p>
        </div>
      </header>

      {/* Input Form Section */}
      <section className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-[#1B2E4B]">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
            Session Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {sliderFields.map((f, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {f.label}
                </label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/60">
                  {f.val} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">{f.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step || 1}
                value={f.val}
                onChange={(e) => f.set(+e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{f.hint}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1B2E4B] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={previousInjury}
              onChange={() => setPreviousInjury(!previousInjury)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-[#1B2E4B]"
            />
            <span>History of previous musculoskeletal injury</span>
          </label>

          <button
            onClick={checkPerformance}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{loadingStage}</span>
              </>
            ) : (
              <span>Check Performance</span>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-red-700 dark:text-red-400">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold m-0">Diagnostics Connection Error</p>
                <p className="text-xs mt-0.5 m-0">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={checkPerformance}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-800 dark:text-red-200 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </section>

      {/* Results Section */}
      {analyzed && performance && (
        <div className="space-y-8 animate-fade-in">
          {/* Overall Performance Banner */}
          <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Analysis Complete
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight m-0">
                Overall Athletic Score
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Composite index derived from strength, endurance, rest, and fatigue balance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {injuryRisk && (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Injury Risk</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
                    injuryRisk.risk_level === 'Low'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                      : injuryRisk.risk_level === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                      : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60'
                  }`}>
                    {injuryRisk.risk_level}
                  </span>
                </div>
              )}
              {fatigue && (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rolling Fatigue</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {fatigue.average_fatigue} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2 bg-slate-50 dark:bg-[#1B2E4B] px-6 py-3 rounded-xl border border-slate-200 dark:border-[#223854]">
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                  {performance.overall_score}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
            </div>
          </div>

          {/* Performance Radar Matrix */}
          <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
            <PerformanceRadar metrics={performance.metrics} />
          </div>

          {/* Four Key Metrics Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(performance.metrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {key}
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                    {value}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Coach Recommendations */}
          {suggestions && suggestions.length > 0 && (
            <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-[#1B2E4B]">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
                  Coach Telemetry Insights
                </h3>
              </div>

              <ul className="space-y-2.5 p-0 m-0 list-none">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#162842] border border-slate-200/70 dark:border-[#223854] text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Performance;
