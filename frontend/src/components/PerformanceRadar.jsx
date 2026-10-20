import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Crosshair } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function CustomRadarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 dark:bg-[#1B2E4B] border border-slate-800 dark:border-[#223854] text-white px-3 py-2 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-slate-300">{item.metric}</p>
        <p className="text-sm font-bold text-blue-400 mt-0.5">
          Score: {item.value} <span className="text-slate-400 font-normal">/ 100</span>
        </p>
        {item.rawFatigue !== undefined && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            Actual Fatigue Load: {item.rawFatigue} / 100
          </p>
        )}
      </div>
    );
  }
  return null;
}

function PerformanceRadar({ metrics }) {
  const { isDark } = useTheme();

  if (!metrics) return null;

  const data = [
    { metric: "Strength", value: metrics.strength },
    { metric: "Endurance", value: metrics.endurance },
    { metric: "Recovery", value: metrics.recovery },
    // Invert fatigue so higher radial distance = higher resilience / lower fatigue
    {
      metric: "Fatigue Resistance",
      value: 100 - metrics.fatigue,
      rawFatigue: metrics.fatigue,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
            Biometric Balance Matrix
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 self-start sm:self-auto">
          Radial Scale: 0 – 100
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke={isDark ? "#223854" : "#e2e8f0"} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{
                fill: isDark ? "#e2e8f0" : "#1e293b",
                fontSize: 12,
                fontWeight: 600,
              }}
              stroke={isDark ? "#334d70" : "#cbd5e1"}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              ticks={[25, 50, 75, 100]}
              tick={{
                fill: isDark ? "#64748b" : "#94a3b8",
                fontSize: 10,
              }}
              stroke={isDark ? "#223854" : "#e2e8f0"}
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Radar
              name="Biometrics"
              dataKey="value"
              stroke={isDark ? "#60a5fa" : "#2563eb"}
              fill="#3b82f6"
              fillOpacity={isDark ? 0.4 : 0.25}
              strokeWidth={2}
              dot={{
                r: 3.5,
                fill: isDark ? "#60a5fa" : "#2563eb",
                stroke: isDark ? "#132238" : "#ffffff",
                strokeWidth: 1.5,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Metric Values Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-[#1B2E4B]">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1B2E4B] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Strength
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {metrics.strength} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1B2E4B] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Endurance
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {metrics.endurance} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1B2E4B] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Recovery
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {metrics.recovery} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1B2E4B] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Fatigue Load
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {metrics.fatigue} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceRadar;
