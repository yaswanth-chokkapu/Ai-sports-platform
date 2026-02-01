import { useSession } from "../context/SessionContext";
import { motion } from "framer-motion";
import FatigueChart from "../components/FatigueChart";

/* 🎨 Injury risk color helper */
function getRiskColor(level) {
  if (level === "Low") return "var(--accent)";
  if (level === "Medium") return "#eab308";
  return "var(--danger)";
}

function Injury() {
  const { sessions } = useSession();

  /* 🔐 Guard */
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="page-container">
        <section className="page-header">
          <h1 className="page-title">🩺 Injury & Fatigue</h1>
          <p className="page-subtitle muted">
            Analyze a session to see injury & fatigue insights
          </p>
        </section>
      </div>
    );
  }

  const latest = sessions[sessions.length - 1];

  /* ✅ Normalize latest fatigue (CRITICAL FIX) */
  const latestFatigue =
    typeof latest.fatigue === "number"
      ? latest.fatigue
      : typeof latest.fatigue_score === "number"
      ? latest.fatigue_score
      : null;

  /* ✅ SAFE fatigue history */
  const fatigueHistory = sessions
    .filter(
      (s) =>
        typeof s.fatigue === "number" ||
        typeof s.fatigue_score === "number"
    )
    .map((s) => ({
      date: s.date,
      fatigue:
        typeof s.fatigue === "number" ? s.fatigue : s.fatigue_score,
    }));

  /* ✅ Avg fatigue */
  const avgFatigue =
    fatigueHistory.length > 0
      ? Math.round(
          fatigueHistory.reduce((a, b) => a + b.fatigue, 0) /
            fatigueHistory.length
        )
      : 0;

  return (
    <div className="page-container">
      {/* 🧭 HEADER */}
      <section className="page-header">
        <h1 className="page-title">🩺 Injury & Fatigue</h1>
        <p className="page-subtitle">
          Injury risk, fatigue trends & recovery readiness
        </p>
      </section>

      {/* 🚑 INJURY RISK */}
      <section className="dashboard-section">
        <div
          className="card"
          style={{
            borderLeft: `6px solid ${getRiskColor(latest.injury_risk)}`,
          }}
        >
          <h3 className="section-title">Injury Risk</h3>
          <div
            className="stat-value"
            style={{ color: getRiskColor(latest.injury_risk) }}
          >
            {latest.injury_risk}
          </div>
          <p className="muted">
            Based on training load & recovery balance
          </p>
        </div>
      </section>

      {/* 📈 FATIGUE TREND */}
      <section className="dashboard-section">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ minHeight: 320 }}
        >
          <h3 className="section-title">Fatigue Trend</h3>

          {fatigueHistory.length >= 2 ? (
            <FatigueChart history={fatigueHistory} />
          ) : (
            <p className="muted">
              Not enough sessions yet to show fatigue trend.
              <br />
              Complete more sessions to unlock this chart 📈
            </p>
          )}
        </motion.div>
      </section>

      {/* 📊 AVG FATIGUE */}
      <section className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Average Fatigue</h3>
          <div className="stat-value">{avgFatigue}</div>
          <p className="muted">Across recent sessions</p>
        </div>
      </section>

      {/* 🧠 PREVENTION INSIGHTS */}
      {latest.suggestions?.length > 0 && (
        <section className="dashboard-section">
          <div className="card">
            <h3 className="section-title">Injury Prevention Insights</h3>
            <ul>
              {latest.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default Injury;


