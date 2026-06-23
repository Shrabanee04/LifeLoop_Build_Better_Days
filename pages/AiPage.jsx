import { useState, useRef, useEffect } from "react";
import { aiChat } from "../api/api";
import { useAuth } from "../context/AuthContext";

const SUGGESTIONS = [
  "How many tasks do I have?",
  "How am I doing this week?",
  "What's my most common mood?",
  "How much have I spent recently?",
  "Give me some encouragement",
];

export default function AiPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I can tell you about your tasks, events, journals, moods, and expenses — or just chat. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await aiChat(q, user?.id);
      setMessages((m) => [...m, { role: "ai", text: res.response }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Could not connect to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--chat ai-flower-page">
      <div className="flower-sky" aria-hidden="true">
        <span className="flower-bloom flower-bloom--one">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
        <span className="flower-bloom flower-bloom--two">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
        <span className="flower-bloom flower-bloom--three">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
        <span className="flower-petal flower-petal--one"></span>
        <span className="flower-petal flower-petal--two"></span>
        <span className="flower-petal flower-petal--three"></span>
        <span className="flower-petal flower-petal--four"></span>
        <span className="flower-petal flower-petal--five"></span>
        <span className="flower-vine flower-vine--left"></span>
        <span className="flower-vine flower-vine--right"></span>
      </div>

      <header className="page-header ai-flower-header">
        <div>
          <span className="ai-flower-kicker">Blooming assistant</span>
          <h2 className="page-title ai-flower-title">AI Assistant</h2>
        </div>
        <span className="ai-flower-status" aria-label="AI online">
          <span></span>
          Live
        </span>
      </header>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
            {m.role === "ai" && <span className="chat-avatar">AI</span>}
            <p className="chat-text">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble--ai">
            <span className="chat-avatar">AI</span>
            <p className="chat-text chat-typing">Thinking...</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="field-input chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your data..."
          disabled={loading}
        />
        <button className="btn btn--primary" onClick={() => send()} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
