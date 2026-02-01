import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function FatigueChart({ history }) {
  if (!Array.isArray(history) || history.length < 2) return null;

  const data = history.map((entry, index) => ({
    day: entry.date ?? `Day ${index + 1}`,
    fatigue: entry.fatigue, // ✅ FIXED
  }));

  return (
    <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar
            dataKey="fatigue"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FatigueChart;

