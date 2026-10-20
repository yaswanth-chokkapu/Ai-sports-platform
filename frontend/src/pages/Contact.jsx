import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function Contact() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.target);
    formData.append("access_key", "4cb52b79-d55a-41df-a63b-e07efef6496e");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully. Our support team will review your inquiry.",
        });
        e.target.reset();
      } else {
        setStatus({
          type: "error",
          message: "Something went wrong sending your message. Please try again.",
        });
      }
    } catch {
      setLoading(false);
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-slate-200 dark:border-[#223854]">
        <div className="flex items-center gap-2.5">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact Support & Feedback
          </h1>
        </div>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Have questions, telemetry feedback, or platform recommendations? Contact our engineering team.
        </p>
      </header>

      {/* Contact Form Card */}
      <section className="bg-white dark:bg-[#132238] border border-slate-200/90 dark:border-[#223854] rounded-xl p-6 sm:p-8 shadow-xs transition-colors">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Athlete Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              placeholder="Alex Johnson"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#223854] bg-white dark:bg-[#1B2E4B] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              placeholder="athlete@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#223854] bg-white dark:bg-[#1B2E4B] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Message or Diagnostic Note
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows="4"
              placeholder="Describe your inquiry or session feedback..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#223854] bg-white dark:bg-[#1B2E4B] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>

        {status && (
          <div
            className={`mt-5 p-3.5 rounded-lg border flex items-center gap-2.5 text-xs font-medium ${
              status.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </section>
    </div>
  );
}

export default Contact;
