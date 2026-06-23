import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { addEvent, getEvents } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EMPTY = {
  title: "",
  description: "",
  date: "",
  time: "",
  type: "",
};

const typeColor = {
  Meeting: "#A8C3A0",
  Personal: "#F7CAD0",
  Work: "#E9C46A",
  Birthday: "#E8A0BF",
  Other: "#C9D6C3",
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const flash = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 2500);
  };

  const load = async () => {
    if (!user?.id) return;
    try {
      const data = await getEvents(user.id);
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
      flash("Could not load events");
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Backend expects one combined ISO datetime, e.g. "2026-06-25T14:30:00".
      const eventDateTime = form.date
        ? `${form.date}T${form.time || "00:00"}:00`
        : null;

      await addEvent({
        title: form.title,
        description: form.description,
        eventDateTime,
        type: form.type,
        userId: user?.id,
      });

      flash(
        user?.email
          ? `Event added — you'll get a reminder at ${user.email} 5 min before`
          : "Event added"
      );
      setForm(EMPTY);
      load();
    } catch {
      flash("Could not add event");
    }
  };

  // Group by the date portion of eventDateTime (e.g. "2026-06-25").
  const grouped = events.reduce((acc, event) => {
    const key = event.eventDateTime ? event.eventDateTime.split("T")[0] : "No date";
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2 style={{ color: "#6D597A", fontSize: "35px" }}>Calendar</h2>
          <p style={{ color: "#8A817C" }}>Plan your beautiful days.</p>
        </div>

        {msg && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: "#FDEEF4",
              padding: "10px 18px",
              borderRadius: "20px",
              color: "#6D597A",
              maxWidth: "320px",
              textAlign: "right",
              fontSize: "13px",
            }}
          >
            {msg}
          </motion.div>
        )}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        style={{
          padding: "35px",
          borderRadius: "30px",
          background: "linear-gradient(145deg,#FFFDFB,#FFF7FA,#F8FBF4)",
          marginBottom: "35px",
          border: "2px solid #F7E6EC",
          boxShadow: "0 20px 50px rgba(247,202,208,.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          style={{
            position: "absolute",
            top: 20,
            right: 25,
            fontSize: "30px",
            opacity: 0.5,
          }}
        >
          🌸
        </motion.div>

        <h3
          style={{
            marginBottom: "10px",
            color: "#7B8F6A",
            fontSize: "28px",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          Create a New Memory
        </h3>

        <p style={{ color: "#9A7B8F", fontSize: "13px", marginBottom: "26px" }}>
          🔔 We'll email you at <strong>{user?.email || "your account email"}</strong> 5
          minutes before it starts.
        </p>

        <div className="form-row">
          <div className="field-group field-group--grow">
            <label style={{ color: "#9A7B8F", marginBottom: "8px", fontWeight: "700" }}>Title</label>
            <input
              className="field-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Birthday, Meeting..."
              required
              style={{ background: "#fff", border: "2px solid #F7E6EC", borderRadius: "16px" }}
            />
          </div>

          <div className="field-group">
            <label style={{ color: "#9A7B8F", marginBottom: "8px", fontWeight: "700" }}>Type</label>
            <select
              className="field-input"
              name="type"
              value={form.type}
              onChange={handleChange}
              style={{ background: "#fff", border: "2px solid #F7E6EC", borderRadius: "16px" }}
            >
              <option value="">Choose</option>
              {Object.keys(typeColor).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field-group">
            <label style={{ color: "#9A7B8F", fontWeight: "700" }}>Date</label>
            <input
              className="field-input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{ background: "#fff", border: "2px solid #F7E6EC", borderRadius: "16px" }}
            />
          </div>

          <div className="field-group">
            <label style={{ color: "#9A7B8F", fontWeight: "700" }}>Time</label>
            <input
              className="field-input"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              style={{ background: "#fff", border: "2px solid #F7E6EC", borderRadius: "16px" }}
            />
          </div>

          <div className="field-group field-group--grow">
            <label style={{ color: "#9A7B8F", fontWeight: "700" }}>Description</label>
            <input
              className="field-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write something..."
              style={{ background: "#fff", border: "2px solid #F7E6EC", borderRadius: "16px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "25px" }}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            style={{
              padding: "16px 35px",
              border: "none",
              borderRadius: "30px",
              background: "linear-gradient(90deg,#FDEEF4,#EEF8EE,#F8F5E8)",
              color: "#6D597A",
              fontWeight: "800",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 15px 35px rgba(247,202,208,.2)",
            }}
          >
            Save Event
          </motion.button>
        </div>
      </motion.form>

      <div>
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "50px",
              background: "#FFFDFB",
              borderRadius: "30px",
              color: "#9A7B8F",
              border: "2px dashed #F7CAD0",
            }}
          >
            <h3>Nothing planned yet</h3>
            <p>Create your first special moment.</p>
          </motion.div>
        )}

        {sortedDates.map((date) => (
          <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#7B8F6A", marginBottom: "18px", fontWeight: "800" }}>{date}</h3>

            {grouped[date].map((event) => {
              const time = event.eventDateTime
                ? event.eventDateTime.split("T")[1]?.slice(0, 5)
                : null;

              return (
                <motion.div
                  key={event.id ?? `${event.eventDateTime}-${event.title}`}
                  whileHover={{ scale: 1.02, y: -3 }}
                  style={{
                    background: "#FFFDFB",
                    borderRadius: "24px",
                    padding: "20px",
                    marginBottom: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderLeft: `8px solid ${typeColor[event.type] || "#C9D6C3"}`,
                    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
                  }}
                >
                  <div>
                    <h4 style={{ color: "#6D597A", marginBottom: "6px" }}>{event.title}</h4>
                    {event.description && <p style={{ color: "#8A817C" }}>{event.description}</p>}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {time && <div style={{ color: "#7B8F6A", marginBottom: "10px" }}>{time}</div>}

                    {event.type && (
                      <span
                        style={{
                          background: typeColor[event.type] || "#C9D6C3",
                          padding: "8px 14px",
                          borderRadius: "20px",
                          color: "#fff",
                          fontWeight: "700",
                        }}
                      >
                        {event.type}
                      </span>
                    )}

                    <div style={{ marginTop: "8px", fontSize: "11px", color: event.notified ? "#84a98c" : "#C9A0B0" }}>
                      {event.notified ? "🔔 Reminder sent" : "🔕 Reminder pending"}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
