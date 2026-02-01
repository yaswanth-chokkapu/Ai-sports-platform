import React from "react";
import { useSession } from "../context/SessionContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WeeklyPerformanceChart() {
  const { sessions } = useSession();

  // 🔹 No data yet
  if (!sessions || sessions.length === 0) {
    return <p style={{ marginTop: "20px" }}>No performance data yet</p>;
  }

  // 🔹 Prepare chart data from sessions
  const chartData = sessions.map((s, index) => ({
    day: s.date || `Session ${index + 1}`,
    performance: s.overall_score,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="performance"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyPerformanceChart;




