import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

function getFatigueColor(score) {
  if (score < 40) return "#10b981"; // Optimal / Low workload
  if (score < 70) return "#f59e0b"; // Moderate / Manageable workload
  return "#ef4444"; // Elevated workload
}

function getFatigueLabel(score) {
  if (score < 40) return "Optimal / Low";
  if (score < 70) return "Moderate";
  return "Elevated Strain";
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const fatigue = payload[0].value;
    const entry = payload[0].payload;
    return (
      <div className="bg-slate-900 dark:bg-[#1B2E4B] border border-slate-800 dark:border-[#223854] text-white px-3 py-2.5 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-slate-300">{entry.fullDate || entry.day}</p>
        <p className="text-sm font-bold text-white mt-1">
          Fatigue: {fatigue} <span className="text-slate-400 font-normal">/ 100</span>
        </p>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
          Workload: <span className="text-white font-semibold">{getFatigueLabel(fatigue)}</span>
        </p>
      </div>
    );
  }
  return null;
}

function FatigueChart({ history }) {
  const { isDark } = useTheme();

  if (!Array.isArray(history) || history.length < 2) return null;

  const data = history.map((entry, index) => {
    const fullDateStr = entry.date
      ? `${entry.date}${entry.time ? ` at ${entry.time}` : ""}`
      : `Session ${index + 1}`;

    return {
      day: `S${index + 1}`,
      fatigue: typeof entry.fatigue === "number" ? entry.fatigue : 0,
      fullDate: fullDateStr,
    };
  });

  return (
    <div className="w-full space-y-4">
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#223854" : "#f1f5f9"}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke={isDark ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#223854" : "#e2e8f0" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke={isDark ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="fatigue" radius={[6, 6, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={getFatigueColor(entry.fatigue)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Honest Workload Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-slate-100 dark:border-[#1B2E4B] text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Optimal / Low Workload (&lt; 40)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Moderate Workload (40–70)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Elevated Workload (&gt; 70)</span>
        </div>
      </div>
    </div>
  );
}

export default FatigueChart;
