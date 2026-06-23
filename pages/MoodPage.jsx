import { useEffect, useState } from "react";
import { getMoods, addMood } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { mood: "", note: "", date: "" };

const MOOD_OPTIONS = [
  { label: "😄 Happy", value: "Happy" },
  { label: "😌 Calm", value: "Calm" },
  { label: "😐 Okay", value: "Okay" },
  { label: "😔 Sad", value: "Sad" },
  { label: "😰 Anxious", value: "Anxious" },
  { label: "😠 Angry", value: "Angry" },
  { label: "🤩 Excited", value: "Excited" },
  { label: "😴 Tired", value: "Tired" },
];

const moodBg = {
  Happy: "#fef9c3", Calm: "#dcfce7", Okay: "#f1f5f9",
  Sad: "#dbeafe", Anxious: "#fef3c7", Angry: "#fee2e2",
  Excited: "#fae8ff", Tired: "#e2e8f0",
};

export default function MoodPage() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const load = () => getMoods(user?.id).then(setMoods).catch(() => {});
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMood({ ...form, userId: user?.id });
    flash("Mood logged.");
    setForm(EMPTY);
    load();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Mood Tracker</h2>
        {msg && <span className="flash-msg">{msg}</span>}
      </header>

      <form onSubmit={handleSubmit} className="card form-card">
        <h3 className="form-heading">Log mood</h3>
        <div className="mood-picker">
          {MOOD_OPTIONS.map(({ label, value }) => (
            <button
              type="button"
              key={value}
              className={`mood-chip${form.mood === value ? " mood-chip--selected" : ""}`}
              onClick={() => setForm((f) => ({ ...f, mood: value }))}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="form-row">
          <div className="field-group field-group--grow">
            <label className="field-label">Note</label>
            <input className="field-input" name="note" value={form.note}
              onChange={handleChange} placeholder="What's on your mind?" />
          </div>
          <div className="field-group">
            <label className="field-label">Date</label>
            <input className="field-input" type="date" name="date" value={form.date}
              onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit" disabled={!form.mood}>
            Log mood
          </button>
        </div>
      </form>

      <div className="mood-timeline">
        {moods.length === 0 && (
          <p className="empty-state">No moods logged yet.</p>
        )}
        {[...moods].reverse().map((m) => (
          <div
            key={m.id}
            className="mood-entry"
            style={{ background: moodBg[m.mood] || "#f8fafc" }}
          >
            <span className="mood-entry-label">{m.mood}</span>
            {m.note && <span className="mood-entry-note">{m.note}</span>}
            {m.date && <span className="mood-entry-date">{m.date}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
