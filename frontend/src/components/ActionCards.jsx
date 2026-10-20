import { useNavigate } from "react-router-dom";
import { Gauge, ShieldAlert, Bot, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MotionButton = motion.button;

function ActionCards() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const actions = [
    {
      title: "Performance Diagnostics",
      desc: "Input biometrics, calculate acute load, and review radar balance.",
      icon: <Gauge className="w-5 h-5" />,
      onClick: () => navigate("/performance"),
    },
    {
      title: "Injury & Fatigue Watch",
      desc: "Track multi-session fatigue trends and recovery risk scores.",
      icon: <ShieldAlert className="w-5 h-5" />,
      onClick: () => navigate("/injury"),
    },
    {
      title: "Voice AI Coach",
      desc: "Access hands-free spoken feedback and athletic recommendations.",
      icon: <Bot className="w-5 h-5" />,
      onClick: () => navigate("/coach"),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight m-0">
          Platform Workflows
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Direct navigation to core sports science modules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actions.map((action, i) => (
          <MotionButton
            key={i}
            type="button"
            onClick={action.onClick}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.22,
              delay: shouldReduceMotion ? 0 : i * 0.06,
              ease: "easeOut",
            }}
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.99, y: 0 }}
            className="group text-left bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0d1b2a]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-all duration-200">
                  {action.icon}
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors m-0">
                {action.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {action.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1B2E4B] flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              <span>Open module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </MotionButton>
        ))}
      </div>
    </div>
  );
}

export default ActionCards;
