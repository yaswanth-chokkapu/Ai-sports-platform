import { useNavigate } from "react-router-dom";
import { Gauge, ShieldAlert, Bot, ArrowRight } from "lucide-react";

function ActionCards() {
  const navigate = useNavigate();

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
          <div
            key={i}
            onClick={action.onClick}
            style={{ animationDelay: `${i * 60}ms` }}
            className="group animate-fade-in bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-all">
                  {action.icon}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
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
              <span>&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionCards;
