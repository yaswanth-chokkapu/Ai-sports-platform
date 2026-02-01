import { useEffect, useRef } from "react";

function generateSpeech({ performance, injuryRisk, fatigue }) {
  if (!performance) return "";

  if (performance >= 75) {
    return "Great session today. Your training and recovery are well balanced. Keep up this momentum.";
  }

  if (performance >= 50) {
    return "Decent work, but there is room to improve. Focus a bit more on recovery and sleep.";
  }

  return "Your body seems under stress. Consider reducing training load and prioritizing recovery to prevent injury.";
}

function VoiceCoach({ sessionData, analysis }) {
  const synthRef = useRef(window.speechSynthesis);

  if (!analysis) return null;

  const text = generateSpeech({
    performance: analysis.performance?.overall_score,
    injuryRisk: analysis.injury_risk?.risk_level,
    fatigue: analysis.fatigue_trend?.average_fatigue,
  });

  const speak = () => {
    if (!text) return;

    synthRef.current.cancel(); // stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    synthRef.current.speak(utterance);
  };

  return (
    <div className="card" style={{ marginTop: "24px" }}>
      <h3 className="section-title">🎤 AI Voice Coach</h3>
      <p className="muted">{text}</p>

      <button
        onClick={speak}
        style={{
          marginTop: "12px",
          padding: "10px 16px",
          borderRadius: "10px",
          background: "var(--primary)",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        ▶ Play Coach Advice
      </button>
    </div>
  );
}

export default VoiceCoach;

