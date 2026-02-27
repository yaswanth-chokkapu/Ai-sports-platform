import { motion } from "framer-motion";

function VoiceCoach({ reply }) {
  if (!reply) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="section-title">🎤 AI Coach</h3>
      <p style={{ marginTop: "6px" }}>{reply}</p>
    </motion.div>
  );
}

export default VoiceCoach;




