import { useSession } from "../context/SessionContext";
import { useState } from "react";
import { motion } from "framer-motion";

function injuryCoachResponse(level) {
  if (level === "Low") {
    return `
Your injury risk is low. That means your training and recovery are well balanced.

Keep doing what you’re doing:
• Proper warm-ups
• Good sleep
• Smart load progression

Stay consistent — this is how athletes stay healthy.
`;
  }

  if (level === "Medium") {
    return `
Your injury risk is moderate. This is a warning zone, not a danger zone.

I recommend:
• Reduce intensity slightly
• Focus on mobility and recovery
• Prioritize sleep and hydration

Smart adjustments now prevent setbacks later.
`;
  }

  return `
Your injury risk is high. This means your body is under significant stress.

Right now, the priority is:
• Recovery over intensity
• Reduced training load
• Extra rest and mobility work

Pushing through this can lead to injury — listening now makes you stronger long-term.
`;
}

 
function VoiceCoachPage() {
  
  const { sessions } = useSession();
  const latest = sessions?.[sessions.length - 1];

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");

 const [messages,setMessages] = useState([]);

const motivationLines = [
  "Progress isn’t about perfection — it’s about consistency.",
  "Every session you complete builds the athlete you’re becoming.",
  "Small wins every day lead to big results.",
  "Your future performance depends on today’s discipline.",
  "Rest, recover, then come back stronger."
];

const hypeLines = [
  "You showed up today — that already puts you ahead.",
  "Stay locked in. Your hard work is visible.",
  "Trust the process. You're doing this right.",
  "Champions are built one session at a time.",
  "You're stronger than you think — keep pushing 💪"
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


  /* 🔊 Speak + show reply */
 function reply(text) {
  setMessages((prev) => [
    ...prev,
    { role: "coach", text }
  ]);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}


  /* 🧠 Coach brain */
  function handleCoachLogic(text) {
    if (!latest) {
      reply("You don’t have any session data yet. Analyze a session first.");
      return;
    }

    const lower = text.toLowerCase();

    if (lower.includes("performance")) {
  reply(
    `Your latest performance score is ${latest.overall_score}. ${
      latest.overall_score >= 75
        ? "That’s strong work. You’re building serious momentum."
        : "This is part of the journey. Stay patient and focused."
    }

${randomPick(motivationLines)}`
  );
}
else if (
  lower.includes("injury") ||
  lower.includes("risk") ||
  lower.includes("overtrain")
) {
  reply(injuryCoachResponse(latest.injury_risk));
}
 else if (lower.includes("fatigue")) {
  reply(
    `Your recent fatigue level is around ${latest.fatigue}. ${
      latest.fatigue < 40
        ? "You’re managing your workload well."
        : "Your body is asking for recovery — and listening is strength."
    }

${randomPick(motivationLines)}`
  );
}
else if (lower.includes("motivate")) {
  reply(
    `${randomPick(hypeLines)} 
     
${randomPick(motivationLines)}

Remember — consistency beats intensity.`
  );
}
else {
  reply(
    `I’m here to guide you — performance, recovery, injury prevention, and mindset.

Ask me things like:
• How was my performance?
• Am I overtraining?
• Motivate me
• What should I focus on next?

${randomPick(hypeLines)}`
  );
}

  }

  /* 🎙️ Mic input */
  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setUserText(text);
      setListening(false);
       
      setMessages((prev) => [
    ...prev,
    { role: "user", text }
  ]);

      handleCoachLogic(text);
    };

    recognition.onerror = () => setListening(false);

    recognition.start();
  }

  /* 🧩 Guided prompt click */
  function handlePromptClick(text) {
    setUserText(text);
    handleCoachLogic(text);
  }

  return (
    <div className="page-container">

      {/* 🧭 HEADER */}
      <section className="page-header">
        <h1 className="page-title">🎤 AI Voice Coach</h1>
        <p className="page-subtitle">
          Speak or click to get personalized coaching
        </p>
      </section>

      {/* 🧠 CONTEXT */}
      {latest && (
        <section className="dashboard-section">
          <div className="card">
            <h3 className="section-title">Current Context</h3>
            <p><strong>Performance:</strong> {latest.overall_score}</p>
            <p><strong>Injury Risk:</strong> {latest.injury_risk}</p>
            <p><strong>Avg Fatigue:</strong> {latest.fatigue}</p>
          </div>
        </section>
      )}

      {/* 🎯 GUIDED PROMPTS */}
      <section className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Ask your Coach</h3>

          <div className="summary-grid">
            {[
              "Analyze my performance",
              "Am I at injury risk?",
              "Tell me about my fatigue",
              "Motivate me"
            ].map((q, i) => (
              <motion.div
                key={i}
                className="action-card"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePromptClick(q)}
                style={{ cursor: "pointer" }}
              >
                {q}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎙️ MIC BUTTON */}
      <section className="dashboard-section">
  <div className="card" style={{ textAlign: "center" }}>
    <div className="mic-wrapper">
      {listening && <span className="mic-pulse" />}

      <button
        onClick={startListening}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--primary)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
          zIndex: 2,
        }}
      >
        🎙️
      </button>
    </div>

    <p className="muted" style={{ marginTop: "12px" }}>
      {listening ? "Listening..." : "Tap to speak"}
    </p>

    {userText && (
      <p className="muted" style={{ marginTop: "6px" }}>
        You said: “{userText}”
      </p>
    )}
  </div>
</section>


      {/* 🗣️ COACH RESPONSE */}
      {messages.length > 0 && (
      <section className="dashboard-section">
  <div className="card">
    <h3 className="section-title">Conversation</h3>

    <div className="chat-container">
      {messages.length === 0 && (
        <p className="muted">
          👋 Ask about performance, fatigue, injury risk, or training plans.
        </p>
      )}

      {messages.map((m, i) => (
        <div
          key={i}
          className={`chat-bubble ${
            m.role === "user" ? "chat-user" : "chat-coach"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  </div>
</section>
      )}

    </div>
  );
}

export default VoiceCoachPage;



