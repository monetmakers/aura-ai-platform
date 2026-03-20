import { useState, useRef, useEffect } from "react";

const SAMPLE_REPLIES = [
  "Thanks for reaching out! I'd be happy to help with that. Could you give me a bit more detail?",
  "Great question! Based on the information I have, I'd say the best option would be to check your account settings first.",
  "Absolutely! Our return policy allows returns within 30 days of purchase. Just bring your receipt and the item in original condition.",
  "I understand your frustration. Let me look into this for you — can you share your order number?",
  "We're open Monday to Friday, 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. Is there anything else I can help with?",
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there! 👋 How can I help you today? I'm here to answer any questions about our products, policies, or services." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [temp, setTemp] = useState(0.7);
  const [useContext, setUseContext] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: SAMPLE_REPLIES[Math.floor(Math.random() * SAMPLE_REPLIES.length)] }]);
    }, 1200 + Math.random() * 800);
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">◻ Playground</span>
        <button className="a-btn a-btn-ghost" onClick={() => setMessages([{ from: "bot", text: "Hey there! 👋 How can I help you today?" }])}>
          ↺ Reset conversation
        </button>
      </div>

      <div className="pg-layout">
        {/* Chat panel */}
        <div className="pg-chat-panel">
          <div className="pg-chat-header">
            <div className="pg-agent-av">✦</div>
            <div>
              <div className="pg-agent-name">Aria <span className="pg-agent-badge">Test mode</span></div>
              <div className="pg-agent-sub">Main Store · AI Customer Agent</div>
            </div>
            <div className="pg-online"><div className="pg-online-dot" />Live</div>
          </div>

          <div className="pg-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`pg-msg-wrap ${msg.from}`}>
                {msg.from === "bot" && <div className="pg-bot-av">✦</div>}
                <div className={`pg-bubble ${msg.from}`}>{msg.text}</div>
              </div>
            ))}
            {typing && (
              <div className="pg-msg-wrap bot">
                <div className="pg-bot-av">✦</div>
                <div className="pg-bubble bot pg-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="pg-input-row">
            <textarea
              className="pg-input"
              placeholder="Type a message to test your agent…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="pg-send" onClick={send} disabled={!input.trim()}>↑</button>
          </div>
        </div>

        {/* Settings panel */}
        <div className="pg-settings-panel">

          {/* Model settings */}
          <div className="a-card" style={{ marginBottom: "1rem" }}>
            <div className="card-hd"><span style={{ color: "#f59e0b" }}>⚙</span><span className="card-hd-title">Model Settings</span></div>

            <div style={{ marginBottom: "1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label className="a-label" style={{ margin: 0 }}>Creativity (Temperature)</label>
                <span style={{ fontSize: "0.72rem", color: "#f59e0b", fontWeight: 700 }}>{temp.toFixed(1)}</span>
              </div>
              <input type="range" min={0} max={1} step={0.1} value={temp} onChange={e => setTemp(Number(e.target.value))} className="a-slider" style={{ width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem", fontSize: "0.62rem", color: "#4a4035" }}>
                <span>Precise</span><span>Balanced</span><span>Creative</span>
              </div>
            </div>

            {[
              { label: "Use document context", sub: "Ground responses in uploaded docs", val: useContext, set: setUseContext },
              { label: "Strict mode", sub: "Only answer from known knowledge", val: strictMode, set: setStrictMode },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem", marginBottom: i === 0 ? "0.8rem" : 0 }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#c8a96e" }}>{s.label}</div>
                  <div style={{ fontSize: "0.67rem", color: "#6b6355" }}>{s.sub}</div>
                </div>
                <div className={`a-toggle ${s.val ? "on" : ""}`} onClick={() => s.set(v => !v)} />
              </div>
            ))}
          </div>

          {/* Agent info */}
          <div className="a-card" style={{ marginBottom: "1rem" }}>
            <div className="card-hd"><span style={{ color: "#34d399" }}>◈</span><span className="card-hd-title">Agent Info</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { label: "Agent name",  value: "Aria",       color: "#f5e6c8" },
                { label: "Tone",        value: "Friendly",   color: "#f59e0b" },
                { label: "Documents",   value: "0 loaded",   color: "#60a5fa" },
                { label: "Status",      value: "Active",     color: "#34d399" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "#6b6355" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message stats */}
          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#60a5fa" }}>◎</span><span className="card-hd-title">Session Stats</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { label: "Messages sent",  value: messages.filter(m => m.from === "user").length },
                { label: "Bot replies",    value: messages.filter(m => m.from === "bot").length - 1 },
                { label: "Avg response",   value: "~1.4s" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "#6b6355" }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: "#c8a96e" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

const css = `
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-ghost{background:rgba(245,158,11,.07);color:#c8a96e;border:1px solid rgba(245,158,11,.12);border-radius:10px;padding:.45rem 1rem;font-size:.78rem;}
  .a-btn-ghost:hover{background:rgba(245,158,11,.12);}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.3rem 1.4rem;}
  .a-label{font-size:.72rem;font-weight:700;color:#6b6355;margin-bottom:.35rem;display:block;}
  .a-toggle{width:38px;height:21px;border-radius:100px;background:#1a1610;border:1px solid rgba(245,158,11,.12);position:relative;cursor:pointer;transition:all .2s;flex-shrink:0;}
  .a-toggle.on{background:rgba(245,158,11,.2);border-color:#f59e0b;}
  .a-toggle::after{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#6b6355;top:2px;left:2px;transition:all .2s;}
  .a-toggle.on::after{background:#f59e0b;left:19px;}
  .a-slider{appearance:none;height:4px;border-radius:100px;background:rgba(245,158,11,.15);outline:none;cursor:pointer;}
  .a-slider::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:#f59e0b;cursor:pointer;box-shadow:0 0 8px rgba(245,158,11,.4);}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}

  .pg-layout{flex:1;display:grid;grid-template-columns:1fr 280px;overflow:hidden;}
  .pg-chat-panel{display:flex;flex-direction:column;border-right:1px solid rgba(245,158,11,.08);overflow:hidden;}
  .pg-chat-header{display:flex;align-items:center;gap:.75rem;padding:.9rem 1.4rem;border-bottom:1px solid rgba(245,158,11,.08);background:#0a0805;flex-shrink:0;}
  .pg-agent-av{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:#0a0805;font-weight:900;flex-shrink:0;}
  .pg-agent-name{font-size:.85rem;font-weight:700;color:#f5e6c8;display:flex;align-items:center;gap:.5rem;}
  .pg-agent-badge{font-size:.58rem;font-weight:700;background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);padding:.15rem .5rem;border-radius:100px;letter-spacing:.05em;text-transform:uppercase;}
  .pg-agent-sub{font-size:.68rem;color:#6b6355;margin-top:.1rem;}
  .pg-online{margin-left:auto;display:flex;align-items:center;gap:.35rem;font-size:.68rem;color:#34d399;font-weight:600;}
  .pg-online-dot{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 6px #34d399;animation:a-pulse 2s infinite;}

  .pg-messages{flex:1;overflow-y:auto;padding:1.2rem 1.4rem;display:flex;flex-direction:column;gap:.75rem;background:#0f0d0a;}
  .pg-messages::-webkit-scrollbar{width:4px;} .pg-messages::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .pg-msg-wrap{display:flex;align-items:flex-start;gap:.55rem;}
  .pg-msg-wrap.user{flex-direction:row-reverse;}
  .pg-bot-av{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#0a0805;font-weight:900;flex-shrink:0;margin-top:2px;}
  .pg-bubble{padding:.65rem .95rem;border-radius:12px;font-size:.8rem;line-height:1.55;font-family:'Syne',sans-serif;max-width:75%;animation:a-fadeUp .25s ease both;}
  .pg-bubble.bot{background:#141109;border:1px solid rgba(245,158,11,.1);color:#c8a96e;border-radius:2px 12px 12px 12px;}
  .pg-bubble.user{background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.2);color:#f5e6c8;border-radius:12px 12px 2px 12px;}
  .pg-typing{display:flex;align-items:center;gap:4px;padding:.75rem 1rem;}
  .pg-typing span{width:6px;height:6px;border-radius:50%;background:#f59e0b;animation:a-pulse 1.2s infinite;}
  .pg-typing span:nth-child(2){animation-delay:.2s;}
  .pg-typing span:nth-child(3){animation-delay:.4s;}

  .pg-input-row{display:flex;align-items:flex-end;gap:.6rem;padding:.9rem 1.2rem;border-top:1px solid rgba(245,158,11,.08);background:#0a0805;flex-shrink:0;}
  .pg-input{flex:1;background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:12px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.65rem 1rem;outline:none;resize:none;line-height:1.5;transition:border-color .2s;}
  .pg-input:focus{border-color:rgba(245,158,11,.25);}
  .pg-input::placeholder{color:#4a4035;}
  .pg-send{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;color:#0a0805;font-size:1rem;cursor:pointer;transition:all .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:900;}
  .pg-send:hover{transform:scale(1.05);}
  .pg-send:disabled{opacity:.4;cursor:not-allowed;transform:none;}

  .pg-settings-panel{overflow-y:auto;padding:1.2rem;display:flex;flex-direction:column;background:#0a0805;}
  .pg-settings-panel::-webkit-scrollbar{width:0;}

  @keyframes a-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes a-pulse{0%,100%{opacity:1}50%{opacity:.3}}
`;
