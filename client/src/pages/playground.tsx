import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PlaygroundPage() {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState([
    { from: "bot", text: t("playground.welcomeMessage") }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [temp, setTemp] = useState(0.7);
  const [useContext, setUseContext] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    
    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: msg.text,
      }));
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          conversationId: "playground", 
          agentId: "default-agent",
          language: language,
          context: useContext ? conversationHistory : undefined,
        }),
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data = await response.json();
      setMessages(m => [...m, { from: "bot", text: data.message.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(m => [...m, { 
        from: "bot", 
        text: t("playground.errorMessage") || "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setTyping(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  const toggleSettings = [
    { label: t("playground.useDocContext"), sub: t("playground.useDocContextSub"), val: useContext, set: setUseContext },
    { label: t("playground.strictMode"),    sub: t("playground.strictModeSub"),    val: strictMode, set: setStrictMode },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="playground-page">
        
        <div className="page-header">
          <div>
            <h1 className="page-title">🧪 {t("playground.title")}</h1>
            <p className="page-subtitle">{t("playground.subtitle")}</p>
          </div>
          <button className="btn-clear" onClick={() => setMessages([{ from: "bot", text: t("playground.welcomeMessage") }])}>
            Clear Chat
          </button>
        </div>

        <div className="playground-grid">
          
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.from}`}>
                  {msg.from === "bot" && (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="avatar">
                      <defs>
                        <linearGradient id={`bot-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: "#10b981"}} />
                          <stop offset="100%" style={{stopColor: "#3b82f6"}} />
                        </linearGradient>
                      </defs>
                      <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill={`url(#bot-${i})`}/>
                      <circle cx="12" cy="14" r="2" fill="white"/>
                      <circle cx="20" cy="14" r="2" fill="white"/>
                      <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <circle cx="16" cy="7" r="1" fill="white"/>
                      <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  <div className="bubble">{msg.text}</div>
                </div>
              ))}
              {typing && (
                <div className="message bot">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="avatar">
                    <defs>
                      <linearGradient id="bot-typing" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#10b981"}} />
                        <stop offset="100%" style={{stopColor: "#3b82f6"}} />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#bot-typing)"/>
                    <circle cx="12" cy="14" r="2" fill="white"/>
                    <circle cx="20" cy="14" r="2" fill="white"/>
                    <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="16" cy="7" r="1" fill="white"/>
                    <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="bubble typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="input-area">
              <textarea
                className="input"
                placeholder={t("playground.inputPlaceholder")}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={2}
              />
              <button className="send-btn" onClick={send} disabled={!input.trim() || typing}>
                ➤
              </button>
            </div>
          </div>

          <div className="sidebar">
            <div className="card">
              <h3 className="card-title">⚙️ Settings</h3>
              <div className="settings-list">
                {toggleSettings.map((setting, i) => (
                  <div key={i} className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">{setting.label}</div>
                      <div className="setting-desc">{setting.sub}</div>
                    </div>
                    <div className={`toggle ${setting.val ? "on" : ""}`} onClick={() => setting.set(!setting.val)} />
                  </div>
                ))}
                
                <div className="setting-item slider-setting">
                  <div className="setting-info">
                    <div className="setting-label">Temperature</div>
                    <div className="setting-desc">Creativity level</div>
                  </div>
                  <div className="slider-value">{temp.toFixed(1)}</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="slider"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">📊 Session Stats</h3>
              <div className="stats-list">
                <div className="stat-row">
                  <span>Messages Sent</span>
                  <span className="stat-value">{messages.filter(m => m.from === "user").length}</span>
                </div>
                <div className="stat-row">
                  <span>Bot Replies</span>
                  <span className="stat-value">{Math.max(0, messages.filter(m => m.from === "bot").length - 1)}</span>
                </div>
                <div className="stat-row">
                  <span>Avg Response</span>
                  <span className="stat-value">~1.4s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .playground-page {
    padding: 2rem;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'Inter', sans-serif;
    height: calc(100vh - 4rem);
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f3f4f6;
    margin: 0 0 0.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0;
  }

  .btn-clear {
    background: #1f2937;
    color: #f3f4f6;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-clear:hover {
    background: #374151;
  }

  .playground-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 1024px) {
    .playground-grid {
      grid-template-columns: 1fr;
    }
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    overflow: hidden;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .messages::-webkit-scrollbar {
    width: 6px;
  }

  .messages::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 3px;
  }

  .message {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    animation: fadeIn 0.3s ease;
  }

  .message.user {
    flex-direction: row-reverse;
  }

  .avatar {
    flex-shrink: 0;
    filter: drop-shadow(0 2px 6px rgba(16, 185, 129, 0.3));
  }

  .bubble {
    padding: 0.875rem 1.125rem;
    border-radius: 12px;
    max-width: 70%;
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .message.bot .bubble {
    background: #1f2937;
    border: 1px solid #374151;
    color: #d1d5db;
    border-radius: 4px 12px 12px 12px;
  }

  .message.user .bubble {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: #f3f4f6;
    border-radius: 12px 4px 12px 12px;
  }

  .typing-indicator {
    display: flex;
    gap: 0.375rem;
    padding: 1rem 1.25rem;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    animation: bounce 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .input-area {
    display: flex;
    gap: 0.75rem;
    padding: 1.25rem;
    border-top: 1px solid #1f2937;
    background: #0f172a;
  }

  .input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    color: #f3f4f6;
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    padding: 0.875rem 1.125rem;
    resize: none;
    outline: none;
    transition: all 0.2s;
  }

  .input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .send-btn {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 1.25rem;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .setting-info {
    flex: 1;
  }

  .setting-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .setting-desc {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .toggle {
    width: 44px;
    height: 24px;
    border-radius: 100px;
    background: #374151;
    border: 1px solid #4b5563;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .toggle.on {
    background: rgba(16, 185, 129, 0.2);
    border-color: #10b981;
  }

  .toggle::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #9ca3af;
    top: 2px;
    left: 2px;
    transition: all 0.2s;
  }

  .toggle.on::after {
    background: #10b981;
    left: 22px;
  }

  .slider-setting {
    flex-direction: column;
    align-items: flex-start;
  }

  .slider-value {
    font-size: 0.875rem;
    font-weight: 700;
    color: #10b981;
  }

  .slider {
    width: 100%;
    appearance: none;
    height: 6px;
    border-radius: 100px;
    background: #374151;
    outline: none;
    cursor: pointer;
    margin-top: 0.75rem;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .stat-value {
    font-weight: 700;
    color: #10b981;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
  }
`;
