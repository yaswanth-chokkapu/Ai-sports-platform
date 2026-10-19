import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Crosshair } from "lucide-react";

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
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Crosshair className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-semibold text-slate-800 m-0">Biometric Balance Matrix</h4>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={12} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceRadar;
