import React, { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome! Ask me about water sustainability." }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Send message handler
  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((msgs) => [...msgs, { from: "user", text: trimmed }]);
    setInput("");

    try {
      // Call the /api/chat endpoint
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      // Add bot reply
      setMessages((msgs) => [...msgs, { from: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, I couldn't reply right now." }
      ]);
    }
  };

  return (
    <div className="chat-widget">
      <button
        className="chat-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        💬 Chat
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
