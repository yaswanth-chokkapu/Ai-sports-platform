import { useSession } from "../context/SessionContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Coach helpers ────────────────────────────────────────────────────────────
function injuryCoachResponse(level) {
  if (level === "Low")
    return "Your injury risk is low. Training and recovery are well balanced. Keep up your warm-ups, good sleep, and smart load progression.";
  if (level === "Medium")
    return "Your injury risk is moderate. Reduce intensity slightly, focus on mobility and recovery, and prioritize sleep and hydration. Smart adjustments now prevent setbacks later.";
  return "Your injury risk is high. Your body is under significant stress. Prioritize recovery over intensity, reduce training load, and get extra rest. Listening to your body now makes you stronger long-term.";
}

const motivationLines = [
  "Progress isn't about perfection — it's about consistency.",
  "Every session builds the athlete you're becoming.",
  "Small wins every day lead to big results.",
  "Your future performance depends on today's discipline.",
  "Rest, recover, then come back stronger.",
];
const hypeLines = [
  "You showed up today — that already puts you ahead.",
  "Stay locked in. Your hard work is visible.",
  "Trust the process. You're doing this right.",
  "Champions are built one session at a time.",
  "You're stronger than you think — keep pushing.",
];
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Speech output ────────────────────────────────────────────────────────────
function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  sentences.forEach((s) => {
    const utt = new SpeechSynthesisUtterance(s.trim());
    utt.lang = "en-US";
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const pick =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (pick) utt.voice = pick;
    window.speechSynthesis.speak(utt);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function VoiceCoachPage() {
  const { sessions } = useSession();
  const latest = sessions?.[sessions.length - 1];

  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [micState, setMicState] = useState("idle"); // idle | listening | error
  const [micMsg, setMicMsg] = useState("");

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => {
      stopRecognition();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function stopRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
      recognitionRef.current = null;
    }
  }

  // ── Coach logic ───────────────────────────────────────────────────────────
  function handleCoachLogic(text) {
    if (!latest) {
      reply("You don't have any session data yet. Please analyze a session first.");
      return;
    }
    const lower = text.toLowerCase();
    if (lower.includes("performance") || lower.includes("score")) {
      reply(
        `Your latest performance score is ${latest.overall_score}. ${
          latest.overall_score >= 75
            ? "That's strong work. You're building serious momentum."
            : "This is part of the journey. Stay patient and focused."
        } ${randomPick(motivationLines)}`
      );
    } else if (lower.includes("injury") || lower.includes("risk") || lower.includes("overtrain")) {
      reply(injuryCoachResponse(latest.injury_risk));
    } else if (lower.includes("fatigue")) {
      reply(
        `Your fatigue level is around ${latest.fatigue}. ${
          latest.fatigue < 40 ? "You're managing your workload well." : "Your body is asking for recovery — listening is strength."
        } ${randomPick(motivationLines)}`
      );
    } else if (lower.includes("motivat") || lower.includes("hype") || lower.includes("pump")) {
      reply(`${randomPick(hypeLines)} ${randomPick(motivationLines)} Consistency beats intensity.`);
    } else {
      reply(`I'm here to guide you. Ask about performance, fatigue, injury risk, or say "motivate me". ${randomPick(hypeLines)}`);
    }
  }

  function reply(text) {
    setMessages((prev) => [...prev, { role: "coach", text }]);
    speakText(text);
  }

  function submitMessage(text) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTextInput("");
    handleCoachLogic(text);
  }

  // ── Voice input ───────────────────────────────────────────────────────────
  async function startVoiceInput() {
    // If already listening, stop
    if (micState === "listening") {
      stopRecognition();
      setMicState("idle");
      setMicMsg("");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicState("error");
      setMicMsg("❌ Voice not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // ── CRITICAL FIX: Check mic permission WITHOUT holding the stream open ──
    // We just check permission, then immediately release the stream
    // so SpeechRecognition can grab the mic cleanly by itself.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release immediately — do NOT hold it open
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      setMicState("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicMsg("❌ Mic blocked. Click the 🔒 in your address bar → Microphone → Allow → refresh.");
      } else if (err.name === "NotFoundError") {
        setMicMsg("❌ No microphone found. Please connect one and try again.");
      } else {
        setMicMsg(`❌ Mic error: ${err.message}`);
      }
      return;
    }

    // ── Now start speech recognition — mic is fully free for it to use ──
    setMicState("listening");
    setMicMsg("🔴 Listening... speak now!");

    stopRecognition();
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      recognitionRef.current = null;
      setMicState("idle");
      setMicMsg(`✅ Heard: "${transcript}"`);
      submitMessage(transcript);
      setTimeout(() => setMicMsg(""), 3000);
    };

    recognition.onerror = (event) => {
      recognitionRef.current = null;
      setMicState("error");
      const msgs = {
        "not-allowed": "❌ Mic blocked. Click 🔒 → Microphone → Allow → refresh.",
        "no-speech": "❌ No speech detected. Speak louder or closer, then try again.",
        network: "❌ Network error with speech service. Check your connection.",
        "audio-capture": "❌ Could not capture audio. Refresh and try again.",
        "service-not-allowed": "❌ Speech service blocked. Make sure you're on localhost or https://",
        aborted: "",
      };
      const msg = msgs[event.error];
      setMicMsg(msg !== undefined ? msg : `❌ Error: ${event.error}. Try typing below.`);
    };

    recognition.onend = () => {
      // Timed out without result
      setMicState((prev) => {
        if (prev === "listening") {
          setMicMsg("Timed out. Tap the mic and try speaking again.");
          return "idle";
        }
        return prev;
      });
      recognitionRef.current = null;
    };

    recognition.start();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const isListening = micState === "listening";
  const btnBg = isListening ? "#e74c3c" : "var(--primary, #4A90D9)";
  const msgColor =
    micState === "error" ? "#e74c3c" :
    isListening ? "#e74c3c" :
    micMsg.startsWith("✅") ? "#27ae60" :
    "var(--muted, #888)";

  return (
    <div className="page-container">

      <section className="page-header">
        <h1 className="page-title">🎤 AI Voice Coach</h1>
        <p className="page-subtitle">Speak or type to get personalized coaching</p>
      </section>

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

      {/* Quick prompts */}
      <section className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Quick Prompts</h3>
          <div className="summary-grid">
            {["Analyze my performance", "Am I at injury risk?", "Tell me about my fatigue", "Motivate me"].map((q, i) => (
              <motion.div
                key={i}
                className="action-card"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => submitMessage(q)}
                style={{ cursor: "pointer" }}
              >
                {q}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mic section */}
      <section className="dashboard-section">
        <div className="card" style={{ textAlign: "center" }}>

          {/* Mic button */}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            {isListening && (
              <>
                <motion.span
                  style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", background: "#e74c3c", opacity: 0.15 }}
                  animate={{ scale: [1, 1.9, 1], opacity: [0.15, 0, 0.15] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.span
                  style={{ position: "absolute", width: "82px", height: "82px", borderRadius: "50%", background: "#e74c3c", opacity: 0.2 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.25 }}
                />
              </>
            )}
            <motion.button
              onClick={startVoiceInput}
              whileTap={{ scale: 0.88 }}
              style={{
                width: "74px", height: "74px", borderRadius: "50%",
                background: btnBg, color: "white", border: "none",
                cursor: "pointer", fontSize: "28px", zIndex: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "background 0.25s",
              }}
            >
              {isListening ? "⏹" : "🎙️"}
            </motion.button>
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.p
              key={micMsg}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ color: msgColor, fontSize: "0.87rem", margin: "0 0 10px", padding: "0 8px", minHeight: "22px" }}
            >
              {micMsg || "Tap the mic to speak"}
            </motion.p>
          </AnimatePresence>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "12px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border,#e0e0e0)" }} />
            <span style={{ color: "var(--muted,#bbb)", fontSize: "0.76rem" }}>or type below</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border,#e0e0e0)" }} />
          </div>

          {/* Text input */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitMessage(textInput)}
              placeholder="Type your question here..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: "10px",
                border: "1px solid var(--border,#ddd)", fontSize: "0.95rem",
                outline: "none", background: "var(--input-bg,#fff)", color: "inherit",
              }}
            />
            <motion.button
              onClick={() => submitMessage(textInput)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "10px 20px", borderRadius: "10px",
                background: "var(--primary,#4A90D9)", color: "white",
                border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600,
              }}
            >
              Send
            </motion.button>
          </div>
        </div>
      </section>

      {/* Conversation */}
      {messages.length > 0 && (
        <section className="dashboard-section">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 className="section-title" style={{ margin: 0 }}>Conversation</h3>
              <button
                onClick={() => { setMessages([]); window.speechSynthesis?.cancel(); setMicMsg(""); setMicState("idle"); }}
                style={{
                  background: "none", border: "1px solid var(--border,#ccc)",
                  borderRadius: "6px", padding: "4px 10px", cursor: "pointer",
                  fontSize: "0.8rem", color: "var(--muted,#888)",
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ maxHeight: "440px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "82%", padding: "10px 14px",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.role === "user" ? "var(--primary,#4A90D9)" : "var(--card-alt,#f0f4f8)",
                      color: m.role === "user" ? "white" : "inherit",
                      lineHeight: "1.55", fontSize: "0.95rem",
                    }}
                  >
                    {m.role === "coach" && (
                      <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "4px" }}>🤖 Coach</div>
                    )}
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}