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

const API_CODE = `// Node.js example
const response = await fetch("https://api.aura.ai/v1/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    agentId: "demo-agent-001",
    message: "Hello, I need help with my order",
    sessionId: "user-session-123"
  })
});
const data = await response.json();
console.log(data.reply); // Agent response`;

export default function DeployPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("web");
  const [copied, setCopied] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#f59e0b");
  const [position, setPosition] = useState("bottom-right");
  const [botName, setBotName] = useState("Aria");

  const CHANNELS = [
    { key: "web",       icon: "◻", name: t("deploy.webWidget"),    desc: t("deploy.webWidgetDesc"),   color: "#f59e0b" },
    { key: "whatsapp",  icon: "💬", name: t("deploy.whatsapp"),     desc: t("deploy.whatsappDesc"),    color: "#25d366" },
    { key: "messenger", icon: "💙", name: t("deploy.messenger"),    desc: t("deploy.messengerDesc"),   color: "#0084ff" },
    { key: "instagram", icon: "📷", name: t("deploy.instagram"),    desc: t("deploy.instagramDesc"),   color: "#e1306c" },
    { key: "api",       icon: "⊕", name: t("deploy.restApi"),      desc: t("deploy.restApiDesc"),     color: "#60a5fa" },
  ];

  const checklist = [
    { label: t("deploy.checklistAgent"),      done: true  },
    { label: t("deploy.checklistDocs"),       done: false },
    { label: t("deploy.checklistPlayground"), done: false },
    { label: t("deploy.checklistWidget"),     done: false },
  ];

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const code = WIDGET_CODE("demo-agent-001", primaryColor, position, botName);

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">⊗ {t("deploy.title")}</span>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <span className="deploy-status"><span className="deploy-dot" />{t("deploy.readyToDeploy")}</span>
        </div>
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("deploy.title")}</div>
            <div className="a-page-sub">{t("deploy.subtitle")}</div>
          </div>
        </div>

        <div className="deploy-channels a-anim" style={{ animationDelay: ".05s" }}>
          {CHANNELS.map(ch => (
            <button
              key={ch.key}
              className={`channel-card ${active === ch.key ? "active" : ""}`}
              onClick={() => setActive(ch.key)}
              data-testid={`channel-${ch.key}`}
            >
              <div className="channel-icon" style={{ color: ch.color }}>{ch.icon}</div>
              <div className="channel-name">{ch.name}</div>
              <div className="channel-desc">{ch.desc}</div>
              {active === ch.key && <div className="channel-pip" />}
            </button>
          ))}
        </div>

        {/* ── WEB WIDGET ── */}
        {active === "web" && (
          <div className="a-grid-2 a-anim" style={{ animationDelay: ".1s" }}>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#f59e0b" }}>◻</span><span className="card-hd-title">{t("deploy.widgetCustomisation")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                <div><label className="a-label">{t("deploy.botName")}</label><input className="a-input" value={botName} onChange={e => setBotName(e.target.value)} data-testid="input-bot-name" /></div>
                <div>
                  <label className="a-label">{t("deploy.primaryColor")}</label>
                  <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 36, height: 36, border: "none", background: "none", cursor: "pointer" }} data-testid="input-primary-color" />
                    <input className="a-input" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label className="a-label">{t("deploy.position")}</label>
                  <select className="a-select" value={position} onChange={e => setPosition(e.target.value)} data-testid="select-position">
                    <option value="bottom-right">{t("deploy.positionBR")}</option>
                    <option value="bottom-left">{t("deploy.positionBL")}</option>
                    <option value="top-right">{t("deploy.positionTR")}</option>
                    <option value="top-left">{t("deploy.positionTL")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#60a5fa" }}>⊟</span><span className="card-hd-title">{t("deploy.embedCode")}</span></div>
              <div className="code-block">
                <pre style={{ margin: 0, fontSize: ".72rem", color: "#c8a96e", lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{code}</pre>
              </div>
              <button className="a-btn a-btn-primary" onClick={() => copy(code, "widget")} style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }} data-testid="button-copy-embed-code">
                {copied === "widget" ? t("deploy.copiedToClipboard") : t("deploy.copyEmbedCode")}
              </button>
              <p className="a-hint">{t("deploy.embedHint")}</p>
            </div>
          </div>
        )}

        {/* ── WHATSAPP ── */}
        {active === "whatsapp" && (
          <div className="a-anim" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#25d366" }}>💬</span><span className="card-hd-title">{t("deploy.wa.guideTitle")}</span></div>
              <div className="steps-list">
                <StepItem n="1" color="#25d366" title={t("deploy.wa.step1Title")}>
                  {t("deploy.wa.step1Desc")}
                  <LinkBtn href="https://business.facebook.com/" label={t("deploy.wa.step1Link")} color="#25d366" />
                </StepItem>
                <StepItem n="2" color="#25d366" title={t("deploy.wa.step2Title")}>
                  {t("deploy.wa.step2Desc")}
                  <LinkBtn href="https://business.facebook.com/wa/manage/" label={t("deploy.wa.step2Link")} color="#25d366" />
                </StepItem>
                <StepItem n="3" color="#25d366" title={t("deploy.wa.step3Title")}>
                  {t("deploy.wa.step3Desc")}
                  <LinkBtn href="https://developers.facebook.com/apps/" label={t("deploy.wa.step3Link")} color="#25d366" />
                </StepItem>
                <StepItem n="4" color="#25d366" title={t("deploy.wa.step4Title")}>
                  {t("deploy.wa.step4Desc")}
                </StepItem>
                <StepItem n="5" color="#25d366" title={t("deploy.wa.step5Title")}>
                  {t("deploy.wa.step5Desc")}{" "}
                  <code style={{ color: "#25d366", background: "rgba(37,211,102,.1)", padding: "0 4px", borderRadius: 4 }}>https://api.aura.ai/webhooks/whatsapp</code>
                </StepItem>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".7rem" }}>
                <div><label className="a-label">{t("deploy.wa.tokenLabel")}</label><input className="a-input" placeholder="EAABs..." data-testid="input-wa-token" /></div>
                <div><label className="a-label">{t("deploy.wa.phoneLabel")}</label><input className="a-input" placeholder="1234567890" data-testid="input-wa-phone-id" /></div>
                <button className="a-btn a-btn-green" data-testid="button-connect-whatsapp">{t("deploy.wa.connectBtn")}</button>
              </div>
            </div>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#25d366" }}>◎</span><span className="card-hd-title">{t("deploy.usefulResources")}</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
                <LinkBtn href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" label={t("deploy.wa.res1")} color="#25d366" />
                <LinkBtn href="https://developers.facebook.com/docs/whatsapp/message-templates" label={t("deploy.wa.res2")} color="#25d366" />
                <LinkBtn href="https://developers.facebook.com/docs/whatsapp/pricing" label={t("deploy.wa.res3")} color="#25d366" />
              </div>
            </div>
          </div>
        )}

        {/* ── MESSENGER ── */}
        {active === "messenger" && (
          <div className="a-anim" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#0084ff" }}>💙</span><span className="card-hd-title">{t("deploy.fb.guideTitle")}</span></div>
              <div className="steps-list">
                <StepItem n="1" color="#0084ff" title={t("deploy.fb.step1Title")}>
                  {t("deploy.fb.step1Desc")}
                  <LinkBtn href="https://www.facebook.com/pages/create/" label={t("deploy.fb.step1Link")} color="#0084ff" />
                </StepItem>
                <StepItem n="2" color="#0084ff" title={t("deploy.fb.step2Title")}>
                  {t("deploy.fb.step2Desc")}
                  <LinkBtn href="https://developers.facebook.com/apps/" label={t("deploy.wa.step3Link")} color="#0084ff" />
                </StepItem>
                <StepItem n="3" color="#0084ff" title={t("deploy.fb.step3Title")}>
                  {t("deploy.fb.step3Desc")}
                </StepItem>
                <StepItem n="4" color="#0084ff" title={t("deploy.fb.step4Title")}>
                  {t("deploy.fb.step4Desc")}{" "}
                  <code style={{ color: "#0084ff", background: "rgba(0,132,255,.1)", padding: "0 4px", borderRadius: 4 }}>https://api.aura.ai/webhooks/messenger</code>
                </StepItem>
                <StepItem n="5" color="#0084ff" title={t("deploy.fb.step5Title")}>
                  {t("deploy.fb.step5Desc")}
                </StepItem>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".7rem" }}>
                <div><label className="a-label">{t("deploy.fb.tokenLabel")}</label><input className="a-input" placeholder="EAABs..." data-testid="input-fb-token" /></div>
                <div><label className="a-label">{t("deploy.fb.pageLabel")}</label><input className="a-input" placeholder="123456789012345" data-testid="input-fb-page-id" /></div>
                <button className="a-btn a-btn-blue" data-testid="button-connect-messenger">{t("deploy.fb.connectBtn")}</button>
              </div>
            </div>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#0084ff" }}>◎</span><span className="card-hd-title">{t("deploy.usefulResources")}</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
                <LinkBtn href="https://developers.facebook.com/docs/messenger-platform/get-started" label={t("deploy.fb.res1")} color="#0084ff" />
                <LinkBtn href="https://developers.facebook.com/docs/messenger-platform/reference/send-api/" label={t("deploy.fb.res2")} color="#0084ff" />
                <LinkBtn href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview" label={t("deploy.fb.res3")} color="#0084ff" />
              </div>
            </div>
          </div>
        )}

        {/* ── INSTAGRAM ── */}
        {active === "instagram" && (
          <div className="a-anim" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#e1306c" }}>📷</span><span className="card-hd-title">{t("deploy.ig.guideTitle")}</span></div>
              <div className="steps-list">
                <StepItem n="1" color="#e1306c" title={t("deploy.ig.step1Title")}>
                  {t("deploy.ig.step1Desc")}
                  <LinkBtn href="https://www.instagram.com/accounts/professional_account_opt_in/" label={t("deploy.ig.step1Link")} color="#e1306c" />
                </StepItem>
                <StepItem n="2" color="#e1306c" title={t("deploy.ig.step2Title")}>
                  {t("deploy.ig.step2Desc")}
                </StepItem>
                <StepItem n="3" color="#e1306c" title={t("deploy.ig.step3Title")}>
                  {t("deploy.ig.step3Desc")}
                  <LinkBtn href="https://developers.facebook.com/docs/instagram-api/getting-started" label={t("deploy.ig.step3Link")} color="#e1306c" />
                </StepItem>
                <StepItem n="4" color="#e1306c" title={t("deploy.ig.step4Title")}>
                  {t("deploy.ig.step4Desc")}
                </StepItem>
                <StepItem n="5" color="#e1306c" title={t("deploy.ig.step5Title")}>
                  {t("deploy.ig.step5Desc")}{" "}
                  <code style={{ color: "#e1306c", background: "rgba(225,48,108,.1)", padding: "0 4px", borderRadius: 4 }}>https://api.aura.ai/webhooks/instagram</code>
                </StepItem>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".7rem" }}>
                <div><label className="a-label">{t("deploy.ig.tokenLabel")}</label><input className="a-input" placeholder="EAABs..." data-testid="input-ig-token" /></div>
                <div><label className="a-label">{t("deploy.ig.accountLabel")}</label><input className="a-input" placeholder="1234567890" data-testid="input-ig-account-id" /></div>
                <button className="a-btn a-btn-pink" data-testid="button-connect-instagram">{t("deploy.ig.connectBtn")}</button>
              </div>
            </div>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#e1306c" }}>◎</span><span className="card-hd-title">{t("deploy.usefulResources")}</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
                <LinkBtn href="https://developers.facebook.com/docs/instagram-api/guides/messaging/" label={t("deploy.ig.res1")} color="#e1306c" />
                <LinkBtn href="https://developers.facebook.com/docs/instagram-api/reference/ig-user/messages" label={t("deploy.ig.res2")} color="#e1306c" />
                <LinkBtn href="https://business.facebook.com/" label={t("deploy.ig.res3")} color="#e1306c" />
              </div>
            </div>
          </div>
        )}

        {/* ── REST API ── */}
        {active === "api" && (
          <div className="a-anim" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#60a5fa" }}>⊕</span><span className="card-hd-title">{t("deploy.api.guideTitle")}</span></div>
              <p style={{ fontSize: ".82rem", color: "#6b6355", marginBottom: "1rem", lineHeight: 1.6 }}>
                {t("deploy.api.guideDesc")}
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <label className="a-label">{t("deploy.api.baseUrl")}</label>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <code style={{ flex: 1, background: "#0a0805", border: "1px solid rgba(96,165,250,.15)", borderRadius: 8, padding: ".6rem .9rem", fontSize: ".78rem", color: "#60a5fa" }}>https://api.aura.ai/v1</code>
                  <button className="a-btn a-btn-ghost" onClick={() => copy("https://api.aura.ai/v1", "baseurl")} data-testid="button-copy-baseurl">
                    {copied === "baseurl" ? "✓" : t("deploy.api.copyBaseUrl")}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1rem" }}>
                {[
                  { method: "POST", path: "/chat",                  descKey: "endpointChat"   },
                  { method: "GET",  path: "/conversations",          descKey: "endpointList"   },
                  { method: "GET",  path: "/conversations/:id",      descKey: "endpointGet"    },
                  { method: "GET",  path: "/agents",                 descKey: "endpointAgents" },
                  { method: "POST", path: "/agents/:id/train",       descKey: "endpointTrain"  },
                ].map(ep => (
                  <div key={ep.path} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .75rem", background: "#0f0d0a", borderRadius: 8, border: "1px solid rgba(96,165,250,.1)" }}>
                    <span style={{ fontSize: ".65rem", fontWeight: 800, padding: ".15rem .45rem", borderRadius: 4, background: ep.method === "GET" ? "rgba(52,211,153,.15)" : "rgba(245,158,11,.15)", color: ep.method === "GET" ? "#34d399" : "#f59e0b", minWidth: 36, textAlign: "center" }}>{ep.method}</span>
                    <code style={{ fontSize: ".75rem", color: "#60a5fa", flex: 1 }}>{ep.path}</code>
                    <span style={{ fontSize: ".72rem", color: "#6b6355" }}>{t(`deploy.api.${ep.descKey}`)}</span>
                  </div>
                ))}
              </div>

              <label className="a-label">{t("deploy.api.exampleTitle")}</label>
              <div className="code-block" style={{ maxHeight: 220 }}>
                <pre style={{ margin: 0, fontSize: ".72rem", color: "#c8a96e", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{API_CODE}</pre>
              </div>
              <button className="a-btn a-btn-ghost" onClick={() => copy(API_CODE, "api")} style={{ marginTop: ".75rem" }} data-testid="button-copy-api">
                {copied === "api" ? t("deploy.api.copiedCode") : t("deploy.api.copyCode")}
              </button>
            </div>

            <div className="a-card">
              <div className="card-hd"><span style={{ color: "#60a5fa" }}>◈</span><span className="card-hd-title">{t("deploy.api.authTitle")}</span></div>
              <p style={{ fontSize: ".82rem", color: "#6b6355", marginBottom: "1rem", lineHeight: 1.6 }}>{t("deploy.api.authDesc")}</p>
              <div style={{ display: "flex", gap: ".6rem", marginBottom: "1rem" }}>
                <input className="a-input" placeholder={t("deploy.api.keyPlaceholder")} readOnly style={{ flex: 1, color: "#4a4035" }} data-testid="input-api-key" />
                <button className="a-btn a-btn-primary" data-testid="button-generate-api-key">{t("deploy.api.generateKey")}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
                <LinkBtn href="https://aura.ai/docs/api" label={t("deploy.api.res1")} color="#60a5fa" />
                <LinkBtn href="https://aura.ai/docs/api/authentication" label={t("deploy.api.res2")} color="#60a5fa" />
                <LinkBtn href="https://aura.ai/docs/api/webhooks" label={t("deploy.api.res3")} color="#60a5fa" />
              </div>
            </div>
          </div>
        )}

        {/* ── CHECKLIST ── */}
        <div className="a-card a-anim" style={{ animationDelay: ".15s" }}>
          <div className="card-hd"><span style={{ color: "#34d399" }}>◎</span><span className="card-hd-title">{t("deploy.checklistTitle")}</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {checklist.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: item.done ? "rgba(52,211,153,.1)" : "#1a1610", border: `1px solid ${item.done ? "rgba(52,211,153,.3)" : "rgba(245,158,11,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", color: "#34d399" }}>
                  {item.done ? "✓" : ""}
                </div>
                <span style={{ fontSize: ".82rem", color: item.done ? "#c8a96e" : "#6b6355" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StepItem({ n, color, title, children }: { n: string; color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: ".85rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(245,158,11,.06)" }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1.5px solid ${color}44`, color, fontSize: ".72rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div>
        <div style={{ fontSize: ".84rem", fontWeight: 700, color: "#c8a96e", marginBottom: ".3rem" }}>{title}</div>
        <div style={{ fontSize: ".78rem", color: "#6b6355", lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function LinkBtn({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: ".3rem",
        fontSize: ".73rem", fontWeight: 700, color,
        background: `${color}14`, border: `1px solid ${color}30`,
        borderRadius: 7, padding: ".32rem .75rem", textDecoration: "none",
        fontFamily: "'Syne', sans-serif", marginTop: ".4rem",
        transition: "background .15s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = `${color}22`}
      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = `${color}14`}
    >
      {label}
    </a>
  );
}

const css = `
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .aura-page{flex:1;overflow-y:auto;padding:2rem 2.4rem;display:flex;flex-direction:column;gap:1.4rem;}
  .aura-page::-webkit-scrollbar{width:4px;} .aura-page::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .a-page-hd{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
  .a-page-title{font-family:'Literata',serif;font-size:1.55rem;font-weight:500;color:#f5e6c8;letter-spacing:-.02em;}
  .a-page-sub{font-size:.8rem;color:#6b6355;margin-top:.25rem;}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.4rem 1.6rem;}
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;box-shadow:0 6px 20px rgba(245,158,11,.22);}
  .a-btn-primary:hover{transform:translateY(-1px);}
  .a-btn-green{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;}
  .a-btn-green:hover{transform:translateY(-1px);}
  .a-btn-blue{background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;}
  .a-btn-blue:hover{transform:translateY(-1px);}
  .a-btn-pink{background:linear-gradient(135deg,#ec4899,#be185d);color:#fff;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;}
  .a-btn-pink:hover{transform:translateY(-1px);}
  .a-btn-ghost{background:rgba(245,158,11,.08);color:#f59e0b;border:1px solid rgba(245,158,11,.18);border-radius:8px;padding:.38rem .85rem;font-size:.78rem;}
  .a-btn-ghost:hover{background:rgba(245,158,11,.15);}
  .a-label{font-size:.72rem;font-weight:700;color:#6b6355;margin-bottom:.35rem;display:block;}
  .a-input,.a-select{width:100%;background:#0f0d0a;border:1px solid rgba(245,158,11,.1);border-radius:10px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.6rem .9rem;outline:none;transition:border-color .2s;}
  .a-input:focus,.a-select:focus{border-color:rgba(245,158,11,.25);}
  .a-select option{background:#141109;}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .deploy-status{display:flex;align-items:center;gap:.4rem;font-size:.72rem;font-weight:600;color:#34d399;}
  .deploy-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 6px #34d399;animation:a-pulse 2s infinite;}
  .deploy-channels{display:grid;grid-template-columns:repeat(5,1fr);gap:.8rem;}
  .channel-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:12px;padding:.9rem .8rem;cursor:pointer;transition:all .2s;position:relative;text-align:center;font-family:'Syne',sans-serif;display:flex;flex-direction:column;align-items:center;gap:.3rem;}
  .channel-card:hover{border-color:rgba(245,158,11,.22);transform:translateY(-1px);}
  .channel-card.active{border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.07);}
  .channel-icon{font-size:1.4rem;}
  .channel-name{font-size:.76rem;font-weight:700;color:#c8a96e;}
  .channel-desc{font-size:.62rem;color:#6b6355;line-height:1.4;}
  .channel-pip{position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);width:28px;height:2px;border-radius:100px;background:#f59e0b;}
  .code-block{background:#0a0805;border:1px solid rgba(245,158,11,.1);border-radius:10px;padding:1rem;max-height:160px;overflow:auto;}
  .code-block::-webkit-scrollbar{width:4px;} .code-block::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .steps-list{display:flex;flex-direction:column;gap:.85rem;}
  .a-hint{font-size:.72rem;color:#4a4035;margin-top:.6rem;line-height:1.5;}
  .a-hint code{color:#c8a96e;background:rgba(245,158,11,.08);padding:0 4px;border-radius:3px;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes a-pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @media(max-width:900px){.deploy-channels{grid-template-columns:repeat(3,1fr);}.a-grid-2{grid-template-columns:1fr;}}
`;
