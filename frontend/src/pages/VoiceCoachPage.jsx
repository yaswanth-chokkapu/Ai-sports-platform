import { Component, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "../context/SessionContext";
import { Bot, Mic, Square, AlertCircle, Send, Trash2 } from "lucide-react";

// ─── Error Boundary ───────────────────────────────────────────────────────────
class VoiceCoachErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Voice Coach unhandled rendering error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-xs text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Voice Coach Display Notice</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              An unexpected display issue occurred in the dialogue transcript. You can reset the coach to restore the interface.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-red-600 bg-red-50 p-2 rounded max-w-lg mx-auto overflow-x-auto">
                {this.state.error.message || String(this.state.error)}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Reset Voice Coach
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
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
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

// ─── Main Exported Page with Error Boundary ───────────────────────────────────
export default function VoiceCoachPage() {
  return (
    <VoiceCoachErrorBoundary>
      <VoiceCoachContent />
    </VoiceCoachErrorBoundary>
  );
}

// ─── Voice Coach Content Component ────────────────────────────────────────────
function VoiceCoachContent() {
  const { sessions } = useSession();
  const latest = sessions?.[sessions.length - 1];

  const hasSpeechRecognition = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [micState, setMicState] = useState("idle"); // idle | listening | error
  const [micMsg, setMicMsg] = useState(
    hasSpeechRecognition
      ? ""
      : "Voice recognition is not supported in this browser. Please use Chrome or Edge, or type your question below."
  );
  const [isSupported, setIsSupported] = useState(hasSpeechRecognition);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const isStoppingRef = useRef(false);
  const chatEndRef = useRef(null);

  // Safe stop function declared before useEffect
  const stopVoiceInput = useCallback(() => {
    isStoppingRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore errors during abort
      }
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setMicState("idle");
  }, []);

  // Initialize speech synthesis voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    return () => {
      stopVoiceInput();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopVoiceInput]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Coach response logic ────────────────────────────────────────────────────
  function handleCoachLogic(text) {
    if (!latest) {
      reply("You don't have any session data yet. Please analyze a session first.");
      return;
    }
    const lower = text.toLowerCase();
    if (lower.includes("performance") || lower.includes("score")) {
      const score = latest.overall_score ?? "not recorded";
      const scoreComment =
        typeof latest.overall_score === "number"
          ? latest.overall_score >= 75
            ? "That's strong work. You're building serious momentum."
            : "This is part of the journey. Stay patient and focused."
          : "";
      reply(
        `Your latest performance score is ${score}. ${scoreComment} ${randomPick(motivationLines)}`.trim()
      );
    } else if (lower.includes("injury") || lower.includes("risk") || lower.includes("overtrain")) {
      reply(injuryCoachResponse(latest.injury_risk || "Low"));
    } else if (lower.includes("fatigue")) {
      const fatigue = latest.fatigue ?? "normal";
      const fatigueComment =
        typeof latest.fatigue === "number"
          ? latest.fatigue < 40
            ? "You're managing your workload well."
            : "Your body is asking for recovery — listening is strength."
          : "";
      reply(
        `Your fatigue level is around ${fatigue}. ${fatigueComment} ${randomPick(motivationLines)}`.trim()
      );
    } else if (lower.includes("motivat") || lower.includes("hype") || lower.includes("pump")) {
      reply(`${randomPick(hypeLines)} ${randomPick(motivationLines)} Consistency beats intensity.`);
    } else {
      reply(`I'm here to guide you. Ask about performance, fatigue, injury risk, or say "motivate me". ${randomPick(hypeLines)}`);
    }
  }

  function reply(text) {
    try {
      setMessages((prev) => [...prev, { role: "coach", text }]);
      stopVoiceInput();
      speakText(text);
    } catch (err) {
      console.error("Coach reply error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: "I encountered an issue preparing my response. Please ask again." },
      ]);
    }
  }

  function submitMessage(text) {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: clean }]);
    setTextInput("");
    try {
      handleCoachLogic(clean);
    } catch (err) {
      console.error("Error executing coach logic:", err);
      reply("I had trouble analyzing that request. Please try asking in a different way.");
    }
  }

  // ── Speech Recognition Lifecycle ───────────────────────────────────────────
  function toggleVoiceInput() {
    if (isListeningRef.current || micState === "listening") {
      stopVoiceInput();
      setMicMsg("Voice input stopped.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setMicState("error");
      setMicMsg("Voice recognition is not supported in this browser. Chrome or Edge is recommended.");
      return;
    }

    // Cancel active synthesis so audio doesn't feedback into microphone
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    stopVoiceInput();
    isStoppingRef.current = false;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setMicState("listening");
        setMicMsg("Listening... Speak into your microphone.");
      };

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        isListeningRef.current = false;
        setMicState("idle");
        if (transcript && transcript.trim()) {
          setMicMsg(`Recognized: "${transcript.trim()}"`);
          submitMessage(transcript.trim());
          setTimeout(() => setMicMsg(""), 4000);
        }
      };

      recognition.onerror = (event) => {
        isListeningRef.current = false;
        recognitionRef.current = null;

        // Intentional stop or abort should not set an error state
        if (event.error === "aborted" || isStoppingRef.current) {
          setMicState("idle");
          setMicMsg("");
          return;
        }

        if (event.error === "no-speech") {
          setMicState("idle");
          setMicMsg("No speech detected. Tap the microphone to try again.");
          return;
        }

        setMicState("error");
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicMsg("Microphone access was blocked. Please enable microphone permissions in your browser address bar.");
        } else if (event.error === "audio-capture") {
          setMicMsg("Microphone input was not detected. Please verify your microphone is plugged in and enabled.");
        } else if (event.error === "network") {
          setMicMsg("Network error connecting to speech service. Check your connection or use the text input below.");
        } else {
          setMicMsg(`Speech recognition error (${event.error}). You can type your question below.`);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        recognitionRef.current = null;
        setMicState((prev) => (prev === "listening" ? "idle" : prev));
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition initialization failed:", err);
      isListeningRef.current = false;
      recognitionRef.current = null;
      setMicState("error");
      setMicMsg(`Unable to start voice input (${err.message}). You can type below.`);
    }
  }

  // ── Render Presentation ───────────────────────────────────────────────────
  const isListening = micState === "listening";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              AI Voice Coach
            </h1>
          </div>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500">
            Hands-free spoken analytics, recovery readiness, and personalized athletic insights.
          </p>
        </div>
      </header>

      {/* Current Context Card */}
      {latest && (
        <section className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Active Athlete Telemetry
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Performance</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{latest.overall_score ?? "—"}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Injury Risk</span>
              <span className="text-lg font-bold text-slate-900">{latest.injury_risk ?? "—"}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Avg Fatigue</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{latest.fatigue ?? "—"}</span>
            </div>
          </div>
        </section>
      )}

      {/* Quick Prompts */}
      <section className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Quick Inquiries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {["Analyze my performance", "Am I at injury risk?", "Tell me about my fatigue", "Motivate me"].map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => submitMessage(q)}
              className="text-left p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-medium text-slate-700 hover:text-blue-700 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Microphone Interaction Panel */}
      <section className="bg-white border border-slate-200/90 rounded-xl p-8 shadow-xs text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Mic Button */}
          <div className="relative mb-4 flex items-center justify-center">
            {isListening && (
              <span className="absolute w-24 h-24 rounded-full bg-blue-500/20 animate-ping"></span>
            )}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={!isSupported}
              title={!isSupported ? "Voice recognition not supported in this browser" : isListening ? "Stop listening" : "Start speaking"}
              className={`w-18 h-18 rounded-full flex items-center justify-center text-white transition-all shadow-sm cursor-pointer z-10 disabled:opacity-40 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? (
                <Square className="w-6 h-6" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Status Message */}
          <div className="min-h-6 flex items-center justify-center">
            {micMsg ? (
              <p
                className={`text-xs font-medium m-0 flex items-center gap-1.5 ${
                  micState === "error"
                    ? "text-red-600"
                    : isListening
                    ? "text-blue-600"
                    : "text-slate-600"
                }`}
              >
                {micState === "error" && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>{micMsg}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium m-0">
                {isSupported ? "Click the microphone to start speaking" : "Speech recognition unavailable"}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or type query</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Text Input Fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitMessage(textInput);
            }}
            className="w-full flex gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask about performance, fatigue, or recovery..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>

      {/* Conversation History */}
      {messages.length > 0 && (
        <section className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight m-0">
              Dialogue Transcript
            </h2>
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                if (typeof window !== "undefined" && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                setMicMsg("");
                setMicState("idle");
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col transition-opacity duration-200 ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60"
                  }`}
                >
                  {m.role === "coach" && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 mb-1">
                      <Bot className="w-3 h-3" />
                      <span>Coach</span>
                    </div>
                  )}
                  <p className="m-0 whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </section>
      )}
    </div>
  );
}