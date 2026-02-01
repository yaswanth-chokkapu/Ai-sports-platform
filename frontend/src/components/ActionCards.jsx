import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ActionCards() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Check Performance",
      desc: "Analyze your training session & metrics",
      onClick: () => navigate("/performance")
    },
    {
      title: "Submit Session",
      desc: "Submit today’s session & update graphs live",
      onClick: () => navigate("/performance")
    },
    {
      title: "AI Voice Coach",
      desc: "Get spoken insights & motivation",
      onClick: () => navigate("/coach")
    }
  ];

  return (
    <motion.div
      className="action-grid"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }
      }}
    >
      {actions.map((a, i) => (
        <motion.div
          key={i}
          className="action-card"
          onClick={a.onClick}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <h4>{a.title}</h4>
          <p>{a.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ActionCards;

