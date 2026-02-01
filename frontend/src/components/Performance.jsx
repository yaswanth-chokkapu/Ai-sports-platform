import { useState } from "react";
import PerformanceRadar from "./PerformanceRadar";
import FatigueChart from "./FatigueChart";
import VoiceCoach from "./VoiceCoach";

function Performance() {
  /* =========================
     INPUT STATES (USER DATA)
     ========================= */
  const [trainingLoad, setTrainingLoad] = useState(60);
  const [heartRate, setHeartRate] = useState(130);
  const [sessionDuration, setSessionDuration] = useState(75);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [fatigueScore, setFatigueScore] = useState(45);
  const [recoveryScore, setRecoveryScore] = useState(70);
  const [previousInjury, setPreviousInjury] = useState(false);

  /* =========================
     OUTPUT STATES (BACKEND)
     ========================= */
  const [performance, setPerformance] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  /* =========================
     HELPER FUNCTIONS (UI LOGIC)
     ========================= */
  function getPerformanceColor(score) {
    if (score >= 70) return "#22c55e"; // green
    if (score >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  }

  function getInjuryColor(level) {
    if (level === "Low") return "#22c55e";
    if (level === "Medium") return "#eab308";
    return "#ef4444";
  }

  function getFatigueColor(avg) {
    if (avg < 40) return "#22c55e";
    if (avg < 70) return "#eab308";
    return "#ef4444";
  }

  const cardStyle = (color) => ({
    borderLeft: `8px solid ${color}`,
    padding: "16px",
    marginBottom: "16px",
    background: "#f9fafb",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  });

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

      if (!response.ok) {
        throw new Error("Backend validation failed");
      }

      const data = await response.json();

      setPerformance(data.performance);
      setInjuryRisk(data.injury_risk);
      setFatigue(data.fatigue_trend);
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Backend error:", err);
    }
  }

  /* =========================
     UI
     ========================= */
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>🏋️ Sports Performance Analytics</h2>

      {/* INPUT CONTROLS */}
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

      <label>
        Previous Injury:
        <input
          type="checkbox"
          checked={previousInjury}
          onChange={() => setPreviousInjury(!previousInjury)}
        />
      </label>

      <br /><br />
      <button onClick={checkPerformance}>Analyze Session</button>
      <hr />

      {/* PERFORMANCE CARD */}
      {performance && (
        <div style={cardStyle(getPerformanceColor(performance.overall_score))}>
          <h3>📊 Overall Performance</h3>
          <h2>{performance.overall_score} / 100</h2>
          <p>💪 Strength: {performance.metrics.strength}</p>
          <p>🏃 Endurance: {performance.metrics.endurance}</p>
          <p>🔄 Recovery: {performance.metrics.recovery}</p>
          <p>🔥 Fatigue: {performance.metrics.fatigue}</p>
        </div>
      )}

      {/* INJURY CARD */}
      {injuryRisk && (
        <div style={cardStyle(getInjuryColor(injuryRisk.risk_level))}>
          <h3>🚑 Injury Risk</h3>
          <h2>{injuryRisk.risk_level}</h2>
          <p>Confidence: {injuryRisk.confidence}%</p>
        </div>
      )}

      {/* RADAR + FATIGUE CHART */}
      {performance && <PerformanceRadar metrics={performance.metrics} />}
      {fatigue && <FatigueChart history={fatigue.history} />}

      {/* FATIGUE SUMMARY */}
      {fatigue && (
        <div style={cardStyle(getFatigueColor(fatigue.average_fatigue))}>
          <h3>📈 Avg Fatigue (Last 7 Sessions)</h3>
          <h2>{fatigue.average_fatigue}</h2>
        </div>
      )}

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div style={cardStyle("#3b82f6")}>
          <h3>💡 Coach Suggestions</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {/* 🔊 AI VOICE COACH — MUST BE HERE */}
      {performance && (
        <VoiceCoach
          sessionData={{
            training_load: trainingLoad,
            heart_rate: heartRate,
            session_duration: sessionDuration,
            sleep_hours: sleepHours,
            fatigue_score: fatigueScore,
            recovery_score: recoveryScore,
            previous_injury: previousInjury,
          }}
        />
      )}
    </div>
  );
}



export default Performance;


