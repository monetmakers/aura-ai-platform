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
    { label: t("agent.docsTrained"),      value: "0",    color: "#3b82f6" },
    { label: t("agent.convsHandled"),     value: "0",    color: "#10b981" },
    { label: t("agent.avgConfidenceStat"),value: "—",    color: "#f59e0b" },
    { label: t("agent.lastTrained"),      value: t("common.never"), color: "#ec4899" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="agent-page">
        
        <div className="page-header">
          <div>
            <h1 className="page-title">{t("agent.title")}</h1>
            <p className="page-subtitle">{t("agent.subtitle")}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {saved && <span className="save-toast">✓ {t("agent.savedSuccess")}</span>}
            <button className="btn-primary" onClick={handleSave} data-testid="button-save-agent">
              {t("agent.saveChanges")}
            </button>
          </div>
        </div>

        <div className="status-banner">
          <div className="status-indicator online" />
          <span>{t("agent.agentActive")}</span>
        </div>

        <div className="agent-grid">
          {/* Left Column */}
          <div className="agent-column">
            
            {/* Identity Card */}
            <div className="card" style={{ animationDelay: "0.05s" }}>
              <div className="card-header">
                <span className="card-icon">🤖</span>
                <h3 className="card-title">{t("agent.identitySection")}</h3>
              </div>
              <div className="field-group">
                <div className="field">
                  <label className="label">{t("agent.agentName")}</label>
                  <input 
                    className="input" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder={t("agent.agentNamePlaceholder")} 
                    data-testid="input-agent-name" 
                  />
                </div>
                <div className="field">
                  <label className="label">{t("agent.greetingMessage")}</label>
                  <input 
                    className="input" 
                    value={greeting} 
                    onChange={e => setGreeting(e.target.value)} 
                    data-testid="input-agent-greeting" 
                  />
                  <div className="hint">{t("agent.greetingHint")}</div>
                </div>
              </div>
            </div>

            {/* Persona Card */}
            <div className="card" style={{ animationDelay: "0.1s" }}>
              <div className="card-header">
                <span className="card-icon">📝</span>
                <h3 className="card-title">{t("agent.personaSection")}</h3>
              </div>
              <label className="label">{t("agent.personaLabel")}</label>
              <textarea 
                className="textarea" 
                value={persona} 
                onChange={e => setPersona(e.target.value)} 
                data-testid="textarea-persona"
                rows={6}
              />
              <div className="field-footer">
                <span className="hint">{t("agent.personaHint")}</span>
                <span className="char-count">{persona.length} chars</span>
              </div>
            </div>

            {/* Escalation Card */}
            <div className="card" style={{ animationDelay: "0.15s" }}>
              <div className="card-header">
                <span className="card-icon">🔔</span>
                <h3 className="card-title">{t("agent.escalationSection")}</h3>
              </div>
              <div className="toggle-list">
                {escalationRules.map((rule, i) => (
                  <div key={i} className="toggle-item">
                    <div className="toggle-content">
                      <div className="toggle-label">{rule.label}</div>
                      <div className="toggle-desc">{rule.sub}</div>
                    </div>
                    <div 
                      className={`toggle ${rule.val ? "on" : ""}`} 
                      onClick={() => rule.set((v: boolean) => !v)} 
                      data-testid={`toggle-escalation-${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="agent-column">
            
            {/* Tone Card */}
            <div className="card" style={{ animationDelay: "0.07s" }}>
              <div className="card-header">
                <span className="card-icon">🎭</span>
                <h3 className="card-title">{t("agent.toneSection")}</h3>
              </div>
              <div className="tone-grid">
                {tones.map(tn => (
                  <button
                    key={tn.key}
                    className={`tone-btn ${tone === tn.key ? "active" : ""}`}
                    onClick={() => setTone(tn.key)}
                    data-testid={`tone-${tn.key}`}
                  >
                    <span className="tone-icon">{tn.icon}</span>
                    <div className="tone-info">
                      <div className="tone-label">{tn.label}</div>
                      <div className="tone-desc">{tn.desc}</div>
                    </div>
                    {tone === tn.key && <span className="tone-check">✓</span>}
                  </button>
                ))}
              </div>
              
              <div className="field" style={{ marginTop: "1.5rem" }}>
                <div className="slider-header">
                  <label className="label">{t("agent.formalityLabel")}</label>
                  <span className="formality-value">{formality}%</span>
                </div>
                <div className="slider-wrapper">
                  <span className="slider-label">{t("common.casual")}</span>
                  <input
                    type="range" 
                    min={0} 
                    max={100} 
                    value={formality}
                    onChange={e => setFormality(Number(e.target.value))}
                    className="slider"
                    data-testid="slider-formality"
                  />
                  <span className="slider-label">{t("common.formal")}</span>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="card" style={{ animationDelay: "0.12s" }}>
              <div className="card-header">
                <span className="card-icon">💬</span>
                <h3 className="card-title">{t("agent.previewSection")}</h3>
              </div>
              <div className="chat-preview">
                <div className="chat-message bot">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="bot-avatar">
                    <defs>
                      <linearGradient id="bot-av-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#bot-av-grad)"/>
                    <circle cx="12" cy="14" r="2" fill="white"/>
                    <circle cx="20" cy="14" r="2" fill="white"/>
                    <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="16" cy="7" r="1" fill="white"/>
                    <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="message-bubble bot">{greeting}</div>
                </div>
                <div className="chat-message user">
                  <div className="message-bubble user">What are your opening hours?</div>
                </div>
                <div className="chat-message bot">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="bot-avatar">
                    <defs>
                      <linearGradient id="bot-av-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#bot-av-grad2)"/>
                    <circle cx="12" cy="14" r="2" fill="white"/>
                    <circle cx="20" cy="14" r="2" fill="white"/>
                    <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="16" cy="7" r="1" fill="white"/>
                    <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="message-bubble bot">
                    {tone === "friendly"     && "We're open Mon–Fri 9am–6pm and Sat 10am–4pm. Is there anything else I can help with? 😊"}
                    {tone === "professional" && "Our business hours are Monday to Friday, 9:00 AM – 6:00 PM, and Saturday 10:00 AM – 4:00 PM."}
                    {tone === "playful"      && "We're open Mon–Fri 9–6 and Sat 10–4! 🎉 Anything else you'd like to know?"}
                    {tone === "concise"      && "Mon–Fri 9–6, Sat 10–4."}
                  </div>
                </div>
              </div>
              <div className="preview-hint">{t("agent.previewHint")}</div>
            </div>

            {/* Stats Card */}
            <div className="card" style={{ animationDelay: "0.17s" }}>
              <div className="card-header">
                <span className="card-icon">📊</span>
                <h3 className="card-title">{t("agent.statsSection")}</h3>
              </div>
              <div className="stats-list">
                {stats.map((stat, i) => (
                  <div key={i} className="stat-row">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
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
  .agent-page {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'Inter', sans-serif;
  }

  /* Page Header */
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
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0 0 0.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  }

  .save-toast {
    font-size: 0.875rem;
    font-weight: 700;
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    animation: fadeIn 0.3s ease;
  }

  /* Status Banner */
  .status-banner {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
    padding: 0.75rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #10b981;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
    animation: pulse 2s infinite;
  }

  /* Grid Layout */
  .agent-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .agent-grid {
      grid-template-columns: 1fr;
    }
  }

  .agent-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Card */
  .card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 1.75rem;
    animation: fadeUp 0.5s ease both;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .card-icon {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0;
  }

  /* Form Fields */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #d1d5db;
  }

  .input,
  .textarea {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    color: #f3f4f6;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    padding: 0.875rem 1.125rem;
    outline: none;
    transition: all 0.2s;
  }

  .input:focus,
  .textarea:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .input::placeholder,
  .textarea::placeholder {
    color: #6b7280;
  }

  .textarea {
    resize: vertical;
    line-height: 1.6;
  }

  .hint {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .field-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .char-count {
    font-size: 0.8125rem;
    color: #9ca3af;
    font-weight: 600;
  }

  /* Toggle List */
  .toggle-list {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .toggle-content {
    flex: 1;
  }

  .toggle-label {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .toggle-desc {
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

  /* Tone Grid */
  .tone-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tone-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.125rem;
    border-radius: 12px;
    background: #1f2937;
    border: 1px solid #374151;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    font-family: 'Inter', sans-serif;
  }

  .tone-btn:hover {
    background: #374151;
    border-color: #4b5563;
  }

  .tone-btn.active {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  }

  .tone-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .tone-info {
    flex: 1;
  }

  .tone-label {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .tone-desc {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .tone-check {
    color: #10b981;
    font-weight: 700;
    font-size: 1.125rem;
  }

  /* Slider */
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .formality-value {
    font-size: 0.875rem;
    font-weight: 700;
    color: #10b981;
  }

  .slider-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider-label {
    font-size: 0.8125rem;
    color: #9ca3af;
    white-space: nowrap;
  }

  .slider {
    flex: 1;
    appearance: none;
    height: 6px;
    border-radius: 100px;
    background: #374151;
    outline: none;
    cursor: pointer;
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

  .slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  }

  /* Chat Preview */
  .chat-preview {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    background: #0f172a;
    border: 1px solid #1f2937;
    border-radius: 14px;
    padding: 1.25rem;
  }

  .chat-message {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .chat-message.user {
    justify-content: flex-end;
  }

  .bot-avatar {
    flex-shrink: 0;
    filter: drop-shadow(0 2px 6px rgba(16, 185, 129, 0.3));
  }

  .message-bubble {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    line-height: 1.6;
    max-width: 85%;
  }

  .message-bubble.bot {
    background: #1f2937;
    border: 1px solid #374151;
    color: #d1d5db;
    border-radius: 4px 12px 12px 12px;
  }

  .message-bubble.user {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: #f3f4f6;
    border-radius: 12px 12px 4px 12px;
  }

  .preview-hint {
    text-align: center;
    font-size: 0.8125rem;
    color: #6b7280;
    margin-top: 0.75rem;
  }

  /* Stats List */
  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9375rem;
  }

  .stat-label {
    color: #9ca3af;
  }

  .stat-value {
    font-weight: 700;
  }

  /* Animations */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
