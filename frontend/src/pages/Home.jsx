import { useSession } from "../context/SessionContext";
import { motion } from "framer-motion";
import SummaryCards from "../components/SummaryCards";
import WeeklyPerformanceChart from "../components/WeeklyPerformanceChart";
import ActionCards from "../components/ActionCards";

function Home() {
  const { sessions } = useSession();

  return (
    <div className="page-container">

      {/* 🟣 HERO / HEADER */}
      <section className="page-header">
        <h1 className="page-title">📊 Home Dashboard</h1>
        <p className="page-subtitle">
          Overview of your recent performance & health
        </p>
      </section>

      {/* 🟦 SUMMARY */}
      <section className="dashboard-section">
        <SummaryCards sessions={sessions} />
      </section>

      {/* 🟩 GRAPH */}
      <section className="dashboard-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <WeeklyPerformanceChart sessions={sessions} />
        </motion.div>
      </section>

      {/* 🟪 ACTIONS */}
      <section className="dashboard-section">
        <ActionCards />
      </section>

    </div>
  );
}

export default Home;
