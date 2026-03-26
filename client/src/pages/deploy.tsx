import { useState } from "react";
import { useTranslation } from "react-i18next";

const WIDGET_CODE = (agentId: string, color: string, pos: string, name: string) =>
`<script>
  window.AuraConfig = {
    agentId: "${agentId}",
    position: "${pos}",
    primaryColor: "${color}",
    botName: "${name}",
    greeting: "Hey there! How can I help?"
  };
</script>
<script src="https://cdn.aura.ai/widget.js" async></script>`;

export default function DeployPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("web");
  const [copied, setCopied] = useState<string | null>(null);

  const CHANNELS = [
    { key: "web",       icon: "🌐", name: t("deploy.webWidget"),    desc: t("deploy.webWidgetDesc"),   color: "#10b981" },
    { key: "whatsapp",  icon: "💬", name: t("deploy.whatsapp"),     desc: t("deploy.whatsappDesc"),    color: "#25d366" },
    { key: "messenger", icon: "💙", name: t("deploy.messenger"),    desc: t("deploy.messengerDesc"),   color: "#0084ff" },
    { key: "instagram", icon: "📷", name: t("deploy.instagram"),    desc: t("deploy.instagramDesc"),   color: "#e1306c" },
    { key: "api",       icon: "⚙️", name: t("deploy.restApi"),      desc: t("deploy.restApiDesc"),     color: "#3b82f6" },
  ];

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <style>{css}</style>
      <div className="deploy-page">
        
        <div className="page-header">
          <div>
            <h1 className="page-title">🚀 {t("deploy.title")}</h1>
            <p className="page-subtitle">{t("deploy.subtitle")}</p>
          </div>
        </div>

        <div className="channels-grid">
          {CHANNELS.map(channel => (
            <button
              key={channel.key}
              className={`channel-card ${active === channel.key ? "active" : ""}`}
              onClick={() => setActive(channel.key)}
            >
              <div className="channel-icon" style={{ background: `${channel.color}15`, color: channel.color }}>
                {channel.icon}
              </div>
              <div className="channel-info">
                <div className="channel-name">{channel.name}</div>
                <div className="channel-desc">{channel.desc}</div>
              </div>
              {active === channel.key && <span className="check">✓</span>}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 {active === "web" ? "Website Integration" : active === "api" ? "API Integration" : "Social Media Setup"}</h3>
          </div>
          
          {active === "web" && (
            <div className="code-section">
              <p className="instructions">Copy this code and paste it before the closing &lt;/body&gt; tag on your website:</p>
              <div className="code-block">
                <code>{WIDGET_CODE("demo-agent-001", "#10b981", "bottom-right", "Aria")}</code>
                <button className="copy-btn" onClick={() => copyCode(WIDGET_CODE("demo-agent-001", "#10b981", "bottom-right", "Aria"))}>
                  {copied === WIDGET_CODE("demo-agent-001", "#10b981", "bottom-right", "Aria") ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {active === "api" && (
            <div className="code-section">
              <p className="instructions">Use our REST API to integrate Aura into any application:</p>
              <div className="code-block">
                <code>{`POST https://api.aura.ai/v1/chat
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "agentId": "demo-agent-001",
  "message": "Hello, I need help",
  "sessionId": "user-session-123"
}`}</code>
                <button className="copy-btn" onClick={() => copyCode("API_CODE")}>
                  {copied === "API_CODE" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {(active === "whatsapp" || active === "messenger" || active === "instagram") && (
            <div className="social-setup">
              <div className="setup-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Connect Your Account</h4>
                    <p>Click the button below to authenticate with {active === "whatsapp" ? "WhatsApp Business" : active === "messenger" ? "Facebook Messenger" : "Instagram"}</p>
                    <button className="btn-connect">Connect {CHANNELS.find(c => c.key === active)?.name}</button>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Configure Permissions</h4>
                    <p>Grant Aura permission to send and receive messages on your behalf</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Start Receiving Messages</h4>
                    <p>Your AI agent will automatically respond to incoming messages</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const css = `
  .deploy-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  }

  .page-header {
    margin-bottom: 2rem;
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

  .channels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .channel-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: #111827;
    border: 2px solid #1f2937;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    position: relative;
  }

  .channel-card:hover {
    border-color: #374151;
    transform: translateY(-2px);
  }

  .channel-card.active {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }

  .channel-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .channel-name {
    font-size: 1rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .channel-desc {
    font-size: 0.8125rem;
    color: #9ca3af;
    line-height: 1.5;
  }

  .check {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #10b981;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 1.75rem;
  }

  .card-header {
    margin-bottom: 1.5rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0;
  }

  .code-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .instructions {
    font-size: 0.9375rem;
    color: #d1d5db;
    margin: 0;
    line-height: 1.6;
  }

  .code-block {
    position: relative;
    background: #0f172a;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 1.25rem;
  }

  .code-block code {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: #10b981;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .copy-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #1f2937;
    border: 1px solid #374151;
    color: #f3f4f6;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover {
    background: #374151;
  }

  .social-setup {
    padding: 1rem 0;
  }

  .setup-steps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .step {
    display: flex;
    gap: 1.25rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid #10b981;
    color: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .step-content h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 0.5rem;
  }

  .step-content p {
    font-size: 0.9375rem;
    color: #9ca3af;
    margin: 0 0 1rem;
    line-height: 1.6;
  }

  .btn-connect {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-connect:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }
`;
