import { useState } from "react";
import { motion } from "framer-motion";

function Contact() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData(e.target);
    formData.append("access_key", "4cb52b79-d55a-41df-a63b-e07efef6496e");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    setLoading(false);

    if (result.success) {
      setStatus("✅ Message sent successfully!");
      e.target.reset();
    } else {
      setStatus("❌ Something went wrong. Try again.");
    }
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <section className="page-header">
        <h1 className="page-title">📩 Contact Admin</h1>
        <p className="page-subtitle">
          Have feedback, issues, or ideas? Reach out directly.
        </p>
      </section>

      <section className="dashboard-section">
        <motion.div
          className="card"
          style={{ maxWidth: "520px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              style={inputStyle}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              style={inputStyle}
            />

            <label>Message</label>
            <textarea
              name="message"
              required
              rows="4"
              placeholder="Your message..."
              style={inputStyle}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "10px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                width: "100%",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>

          {status && (
            <p className="muted" style={{ marginTop: "12px" }}>
              {status}
            </p>
          )}
        </motion.div>
      </section>
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

export default Contact;
