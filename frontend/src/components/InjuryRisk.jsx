import { useState } from "react";

function InjuryRisk() {
  const [trainingLoad, setTrainingLoad] = useState(50);
  const [fatigue, setFatigue] = useState(50);
  const [recovery, setRecovery] = useState(50);
  const [result, setResult] = useState(null);

  const checkRisk = async () => {
    const response = await fetch("http://127.0.0.1:8000/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        training_load: trainingLoad,
        fatigue,
        recovery,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>🚑 Injury Risk Prediction</h2>

      <label>Training Load: {trainingLoad}</label>
      <input type="range" min="0" max="100" value={trainingLoad} onChange={(e) => setTrainingLoad(+e.target.value)} />

      <br />

      <label>Fatigue: {fatigue}</label>
      <input type="range" min="0" max="100" value={fatigue} onChange={(e) => setFatigue(+e.target.value)} />

      <br />

      <label>Recovery: {recovery}</label>
      <input type="range" min="0" max="100" value={recovery} onChange={(e) => setRecovery(+e.target.value)} />

      <br /><br />

      <button onClick={checkRisk}>Check Injury Risk</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Risk Level: {result.risk_level}</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default InjuryRisk;
