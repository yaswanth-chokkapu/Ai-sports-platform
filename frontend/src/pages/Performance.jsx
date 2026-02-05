import { useState } from "react";
import { useSession } from "../context/SessionContext";
import { motion } from "framer-motion";
import PerformanceRadar from "../components/PerformanceRadar";


function Performance() {
  const { addSession } = useSession();

  /* =========================
     INPUT STATES
     ========================= */
  const [trainingLoad, setTrainingLoad] = useState(60);
  const [heartRate, setHeartRate] = useState(130);
  const [sessionDuration, setSessionDuration] = useState(75);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [fatigueScore, setFatigueScore] = useState(45);
  const [recoveryScore, setRecoveryScore] = useState(70);
  const [previousInjury, setPreviousInjury] = useState(false);

  /* =========================
     BACKEND OUTPUT STATES
     ========================= */
  const [performance, setPerformance] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  /* =========================
     BACKEND CALL
     ========================= */
  async function checkPerformance() {
    try {
      const response = await fetch("http://127.0.0.1:8000/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          training_load: trainingLoad,
          heart_rate: heartRate,
          session_duration: sessionDuration,
          sleep_hours: sleepHours,
          fatigue_score: fatigueScore,
          recovery_score: recoveryScore,
          previous_injury: previousInjury,
        }),
      });

      if (!response.ok) throw new Error("Backend validation failed");

      const data = await response.json();

      setPerformance(data.performance);
      setInjuryRisk(data.injury_risk);
      setFatigue(data.fatigue_trend);
      setSuggestions(data.suggestions);
      setAnalyzed(true);

      addSession({
        date: new Date().toLocaleDateString(),
        overall_score: data.performance.overall_score,
        fatigue: data.fatigue_trend.average_fatigue,
        injury_risk: data.injury_risk.risk_level,
        metrics: data.performance.metrics,
        suggestions: data.suggestions,
      });
    } catch (err) {
      console.error("Backend error:", err);
    }
  }

  return (
    <div className="page-container">

      {/* HEADER */}
      <section className="page-header">
        <h1 className="page-title">📊 Performance Dashboard</h1>
        <p className="page-subtitle">
          Adjust inputs and analyze your session
        </p>
      </section>

      {/* INPUTS */}
      <section className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Session Inputs</h3>

          <label>Training Load: {trainingLoad}</label>
          <input type="range" min="0" max="100" value={trainingLoad}
            onChange={(e) => setTrainingLoad(+e.target.value)} />

          <label>Heart Rate: {heartRate}</label>
          <input type="range" min="60" max="200" value={heartRate}
            onChange={(e) => setHeartRate(+e.target.value)} />

          <label>Session Duration (min): {sessionDuration}</label>
          <input type="range" min="10" max="180" value={sessionDuration}
            onChange={(e) => setSessionDuration(+e.target.value)} />

          <label>Sleep Hours: {sleepHours}</label>
          <input type="range" min="3" max="10" step="0.5" value={sleepHours}
            onChange={(e) => setSleepHours(+e.target.value)} />

          <label>Fatigue Score: {fatigueScore}</label>
          <input type="range" min="0" max="100" value={fatigueScore}
            onChange={(e) => setFatigueScore(+e.target.value)} />

          <label>Recovery Score: {recoveryScore}</label>
          <input type="range" min="0" max="100" value={recoveryScore}
            onChange={(e) => setRecoveryScore(+e.target.value)} />

          <label style={{ display: "block", marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={previousInjury}
              onChange={() => setPreviousInjury(!previousInjury)}
            />{" "}
            Previous Injury
          </label>

          <button
            onClick={checkPerformance}
            style={{
              marginTop: "14px",
              padding: "10px 16px",
              borderRadius: "10px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Check Performance
          </button>
        </div>
      </section>

      {/* RESULTS */}
      {analyzed && performance && (
        <>
          <section className="dashboard-section">
            <div className="card">
              <h3 className="section-title">Overall Performance</h3>
              <div className="stat-value">{performance.overall_score}</div>
            </div>
          </section>

          <section className="dashboard-section">
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h3 className="section-title">Performance Balance</h3>
              <PerformanceRadar metrics={performance.metrics} />
            </motion.div>
          </section>

          <section className="dashboard-section">
            <div className="summary-grid">
              {Object.entries(performance.metrics).map(([k, v]) => (
                <div key={k} className="card">
                  <h4 style={{ textTransform: "capitalize" }}>{k}</h4>
                  <div className="stat-value">{v}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="card">
              <h3 className="section-title">AI Coach Insights</h3>
              <ul>
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

    </div>
  );
}

export default Performance;
