import { useEffect, useState } from "react";
import { getDashboard, sendWeeklyReportNow } from "../api/api";
import { useAuth } from "../context/AuthContext";

const moodEmoji = (mood) => {
  const m = mood?.toLowerCase() || "";
  if (m.includes("happy") || m.includes("great")) return "😄";
  if (m.includes("sad") || m.includes("bad")) return "😔";
  if (m.includes("angry")) return "😠";
  if (m.includes("anxious") || m.includes("stressed")) return "😰";
  if (m.includes("calm") || m.includes("okay")) return "😌";
  return "🙂";
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportMsg, setReportMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getDashboard(user?.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleSendReport = async () => {
    if (!user?.id) return;
    setSending(true);
    setReportMsg("");
    try {
      const res = await sendWeeklyReportNow(user.id);
      setReportMsg(res.message || "Report sent.");
    } catch {
      setReportMsg("Could not send report — is the backend running?");
    } finally {
      setSending(false);
      setTimeout(() => setReportMsg(""), 4000);
    }
  };

  if (loading) return <div className="page-loading">Loading dashboard…</div>;

  const stats = [
    { label: "Tasks", value: data?.totalTasks ?? "—", icon: "✓", color: "var(--accent-tasks)" },
    { label: "Events", value: data?.totalEvents ?? "—", icon: "◷", color: "var(--accent-events)" },
    { label: "Journals", value: data?.totalJournals ?? "—", icon: "✦", color: "var(--accent-journal)" },
    { label: "Mood Logs", value: data?.totalMoodLogs ?? "—", icon: "◉", color: "var(--accent-mood)" },
    { label: "Expenses", value: data?.totalExpenses ?? "—", icon: "◈", color: "var(--accent-finance)" },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <span className="page-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </header>

      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleSendReport}
          disabled={sending}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {sending ? "Sending…" : "📧 Email me this week's report now"}
        </button>
        {reportMsg && <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{reportMsg}</span>}
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon, color }) => (
          <div className="stat-card" key={label} style={{ "--card-accent": color }}>
            <span className="stat-icon">{icon}</span>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-mood-card">
          <p className="mood-card-label">Latest mood</p>
          <div className="mood-card-content">
            <span className="mood-emoji">{moodEmoji(data?.latestMood)}</span>
            <span className="mood-text">{data?.latestMood || "None logged"}</span>
          </div>
        </div>

        <div className="dashboard-score-card">
          <p className="score-label">Productivity score</p>
          <div className="score-ring">
            <span className="score-number">{data?.productivityScore ?? 0}</span>
          </div>
          <p className="score-hint">Based on tasks, events, journals & mood logs</p>
        </div>
      </div>
    </div>
  );
}
