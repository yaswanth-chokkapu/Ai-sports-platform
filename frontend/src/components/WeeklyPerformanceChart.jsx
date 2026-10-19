import { useSession } from "../context/SessionContext";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart2, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-slate-300">{label}</p>
        <p className="text-sm font-bold text-blue-400 mt-0.5">
          Score: {payload[0].value} <span className="text-slate-400 font-normal">/ 100</span>
        </p>
      </div>
    );
  }
  return null;
}

function WeeklyPerformanceChart() {
  const { sessions } = useSession();

  const hasData = Array.isArray(sessions) && sessions.length > 0;

  const chartData = hasData
    ? sessions.map((s, index) => ({
        day: s.date || `Session ${index + 1}`,
        performance: typeof s.overall_score === "number" ? s.overall_score : 0,
      }))
    : [];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight m-0">
              Performance Progression
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical overall score trajectory across recorded training sessions
          </p>
        </div>

        {hasData && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Scale: 0 – 100
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-400 mb-3">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 m-0">
            No Session Data Recorded Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
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
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default WeeklyPerformanceChart;
