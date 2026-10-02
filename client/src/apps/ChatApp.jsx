import { useEffect, useRef, useState } from "react";
import { SendGlyph, SparkleIcon } from "../components/icons.jsx";
import { askQuestion } from "../lib/api.js";

function startersFor(resume) {
  const lastProject = resume?.projects?.at(-1)?.name.split(/\s[–-]\s/)[0];
  return [
    "What are your skills?",
    ...(lastProject ? [`Tell me about ${lastProject}`] : []),
    "Where do you study?",
    "Which certifications do you have?",
  ];
}

// "Ask Me": a chat answered only from the resume.
export default function ChatApp({ resume, active }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const firstName = resume?.name?.split(" ")[0] || "me";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (active) inputRef.current?.focus({ preventScroll: true });
  }, [active]);

  async function send(text) {
    const question = text.trim();
    if (!question || busy) return;
    const history = messages.filter((m) => !m.error && !m.failed).map(({ role, content }) => ({ role, content })).slice(-6);
    const asked = { role: "user", content: question };
    setMessages((current) => [...current, asked]);
    setInput("");
    setBusy(true);
    try {
      const { answer } = await askQuestion(question, history);
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (error) {
      // Keep a refused question out of later history, or the server would refuse every follow-up too.
      setMessages((current) => [
        ...current.map((m) => (m === asked ? { ...m, failed: true } : m)),
        { role: "assistant", content: error.message, error: true },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat__list" ref={listRef}>
        {messages.length === 0 && (
          <div className="chat__empty">
            <SparkleIcon size={30} />
            <strong>👋 Ask me anything!</strong>
            <span>Answers come only from {firstName}'s resume.</span>
            <div className="chat__starters">
              {startersFor(resume).map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble-msg ${m.role === "user" ? "is-user" : "is-bot"} ${m.error ? "is-error" : ""}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="bubble-msg is-bot is-typing"><span /><span /><span /></div>}
      </div>
      <form className="chat__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={500}
          placeholder="Type a message…" aria-label="Message" />
        <button type="submit" disabled={!input.trim() || busy} aria-label="Send"><SendGlyph size={16} /></button>
      </form>
    </div>
  );
}
