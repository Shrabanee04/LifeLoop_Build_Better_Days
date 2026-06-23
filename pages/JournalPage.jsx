import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getJournals, addJournal, uploadJournalImage } from "../api/api";
import { JOURNAL_THEMES, DEFAULT_THEME } from "../journalThemes";
import { useAuth } from "../context/AuthContext";

const EMPTY = {
  title: "",
  content: "",
  date: "",
  mood: "",
  theme: DEFAULT_THEME,
  imageUrl: "",
};

const API_ORIGIN = "http://localhost:8080";

export default function JournalPage() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    if (!user?.id) return;
    getJournals(user.id)
      .then(setJournals)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  const handleChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handlePickTheme = (key) =>
    setForm((f) => ({ ...f, theme: key }));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadJournalImage(file);
      if (res.imageUrl) {
        setForm((f) => ({ ...f, imageUrl: res.imageUrl }));
        flash("🖼️ Image uploaded");
      } else {
        flash(res.error || "Could not upload image");
      }
    } catch {
      flash("Could not upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addJournal({ ...form, userId: user?.id });
    flash("📖 Entry Saved");
    setForm(EMPTY);
    if (fileInputRef.current) fileInputRef.current.value = "";
    load();
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ color: "#6D597A", fontSize: "42px" }}>
            📖 Secret Journal
          </h2>
          <p style={{ color: "#9A7B8F" }}>Capture your precious memories.</p>
        </div>

        {msg && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: "linear-gradient(90deg,#FDEEF4,#EEF8EE)",
              padding: "12px 20px",
              borderRadius: "20px",
              color: "#6D597A",
              fontWeight: "700",
              maxWidth: "280px",
              textAlign: "right",
              fontSize: "13px",
            }}
          >
            {msg}
          </motion.div>
        )}
      </div>

      <motion.form
        onSubmit={handleSubmit}
        whileHover={{ y: -2 }}
        style={{
          background: "linear-gradient(145deg,#FFFDFB,#FFF8FA,#F8FBF4)",
          padding: "35px",
          borderRadius: "30px",
          marginBottom: "35px",
          border: "2px solid #F7E6EC",
          boxShadow: "0 20px 40px rgba(247,202,208,.15)",
        }}
      >
        <h3 style={{ color: "#7B8F6A", marginBottom: "25px", fontSize: "30px" }}>
          🌸 New Entry
        </h3>

        <div className="form-row">
          <div className="field-group field-group--grow">
            <label style={{ color: "#9A7B8F" }}>Title</label>
            <input
              className="field-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Entry title"
              required
              style={{ background: "#fff", borderRadius: "16px", border: "2px solid #F7E6EC" }}
            />
          </div>

          <div className="field-group">
            <label style={{ color: "#9A7B8F" }}>Date</label>
            <input
              className="field-input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={{ background: "#fff", borderRadius: "16px", border: "2px solid #F7E6EC" }}
            />
          </div>

          <div className="field-group">
            <label style={{ color: "#9A7B8F" }}>Mood</label>
            <input
              className="field-input"
              name="mood"
              value={form.mood}
              onChange={handleChange}
              placeholder="Happy 🌸"
              style={{ background: "#fff", borderRadius: "16px", border: "2px solid #F7E6EC" }}
            />
          </div>
        </div>

        {/* ── Theme picker ── */}
        <div className="field-group" style={{ marginTop: "20px" }}>
          <label style={{ color: "#9A7B8F", marginBottom: "10px", display: "block" }}>
            Background theme
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Object.entries(JOURNAL_THEMES).map(([key, theme]) => (
              <motion.button
                type="button"
                key={key}
                onClick={() => handlePickTheme(key)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "62px",
                  height: "62px",
                  borderRadius: "16px",
                  background: theme.background,
                  border:
                    form.theme === key
                      ? "3px solid #6D597A"
                      : "2px solid rgba(255,255,255,.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow:
                    form.theme === key
                      ? "0 8px 18px rgba(109,89,122,.25)"
                      : "0 4px 10px rgba(0,0,0,.06)",
                }}
                title={theme.label}
              >
                {theme.emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Image upload ── */}
        <div className="field-group" style={{ marginTop: "20px" }}>
          <label style={{ color: "#9A7B8F", marginBottom: "10px", display: "block" }}>
            Photo (optional)
          </label>

          {!form.imageUrl ? (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 22px",
                borderRadius: "16px",
                border: "2px dashed #F7CAD0",
                background: "#fff",
                color: "#9A7B8F",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {uploading ? "Uploading…" : "📷 Choose an image"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div style={{ position: "relative", width: "180px" }}>
              <img
                src={`${API_ORIGIN}${form.imageUrl}`}
                alt="Journal upload preview"
                style={{
                  width: "180px",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  border: "2px solid #F7E6EC",
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#6D597A",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="field-group" style={{ marginTop: "20px" }}>
          <label style={{ color: "#9A7B8F", marginBottom: "10px" }}>Your Thoughts</label>
          <textarea
            className="field-input field-textarea"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your thoughts..."
            rows={6}
            required
            style={{
              background: "#fff",
              border: "2px solid #F7E6EC",
              borderRadius: "20px",
              padding: "18px",
              resize: "none",
            }}
          />
        </div>

        <div style={{ marginTop: "25px" }}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={uploading}
            style={{
              border: "none",
              borderRadius: "30px",
              padding: "16px 35px",
              background: "linear-gradient(90deg,#FDEEF4,#EEF8EE,#F8F5E8)",
              color: "#6D597A",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 15px 35px rgba(247,202,208,.2)",
            }}
          >
            📖 Save Entry
          </motion.button>
        </div>
      </motion.form>

      <div>
        {journals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "50px",
              textAlign: "center",
              background: "#FFFDFB",
              borderRadius: "30px",
              border: "2px dashed #F7CAD0",
              color: "#9A7B8F",
            }}
          >
            <h3>🌸 Your diary is empty</h3>
            <p>Write your first beautiful memory.</p>
          </motion.div>
        )}

        {[...journals].reverse().map((j) => {
          const theme = JOURNAL_THEMES[j.theme] || JOURNAL_THEMES[DEFAULT_THEME];

          return (
            <motion.div
              key={j.id}
              whileHover={{ scale: 1.01, y: -3 }}
              onClick={() => setExpanded(expanded === j.id ? null : j.id)}
              style={{
                background: theme.background,
                borderRadius: "25px",
                padding: "22px",
                marginBottom: "18px",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                {j.imageUrl && (
                  <img
                    src={`${API_ORIGIN}${j.imageUrl}`}
                    alt={j.title}
                    style={{
                      width: "84px",
                      height: "84px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      flexShrink: 0,
                      border: "2px solid rgba(255,255,255,.8)",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#6D597A", marginBottom: "8px" }}>
                    {theme.emoji} {j.title}
                  </h3>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {j.date && (
                      <span
                        style={{
                          background: "rgba(255,255,255,.7)",
                          padding: "6px 12px",
                          borderRadius: "15px",
                          color: "#6D597A",
                        }}
                      >
                        📅 {j.date}
                      </span>
                    )}

                    {j.mood && (
                      <span
                        style={{
                          background: "rgba(255,255,255,.7)",
                          padding: "6px 12px",
                          borderRadius: "15px",
                          color: "#7B8F6A",
                        }}
                      >
                        🌸 {j.mood}
                      </span>
                    )}
                  </div>
                </div>

                <span style={{ fontSize: "20px", color: "#6D597A" }}>
                  {expanded === j.id ? "▲" : "▼"}
                </span>
              </div>

              {expanded === j.id && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: "20px",
                    color: "#4a4456",
                    lineHeight: "1.8",
                    borderTop: "1px solid rgba(255,255,255,.6)",
                    paddingTop: "18px",
                  }}
                >
                  {j.content}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
