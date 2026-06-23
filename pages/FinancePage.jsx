import { useEffect, useState } from "react";
import { getExpenses, addExpense } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { title: "", amount: "", type: "Expense", category: "", date: "" };

const CATEGORIES = ["Food", "Transport", "Health", "Shopping", "Entertainment", "Education", "Other"];

export default function FinancePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const load = () => getExpenses(user?.id).then(setExpenses).catch(() => {});
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExpense({ ...form, amount: parseFloat(form.amount), userId: user?.id });
    flash("Expense recorded.");
    setForm(EMPTY);
    load();
  };

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const income = expenses.filter((e) => e.type === "Income").reduce((s, e) => s + e.amount, 0);
  const spent = expenses.filter((e) => e.type === "Expense").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Finance</h2>
        {msg && <span className="flash-msg">{msg}</span>}
      </header>

      <div className="finance-summary">
        <div className="finance-stat">
          <span className="finance-stat-label">Total entries</span>
          <span className="finance-stat-value">{expenses.length}</span>
        </div>
        <div className="finance-stat finance-stat--income">
          <span className="finance-stat-label">Income</span>
          <span className="finance-stat-value">₹{income.toLocaleString("en-IN")}</span>
        </div>
        <div className="finance-stat finance-stat--expense">
          <span className="finance-stat-label">Expenses</span>
          <span className="finance-stat-value">₹{spent.toLocaleString("en-IN")}</span>
        </div>
        <div className="finance-stat">
          <span className="finance-stat-label">Balance</span>
          <span className={`finance-stat-value ${income - spent >= 0 ? "text-green" : "text-red"}`}>
            ₹{(income - spent).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        <h3 className="form-heading">Record transaction</h3>
        <div className="form-row">
          <div className="field-group field-group--grow">
            <label className="field-label">Title</label>
            <input className="field-input" name="title" value={form.title}
              onChange={handleChange} placeholder="e.g. Groceries" required />
          </div>
          <div className="field-group">
            <label className="field-label">Amount (₹)</label>
            <input className="field-input" type="number" name="amount" value={form.amount}
              onChange={handleChange} placeholder="0.00" min="0" step="0.01" required />
          </div>
        </div>
        <div className="form-row">
          <div className="field-group">
            <label className="field-label">Type</label>
            <select className="field-input" name="type" value={form.type}
              onChange={handleChange}>
              <option>Expense</option>
              <option>Income</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Category</label>
            <select className="field-input" name="category" value={form.category}
              onChange={handleChange}>
              <option value="">Select</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Date</label>
            <input className="field-input" type="date" name="date" value={form.date}
              onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit">Add transaction</button>
        </div>
      </form>

      <div className="item-list">
        {expenses.length === 0 && (
          <p className="empty-state">No transactions yet. Add one above.</p>
        )}
        {[...expenses].reverse().map((ex) => (
          <div key={ex.id} className="expense-row">
            <div className="expense-left">
              <span className={`expense-type-badge ${ex.type === "Income" ? "badge--income" : "badge--expense"}`}>
                {ex.type === "Income" ? "+" : "−"}
              </span>
              <div>
                <p className="expense-title">{ex.title}</p>
                <div className="expense-meta">
                  {ex.category && <span className="tag">{ex.category}</span>}
                  {ex.date && <span className="tag tag--date">{ex.date}</span>}
                </div>
              </div>
            </div>
            <span className={`expense-amount ${ex.type === "Income" ? "text-green" : "text-red"}`}>
              {ex.type === "Income" ? "+" : "−"}₹{ex.amount?.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
