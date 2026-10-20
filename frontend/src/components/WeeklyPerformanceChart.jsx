import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart2, Plus } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { getLatestSessions } from "../utils/sessionUtils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 dark:bg-[#1B2E4B] border border-slate-800 dark:border-[#223854] text-white px-3.5 py-2.5 rounded-lg shadow-lg text-xs">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-slate-200">Session {data.sessionNumber}</p>
          {data.date && <span className="text-[11px] text-slate-400 font-medium">{data.date}</span>}
        </div>
        {data.time && <p className="text-[11px] text-slate-400 mt-0.5">{data.time}</p>}
        <p className="text-sm font-bold text-blue-400 mt-1.5">
          Overall Score: {payload[0].value} <span className="text-slate-400 font-normal">/ 100</span>
        </p>
      </div>
    );
  }
  return null;
}

function WeeklyPerformanceChart() {
  const { sessions } = useSession();
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const latestSessions = getLatestSessions(sessions, 7);
  const hasData = latestSessions.length > 0;

  const chartData = hasData
    ? latestSessions.map((s) => {
        const fullDateStr = s.date
          ? `${s.date}${s.time ? ` at ${s.time}` : ""}`
          : `Session ${s.sessionNumber}`;

        return {
          day: `S${s.sessionNumber}`,
          fullDate: fullDateStr,
          sessionNumber: s.sessionNumber,
          date: s.date,
          time: s.time,
          performance: s.overall_score,
        };
      })
    : [];

  return (
    <div className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
              Performance Progression
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {hasData
              ? `Historical overall score trajectory across latest ${chartData.length} recorded training ${
                  chartData.length === 1 ? "session" : "sessions"
                }`
              : "Historical overall score trajectory across recorded training sessions"}
          </p>
        </div>

        {hasData && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1B2E4B] border border-transparent dark:border-[#223854] px-2.5 py-1 rounded-md self-start sm:self-auto font-mono">
            Scale: 0 – 100
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#223854] bg-slate-50/70 dark:bg-[#1B2E4B]/40 p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-[#162842] flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 m-0">
            No Session Data Recorded Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
            Evaluate your first training session to begin visualizing workload, fatigue, and recovery patterns.
          </p>
          <Link
            to="/performance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors no-underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Log First Session
          </Link>
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                stroke={isDark ? "#1E2E42" : "#f1f5f9"}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke={isDark ? "#64748b" : "#94a3b8"}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: isDark ? "#223854" : "#e2e8f0" }}
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                stroke={isDark ? "#64748b" : "#94a3b8"}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="performance"
                stroke={isDark ? "#3b82f6" : "#2563eb"}
                strokeWidth={2.5}
                isAnimationActive={!shouldReduceMotion}
                animationDuration={300}
                animationEasing="ease-out"
                dot={{
                  r: 4,
                  fill: isDark ? "#3b82f6" : "#2563eb",
                  stroke: isDark ? "#132238" : "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: isDark ? "#60a5fa" : "#1d4ed8",
                  stroke: isDark ? "#132238" : "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default WeeklyPerformanceChart;
