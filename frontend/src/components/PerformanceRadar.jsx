import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

function PerformanceRadar({ metrics }) {
  if (!metrics) return null;

  const data = [
    { metric: "Strength", value: metrics.strength },
    { metric: "Endurance", value: metrics.endurance },
    { metric: "Recovery", value: metrics.recovery },
    // Invert fatigue so lower fatigue = better performance
    { metric: "Fatigue", value: 100 - metrics.fatigue },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>🕸️ Performance Balance</h3>

      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />

          <Radar
            name="Performance"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceRadar;
