import { useState } from "react";
import { memoryRecall } from "../api/api";

export default function MemoryPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecall = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await memoryRecall(question);
      setAnswer(res.answer);
    } catch {
      setAnswer("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Memory Recall</h2>
        <p className="page-subtitle">Ask a question and get a summary of your recorded data.</p>
      </header>

      <form onSubmit={handleRecall} className="card form-card">
        <div className="field-group">
          <label className="field-label">Your question</label>
          <input
            className="field-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Give me a summary of my life data"
            required
          />
        </div>
        <div className="form-actions">
          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Recalling…" : "Recall"}
          </button>
        </div>
      </form>

      {answer && (
        <div className="card memory-result">
          <h3 className="memory-result-title">⧫ Memory Summary</h3>
          <pre className="memory-answer">{answer}</pre>
        </div>
      )}
    </div>
  );
}
