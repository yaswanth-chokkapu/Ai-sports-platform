import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";

function SummaryCards() {
  const { sessions } = useSession();

  // 🔸 Empty state
  if (!sessions || sessions.length === 0) {
    return (
      <div className="summary-grid">
        <div className="card">Avg Performance: —</div>
        <div className="card">Injury Risk: —</div>
        <div className="card">Avg Fatigue: —</div>
      </div>
    );
  }

  /* ✅ SAFE calculations */

  const avgPerformance = Math.round(
    sessions.reduce((a, s) => a + (s.overall_score || 0), 0) / sessions.length
  );

  const fatigueValues = sessions
    .map((s) => s.fatigue)
    .filter((f) => typeof f === "number");

  const avgFatigue =
    fatigueValues.length > 0
      ? Math.round(
          fatigueValues.reduce((a, b) => a + b, 0) / fatigueValues.length
        )
      : "—";

  const lastRisk = sessions[sessions.length - 1].injury_risk || "—";

  return (
    <motion.div
      className="summary-grid"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15 },
        },
      }}
    >
      {[
        { title: "Avg Performance", value: avgPerformance },
        { title: "Injury Risk", value: lastRisk },
        { title: "Avg Fatigue", value: avgFatigue },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{
            y: -6,
            boxShadow: "0 18px 45px rgba(79,70,229,0.18)",
          }}
        >
          <h4>{item.title}</h4>
          <p className="stat-value">{item.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SummaryCards;
