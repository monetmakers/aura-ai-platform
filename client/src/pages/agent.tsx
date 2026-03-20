import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AgentPage() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useState("friendly");
  const [name, setName] = useState("Aria");
  const [greeting, setGreeting] = useState("Hey there! 👋 How can I help you today?");
  const [persona, setPersona] = useState("You are a helpful, warm customer service agent for our business. Always be concise, friendly, and solution-focused. Never make up information — if you don't know, say so honestly.");
  const [escalate, setEscalate] = useState(true);
  const [formality, setFormality] = useState(40);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tones = [
    { key: "friendly",    label: t("agent.friendly"),    icon: "😊", desc: t("agent.friendlyDesc") },
    { key: "professional",label: t("agent.professional"), icon: "💼", desc: t("agent.professionalDesc") },
    { key: "playful",     label: t("agent.playful"),      icon: "✨", desc: t("agent.playfulDesc") },
    { key: "concise",     label: t("agent.concise"),      icon: "⚡", desc: t("agent.conciseDesc") },
  ];

  const escalationRules = [
    { label: t("agent.escalateOnUnsure"),     sub: t("agent.escalateOnUnsureSub"),     val: escalate, set: setEscalate },
    { label: t("agent.collectEmail"),          sub: t("agent.collectEmailSub"),          val: false,   set: () => {} },
    { label: t("agent.sendEscalationEmail"),   sub: t("agent.sendEscalationEmailSub"),   val: true,    set: () => {} },
  ];

  const stats = [
    { label: t("agent.docsTrained"),      value: "0",    color: "#60a5fa" },
    { label: t("agent.convsHandled"),     value: "0",    color: "#34d399" },
    { label: t("agent.avgConfidenceStat"),value: "—",    color: "#f59e0b" },
    { label: t("agent.lastTrained"),      value: t("common.never"), color: "#f472b6" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">◈ {t("nav.agents")}</span>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {saved && <span className="save-toast">{t("agent.savedSuccess")}</span>}
          <button className="a-btn a-btn-primary" onClick={handleSave} data-testid="button-save-agent">{t("agent.saveChanges")}</button>
        </div>
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("agent.title")}</div>
            <div className="a-page-sub">{t("agent.subtitle")}</div>
          </div>
          <div className="status-pill">
            <div className="status-dot" />
            {t("agent.agentActive")}
          </div>
        </div>

        <div className="agent-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="a-card a-anim" style={{ animationDelay: "0.05s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#f59e0b" }}>◈</span><span className="card-hd-title">{t("agent.identitySection")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="a-label">{t("agent.agentName")}</label>
                  <input className="a-input" value={name} onChange={e => setName(e.target.value)} placeholder={t("agent.agentNamePlaceholder")} data-testid="input-agent-name" />
                </div>
                <div>
                  <label className="a-label">{t("agent.greetingMessage")}</label>
                  <input className="a-input" value={greeting} onChange={e => setGreeting(e.target.value)} data-testid="input-agent-greeting" />
                  <div style={{ fontSize: "0.68rem", color: "#4a4035", marginTop: "0.3rem" }}>{t("agent.greetingHint")}</div>
                </div>
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.1s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#60a5fa" }}>⊟</span><span className="card-hd-title">{t("agent.personaSection")}</span></div>
              <label className="a-label">{t("agent.personaLabel")}</label>
              <textarea className="a-textarea" value={persona} onChange={e => setPersona(e.target.value)} style={{ minHeight: 130 }} data-testid="textarea-persona" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                <div style={{ fontSize: "0.68rem", color: "#4a4035" }}>{t("agent.personaHint")}</div>
                <div style={{ fontSize: "0.68rem", color: "#6b6355" }}>{persona.length} chars</div>
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.15s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#34d399" }}>⊕</span><span className="card-hd-title">{t("agent.escalationSection")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {escalationRules.map((r, i) => (
                  <div key={i} className="a-toggle-wrap">
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#c8a96e" }}>{r.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "#6b6355", marginTop: "0.1rem" }}>{r.sub}</div>
                    </div>
                    <div className={`a-toggle ${r.val ? "on" : ""}`} onClick={() => r.set((v: boolean) => !v)} data-testid={`toggle-escalation-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="a-card a-anim" style={{ animationDelay: "0.07s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#f472b6" }}>◉</span><span className="card-hd-title">{t("agent.toneSection")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.2rem" }}>
                {tones.map(tn => (
                  <button
                    key={tn.key}
                    className={`tone-option ${tone === tn.key ? "active" : ""}`}
                    onClick={() => setTone(tn.key)}
                    data-testid={`tone-${tn.key}`}
                  >
                    <span className="tone-icon">{tn.icon}</span>
                    <div>
                      <div className="tone-label">{tn.label}</div>
                      <div className="tone-desc">{tn.desc}</div>
                    </div>
                    {tone === tn.key && <span className="tone-check">✓</span>}
                  </button>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <label className="a-label" style={{ margin: 0 }}>{t("agent.formalityLabel")}</label>
                  <span style={{ fontSize: "0.7rem", color: "#f59e0b" }}>{formality}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "0.65rem", color: "#6b6355" }}>{t("common.casual")}</span>
                  <input
                    type="range" min={0} max={100} value={formality}
                    onChange={e => setFormality(Number(e.target.value))}
                    className="a-slider"
                    data-testid="slider-formality"
                  />
                  <span style={{ fontSize: "0.65rem", color: "#6b6355" }}>{t("common.formal")}</span>
                </div>
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.12s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#f59e0b" }}>◻</span><span className="card-hd-title">{t("agent.previewSection")}</span></div>
              <div className="preview-chat">
                <div className="preview-bot-msg">
                  <div className="preview-av">✦</div>
                  <div className="preview-bubble bot">{greeting}</div>
                </div>
                <div className="preview-user-msg">
                  <div className="preview-bubble user">What are your opening hours?</div>
                </div>
                <div className="preview-bot-msg">
                  <div className="preview-av">✦</div>
                  <div className="preview-bubble bot">
                    {tone === "friendly"     && "We're open Mon–Fri 9am–6pm and Sat 10am–4pm. Is there anything else I can help with? 😊"}
                    {tone === "professional" && "Our business hours are Monday to Friday, 9:00 AM – 6:00 PM, and Saturday 10:00 AM – 4:00 PM."}
                    {tone === "playful"      && "We're open Mon–Fri 9–6 and Sat 10–4! 🎉 Anything else you'd like to know?"}
                    {tone === "concise"      && "Mon–Fri 9–6, Sat 10–4."}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "0.8rem", fontSize: "0.68rem", color: "#4a4035", textAlign: "center" }}>
                {t("agent.previewHint")}
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.17s" }}>
              <div className="card-hd"><span className="card-hd-icon" style={{ color: "#34d399" }}>◎</span><span className="card-hd-title">{t("agent.statsSection")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
                    <span style={{ color: "#6b6355" }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .aura-topbar { display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,0.1); }
  .aura-topbar-title { font-size:0.85rem;font-weight:700;color:#c8a96e; }
  .aura-page { flex:1;overflow-y:auto;padding:2rem 2.4rem;display:flex;flex-direction:column;gap:1.4rem; }
  .aura-page::-webkit-scrollbar{width:4px;} .aura-page::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .a-page-hd{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
  .a-page-title{font-family:'Literata',serif;font-size:1.55rem;font-weight:500;color:#f5e6c8;letter-spacing:-.02em;line-height:1.2;}
  .a-page-sub{font-size:.8rem;color:#6b6355;margin-top:.25rem;}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.4rem 1.6rem;}
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-label{font-size:.72rem;font-weight:700;color:#6b6355;margin-bottom:.35rem;display:block;}
  .a-input,.a-textarea{width:100%;background:#0f0d0a;border:1px solid rgba(245,158,11,.1);border-radius:10px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.6rem .9rem;outline:none;transition:border-color .2s;}
  .a-input:focus,.a-textarea:focus{border-color:rgba(245,158,11,.25);}
  .a-input::placeholder,.a-textarea::placeholder{color:#4a4035;}
  .a-textarea{resize:vertical;min-height:90px;line-height:1.6;}
  .a-toggle-wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;}
  .a-toggle{width:38px;height:21px;border-radius:100px;background:#1a1610;border:1px solid rgba(245,158,11,.12);position:relative;cursor:pointer;transition:all .2s;flex-shrink:0;}
  .a-toggle.on{background:rgba(245,158,11,.2);border-color:#f59e0b;}
  .a-toggle::after{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#6b6355;top:2px;left:2px;transition:all .2s;}
  .a-toggle.on::after{background:#f59e0b;left:19px;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.55rem 1.2rem;font-size:.82rem;box-shadow:0 6px 20px rgba(245,158,11,.25);}
  .a-btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(245,158,11,.35);}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-icon{font-size:.9rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .status-pill{display:flex;align-items:center;gap:.45rem;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.2);border-radius:100px;padding:.3rem .8rem;font-size:.72rem;font-weight:700;color:#34d399;}
  .status-dot{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 6px #34d399;animation:a-pulse 2s infinite;}
  .save-toast{font-size:.75rem;font-weight:700;color:#34d399;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);padding:.3rem .8rem;border-radius:8px;animation:a-fadeUp .25s ease;}
  .agent-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:1.2rem;}
  .tone-option{display:flex;align-items:center;gap:.75rem;padding:.7rem .85rem;border-radius:10px;background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.07);cursor:pointer;transition:all .15s;width:100%;text-align:left;font-family:'Syne',sans-serif;}
  .tone-option:hover{background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.15);}
  .tone-option.active{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.25);}
  .tone-icon{font-size:1.1rem;flex-shrink:0;}
  .tone-label{font-size:.8rem;font-weight:700;color:#c8a96e;}
  .tone-desc{font-size:.68rem;color:#6b6355;margin-top:.1rem;}
  .tone-check{margin-left:auto;color:#f59e0b;font-weight:700;font-size:.85rem;}
  .a-slider{flex:1;appearance:none;height:4px;border-radius:100px;background:rgba(245,158,11,.15);outline:none;cursor:pointer;}
  .a-slider::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:#f59e0b;cursor:pointer;box-shadow:0 0 8px rgba(245,158,11,.4);}
  .preview-chat{display:flex;flex-direction:column;gap:.65rem;background:#0f0d0a;border:1px solid rgba(245,158,11,.08);border-radius:12px;padding:1rem;}
  .preview-bot-msg{display:flex;align-items:flex-start;gap:.55rem;}
  .preview-user-msg{display:flex;justify-content:flex-end;}
  .preview-av{width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#0a0805;flex-shrink:0;margin-top:2px;}
  .preview-bubble{padding:.55rem .8rem;border-radius:10px;font-size:.75rem;line-height:1.5;font-family:'Syne',sans-serif;max-width:85%;}
  .preview-bubble.bot{background:#1a1610;border:1px solid rgba(245,158,11,.1);color:#c8a96e;border-radius:2px 10px 10px 10px;}
  .preview-bubble.user{background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.2);color:#f5e6c8;border-radius:10px 10px 2px 10px;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes a-pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @media(max-width:900px){.agent-grid{grid-template-columns:1fr;}}
`;
