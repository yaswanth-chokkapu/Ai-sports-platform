import { Bot } from "lucide-react";

function VoiceCoach({ reply }) {
  if (!reply) return null;

  return (
    <div className="card transition-all duration-300">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h3 className="section-title m-0">AI Coach</h3>
      </div>
      <p style={{ marginTop: "6px" }}>{reply}</p>
    </div>
  );
}

export default VoiceCoach;




