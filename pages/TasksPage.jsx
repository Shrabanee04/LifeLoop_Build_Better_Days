import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { title: "", description: "", priority: "Medium", deadline: "", category: "" };

const priorityColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // task id being edited
  const [msg, setMsg] = useState("");

  const load = () => getTasks(user?.id).then(setTasks).catch(() => {});

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing !== null) {
      await updateTask(editing, form);
      flash("Task updated.");
      setEditing(null);
    } else {
      await addTask({ ...form, userId: user?.id });
      flash("Task added.");
    }
    setForm(EMPTY);
    load();
  };

  const handleEdit = (task) => {
    setEditing(task.id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      category: task.category,
    });
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    flash("Task deleted.");
    load();
  };

  const handleComplete = async (id) => {
    await completeTask(id);
    flash("Task marked complete.");
    load();
  };

  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Tasks</h2>
        {msg && <span className="flash-msg">{msg}</span>}
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card form-card">
        <h3 className="form-heading">{editing !== null ? "Edit task" : "New task"}</h3>
        <div className="form-row">
          <div className="field-group field-group--grow">
            <label className="field-label">Title</label>
            <input className="field-input" name="title" value={form.title}
              onChange={handleChange} placeholder="Task title" required />
          </div>
          <div className="field-group">
            <label className="field-label">Priority</label>
            <select className="field-input" name="priority" value={form.priority}
              onChange={handleChange}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field-group field-group--grow">
            <label className="field-label">Description</label>
            <input className="field-input" name="description" value={form.description}
              onChange={handleChange} placeholder="Optional description" />
          </div>
          <div className="field-group">
            <label className="field-label">Deadline</label>
            <input className="field-input" type="date" name="deadline" value={form.deadline}
              onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">Category</label>
            <input className="field-input" name="category" value={form.category}
              onChange={handleChange} placeholder="e.g. Work" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit">
            {editing !== null ? "Update" : "Add task"}
          </button>
          {editing !== null && (
            <button className="btn btn--ghost" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="item-list">
        {tasks.length === 0 && (
          <p className="empty-state">No tasks yet. Add one above.</p>
        )}
        {tasks.map((t) => (
          <div key={t.id} className={`task-card${t.status === "Completed" ? " task-card--done" : ""}`}>
            <div className="task-main">
              <span
                className="priority-dot"
                style={{ background: priorityColor[t.priority] || "#94a3b8" }}
              />
              <div>
                <p className="task-title">{t.title}</p>
                {t.description && <p className="task-desc">{t.description}</p>}
                <div className="task-meta">
                  {t.category && <span className="tag">{t.category}</span>}
                  {t.deadline && <span className="tag tag--date">Due {t.deadline}</span>}
                  <span className={`tag tag--status ${t.status === "Completed" ? "tag--done" : "tag--pending"}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="task-actions">
              {t.status !== "Completed" && (
                <button className="icon-btn icon-btn--green" onClick={() => handleComplete(t.id)} title="Complete">✓</button>
              )}
              <button className="icon-btn" onClick={() => handleEdit(t)} title="Edit">✎</button>
              <button className="icon-btn icon-btn--red" onClick={() => handleDelete(t.id)} title="Delete">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
