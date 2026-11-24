import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAssistantMessage } from "../../services/assistantService";
import { birthdayConfig } from "../../data/birthdayConfig";
import "./LumiChat.css";

export function LumiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hiiii! I'm Lumi 🌟 your birthday-sized sidekick. Ask me for wishes, jokes, or a poem — I've got range." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendAssistantMessage(msg);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Oops, I tripped over a candle. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([{ role: "assistant", text: "Fresh start! What do you want to hear? 🎉" }]);

  return (
    <>
      <button className="lumi-fab" onClick={() => setOpen((o) => !o)} aria-label="Open Lumi assistant">
        {open ? "✕" : "🤖"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lumi-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Lumi birthday assistant chat"
          >
            <header className="lumi-panel__header">
              <div>
                <strong>{birthdayConfig.assistant.name}</strong>
                <p>{birthdayConfig.assistant.tagline}</p>
              </div>
              <button onClick={clearChat} className="lumi-clear" aria-label="Clear chat">Clear</button>
            </header>

            <div className="lumi-panel__messages" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`lumi-msg lumi-msg--${m.role}`}>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="lumi-msg lumi-msg--assistant lumi-typing">
                  <span /><span /><span />
                </div>
              )}
            </div>

            <div className="lumi-chips">
              {birthdayConfig.assistant.suggestedPrompts.slice(0, 4).map((p) => (
                <button key={p} className="lumi-chip" onClick={() => send(p)}>{p}</button>
              ))}
            </div>

            <form
              className="lumi-panel__input"
              onSubmit={(e) => { e.preventDefault(); send(); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Lumi something…"
                aria-label="Message Lumi"
              />
              <button type="submit" disabled={loading}>Send</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
