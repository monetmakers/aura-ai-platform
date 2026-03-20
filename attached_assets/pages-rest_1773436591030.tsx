// ═══════════════════════════════════════
// revenue.tsx
// ═══════════════════════════════════════
import { useState as useStateR } from "react";
export function RevenuePage() {
  const stats = [
    { label: "Conversion Assists",   value: "0",    sub: "this month",   color: "#f59e0b", icon: "◎" },
    { label: "Total Value",          value: "€0",   sub: "revenue influenced", color: "#34d399", icon: "◈" },
    { label: "Missed Opportunities", value: "0",    sub: "escalated or lost", color: "#f87171", icon: "⚠" },
    { label: "Sentiment Trend",      value: "N/A",  sub: "avg. rating",  color: "#60a5fa", icon: "◉" },
  ];
  const convOpps = [
    { label: "Product recommendation accepted", count: 0, value: "€0" },
    { label: "Checkout abandonment recovered",  count: 0, value: "€0" },
    { label: "Upsell to premium tier",          count: 0, value: "€0" },
  ];
  const missedSales = [
    { label: "No pricing info available",    count: 0, priority: "high"   },
    { label: "Product out of stock queries", count: 0, priority: "medium" },
    { label: "Competitor comparison asked",  count: 0, priority: "low"    },
  ];
  const roi = [
    { label: "Conversations Handled", value: "0",    unit: "chats",   color: "#f59e0b" },
    { label: "Human Time Saved",      value: "0",    unit: "hours",   color: "#34d399" },
    { label: "Estimated Savings",     value: "€0",   unit: "at €15/hr", color: "#60a5fa" },
  ];
  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar"><span className="aura-topbar-title">◎ Revenue</span></div>
      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div><div className="a-page-title">Revenue Impact</div><div className="a-page-sub">How your AI agent influences sales and saves costs</div></div>
        </div>
        <div className="a-grid-4 a-anim" style={{ animationDelay: ".05s" }}>
          {stats.map((s, i) => (
            <div key={i} className="a-card" style={{ animationDelay: `${i * .07}s`, animation: "a-fadeUp .45s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".7rem" }}>
                <span style={{ fontSize: ".7rem", color: "#6b6355", fontWeight: 600 }}>{s.label}</span>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem", color: s.color }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: ".25rem" }}>{s.value}</div>
              <div style={{ fontSize: ".65rem", color: "#4a4035" }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="a-grid-2 a-anim" style={{ animationDelay: ".1s" }}>
          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#34d399" }}>◎</span><span className="card-hd-title">Conversion Opportunities</span></div>
            {convOpps.map((o, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: ".6rem 0", borderBottom: i < convOpps.length - 1 ? "1px solid rgba(245,158,11,.06)" : "none", fontSize: ".8rem" }}>
                <span style={{ color: "#6b6355" }}>{o.label}</span>
                <div style={{ display: "flex", gap: ".8rem" }}>
                  <span style={{ color: "#c8a96e", fontWeight: 700 }}>{o.count}</span>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{o.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#f87171" }}>⚠</span><span className="card-hd-title">Missed Sales Signals</span></div>
            {missedSales.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderBottom: i < missedSales.length - 1 ? "1px solid rgba(245,158,11,.06)" : "none" }}>
                <span style={{ fontSize: ".8rem", color: "#6b6355" }}>{m.label}</span>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <span style={{ fontSize: ".72rem", color: "#c8a96e", fontWeight: 700 }}>{m.count}</span>
                  <span className={`a-badge ${m.priority === "high" ? "a-badge-red" : m.priority === "medium" ? "a-badge-amber" : "a-badge-muted"}`}>{m.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="a-card a-anim" style={{ animationDelay: ".15s", background: "rgba(245,158,11,.03)", borderColor: "rgba(245,158,11,.14)" }}>
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>◈</span><span className="card-hd-title">ROI Calculator</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {roi.map((r, i) => (
              <div key={i} style={{ textAlign: "center", padding: "1rem", background: "#141109", borderRadius: 12, border: "1px solid rgba(245,158,11,.1)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: r.color }}>{r.value}</div>
                <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#c8a96e", margin: ".3rem 0 .15rem" }}>{r.label}</div>
                <div style={{ fontSize: ".65rem", color: "#4a4035" }}>{r.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// settings.tsx
// ═══════════════════════════════════════
import { useState as useStateS } from "react";
export function SettingsPage() {
  const [bizName, setBizName] = useStateS("Main Store");
  const [email, setEmail] = useStateS("john@mainstore.com");
  const [website, setWebsite] = useStateS("https://mainstore.com");
  const [notifs, setNotifs] = useStateS({ email: true, escalation: true, weekly: false });
  const [saved, setSaved] = useStateS(false);
  const [showDanger, setShowDanger] = useStateS(false);
  const members = [
    { name: "John Doe",  email: "john@mainstore.com",  role: "owner" },
    { name: "Anna K.",   email: "anna@mainstore.com",  role: "admin" },
    { name: "Mark B.",   email: "mark@mainstore.com",  role: "member" },
  ];
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">⚙ Settings</span>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          {saved && <span className="save-toast">✓ Saved</span>}
          <button className="a-btn a-btn-primary" onClick={save}>Save changes</button>
        </div>
      </div>
      <div className="aura-page" style={{ maxWidth: 720 }}>
        {/* Business Info */}
        <div className="a-card a-anim">
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>◈</span><span className="card-hd-title">Business Information</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
            {[
              { label: "Business Name", val: bizName, set: setBizName },
              { label: "Email",         val: email,   set: setEmail   },
              { label: "Website",       val: website, set: setWebsite },
            ].map((f, i) => (
              <div key={i}><label className="a-label">{f.label}</label><input className="a-input" value={f.val} onChange={e => f.set(e.target.value)} /></div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="a-card a-anim" style={{ animationDelay: ".05s" }}>
          <div className="card-hd"><span style={{ color: "#60a5fa" }}>◎</span><span className="card-hd-title">Notifications</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
            {[
              { key: "email",      label: "Email notifications",      sub: "Receive a summary of daily conversations" },
              { key: "escalation", label: "Escalation alerts",        sub: "Notify me when a handoff occurs"          },
              { key: "weekly",     label: "Weekly performance report", sub: "Insights digest every Monday morning"     },
            ].map(n => (
              <div key={n.key} className="a-toggle-wrap">
                <div>
                  <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#c8a96e" }}>{n.label}</div>
                  <div style={{ fontSize: ".7rem", color: "#6b6355", marginTop: ".1rem" }}>{n.sub}</div>
                </div>
                <div className={`a-toggle ${notifs[n.key] ? "on" : ""}`} onClick={() => setNotifs(v => ({ ...v, [n.key]: !v[n.key] }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="a-card a-anim" style={{ animationDelay: ".1s" }}>
          <div className="card-hd"><span style={{ color: "#34d399" }}>◎</span><span className="card-hd-title">Billing</span></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: ".75rem", color: "#6b6355", marginBottom: ".3rem" }}>Current plan</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f5e6c8" }}>Free Starter</div>
              <div style={{ fontSize: ".72rem", color: "#4a4035", marginTop: ".2rem" }}>100 conversations/month · 1 agent</div>
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button className="a-btn a-btn-primary">Upgrade to Growth</button>
              <button className="a-btn a-btn-ghost">View history</button>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="a-card a-anim" style={{ animationDelay: ".15s" }}>
          <div className="card-hd" style={{ marginBottom: ".75rem" }}><span style={{ color: "#f472b6" }}>◈</span><span className="card-hd-title">Team Members</span><button className="a-btn a-btn-ghost" style={{ marginLeft: "auto", fontSize: ".72rem", padding: ".3rem .7rem" }}>+ Invite</button></div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {members.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: ".7rem", padding: ".6rem .8rem", background: "#0f0d0a", borderRadius: 10, border: "1px solid rgba(245,158,11,.07)" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#2a2015,#3d2e18)", border: "1px solid rgba(245,158,11,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, color: "#c8a96e", flexShrink: 0 }}>{m.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#c8a96e" }}>{m.name}</div>
                  <div style={{ fontSize: ".65rem", color: "#4a4035" }}>{m.email}</div>
                </div>
                <span className={`a-badge ${m.role === "owner" ? "a-badge-amber" : m.role === "admin" ? "a-badge-blue" : "a-badge-muted"}`}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="a-card a-anim" style={{ animationDelay: ".2s", borderColor: "rgba(248,113,113,.2)", background: "rgba(248,113,113,.03)" }}>
          <div className="card-hd"><span style={{ color: "#f87171" }}>⚠</span><span className="card-hd-title" style={{ color: "#f87171" }}>Danger Zone</span></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#f5e6c8" }}>Delete this workspace</div>
              <div style={{ fontSize: ".72rem", color: "#6b6355", marginTop: ".15rem" }}>This will permanently delete all agents, documents, and conversation history.</div>
            </div>
            <button
              className="a-btn"
              style={{ background: "rgba(248,113,113,.1)", color: "#f87171", border: "1px solid rgba(248,113,113,.25)", borderRadius: 10, padding: ".5rem 1.1rem", fontSize: ".8rem" }}
              onClick={() => setShowDanger(true)}
            >
              Delete workspace
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// integrations.tsx
// ═══════════════════════════════════════
export function IntegrationsPage() {
  const integrations = [
    { name: "Website Widget",     icon: "◻", desc: "Embed a chat widget on any website",          status: "connected", color: "#f59e0b" },
    { name: "Facebook Messenger", icon: "⊕", desc: "Respond to Messenger conversations",         status: "available", color: "#60a5fa" },
    { name: "WhatsApp Business",  icon: "◇", desc: "Handle WhatsApp customer messages",          status: "available", color: "#34d399" },
    { name: "Instagram DMs",      icon: "◈", desc: "Auto-reply to Instagram direct messages",     status: "available", color: "#f472b6" },
    { name: "Shopify",            icon: "⊟", desc: "Sync products, orders and customer data",     status: "available", color: "#96c93d" },
    { name: "Zapier",             icon: "⊗", desc: "Connect to 5,000+ apps via Zapier",          status: "coming",    color: "#ff4a00" },
    { name: "Slack",              icon: "◉", desc: "Get escalation alerts in your Slack channel", status: "coming",    color: "#4a154b" },
    { name: "Intercom",           icon: "◎", desc: "Sync handoffs with your Intercom inbox",     status: "coming",    color: "#286efa" },
  ];
  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar"><span className="aura-topbar-title">⊕ Integrations</span></div>
      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div><div className="a-page-title">Integrations</div><div className="a-page-sub">Connect Aura to the tools your business already uses</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }} className="a-anim" style={{ animationDelay: ".05s" }}>
          {integrations.map((intg, i) => (
            <div key={i} className="intg-card a-card" style={{ animationDelay: `${i * .05}s`, animation: "a-fadeUp .45s ease both", display: "flex", alignItems: "flex-start", gap: ".9rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${intg.color}18`, border: `1px solid ${intg.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: intg.color, flexShrink: 0 }}>{intg.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".88rem", fontWeight: 700, color: "#c8a96e" }}>{intg.name}</span>
                  <span className={`a-badge ${intg.status === "connected" ? "a-badge-green" : intg.status === "available" ? "a-badge-amber" : "a-badge-muted"}`}>
                    {intg.status === "connected" ? "✓ Connected" : intg.status === "available" ? "Available" : "Coming soon"}
                  </span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#6b6355", marginBottom: ".7rem" }}>{intg.desc}</div>
                {intg.status !== "coming" && (
                  <button className="a-btn" style={{ background: intg.status === "connected" ? "rgba(248,113,113,.08)" : "rgba(245,158,11,.08)", color: intg.status === "connected" ? "#f87171" : "#c8a96e", border: `1px solid ${intg.status === "connected" ? "rgba(248,113,113,.2)" : "rgba(245,158,11,.15)"}`, borderRadius: 8, padding: ".3rem .8rem", fontSize: ".72rem" }}>
                    {intg.status === "connected" ? "Disconnect" : "Connect →"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// deploy.tsx
// ═══════════════════════════════════════
import { useState as useStateD } from "react";
export function DeployPage() {
  const [copied, setCopied] = useStateD(false);
  const snippet = `<script>
  window.AURA_CONFIG = {
    agentId: "your-agent-id",
    primaryColor: "#f59e0b",
    position: "bottom-right"
  };
</script>
<script src="https://cdn.aura.ai/widget.js" async></script>`;
  function copy() { navigator.clipboard.writeText(snippet).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar"><span className="aura-topbar-title">⊗ Deploy</span></div>
      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div><div className="a-page-title">Deploy Your Agent</div><div className="a-page-sub">Get your AI agent live across all your channels</div></div>
        </div>
        <div className="a-grid-2 a-anim" style={{ animationDelay: ".05s" }}>
          {[
            { icon: "◻", color: "#f59e0b", title: "Website Widget",     sub: "Paste one snippet into your site. Works with any CMS.", status: "active" },
            { icon: "⊕", color: "#60a5fa", title: "Facebook Messenger", sub: "Connect your Facebook Page to enable Messenger support.", status: "inactive" },
            { icon: "◇", color: "#34d399", title: "WhatsApp Business",  sub: "Link your WhatsApp Business number via Twilio.",         status: "inactive" },
            { icon: "◈", color: "#f472b6", title: "Instagram DMs",      sub: "Auto-reply to Instagram DMs via the Meta Graph API.",   status: "inactive" },
          ].map((ch, i) => (
            <div key={i} className="a-card" style={{ display: "flex", gap: ".9rem", alignItems: "flex-start", animation: "a-fadeUp .45s ease both", animationDelay: `${i * .06}s` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${ch.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: ch.color, flexShrink: 0 }}>{ch.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".88rem", fontWeight: 700, color: "#c8a96e" }}>{ch.title}</span>
                  <span className={`a-badge ${ch.status === "active" ? "a-badge-green" : "a-badge-muted"}`}>{ch.status === "active" ? "● Active" : "○ Inactive"}</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#6b6355", marginBottom: ".7rem" }}>{ch.sub}</div>
                <button className="a-btn" style={{ background: ch.status === "active" ? "rgba(52,211,153,.08)" : "rgba(245,158,11,.08)", color: ch.status === "active" ? "#34d399" : "#c8a96e", border: `1px solid ${ch.status === "active" ? "rgba(52,211,153,.2)" : "rgba(245,158,11,.15)"}`, borderRadius: 8, padding: ".3rem .8rem", fontSize: ".72rem" }}>
                  {ch.status === "active" ? "Manage" : "Connect →"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="a-card a-anim" style={{ animationDelay: ".15s" }}>
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>◻</span><span className="card-hd-title">Website Embed Code</span><button className="a-btn a-btn-ghost" style={{ marginLeft: "auto", fontSize: ".72rem", padding: ".3rem .8rem" }} onClick={copy}>{copied ? "✓ Copied!" : "Copy code"}</button></div>
          <pre style={{ background: "#0a0805", border: "1px solid rgba(245,158,11,.1)", borderRadius: 10, padding: "1rem 1.2rem", fontSize: ".75rem", color: "#6b6355", overflowX: "auto", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}><code style={{ color: "#c8a96e" }}>{snippet}</code></pre>
          <div style={{ marginTop: ".75rem", fontSize: ".72rem", color: "#4a4035" }}>Paste this snippet before the closing <code style={{ color: "#6b6355" }}>&lt;/body&gt;</code> tag of your website.</div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// help.tsx
// ═══════════════════════════════════════
import { useState as useStateH } from "react";
export function HelpPage() {
  const [search, setSearch] = useStateH("");
  const [openFaq, setOpenFaq] = useStateH(null);
  const faqs = [
    { q: "How do I train my agent on my documents?", a: "Go to the Documents page and upload your PDFs, DOCX, or TXT files. Once processed, your agent will automatically use them to answer customer questions." },
    { q: "How long does document processing take?", a: "Most documents process within 30–60 seconds. Large PDFs (50+ pages) may take up to 2 minutes. You'll see a 'Ready' badge once processing is complete." },
    { q: "Can I use multiple channels at once?", a: "Yes! On the Growth plan you can deploy to Website, Facebook Messenger, and WhatsApp simultaneously from the Deploy page." },
    { q: "What happens when my agent doesn't know an answer?", a: "If you have escalation enabled, the agent will politely acknowledge the limit and offer to connect the customer with a human. You'll receive an email notification." },
    { q: "How do I change my agent's tone?", a: "Go to Agents → Brand Voice & Tone. You can choose from Friendly, Professional, Playful, or Concise, and adjust the formality slider." },
    { q: "Can I export my conversation history?", a: "Yes — open any conversation in the Conversations page and click 'Export'. You can also bulk-export from Settings → Billing → Data Export." },
  ];
  const filtered = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar"><span className="aura-topbar-title">? Help & Support</span></div>
      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div><div className="a-page-title">Help & Support</div><div className="a-page-sub">Find answers, documentation, and reach our team</div></div>
        </div>
        <div className="a-anim" style={{ position: "relative", animationDelay: ".05s" }}>
          <span style={{ position: "absolute", left: ".9rem", top: "50%", transform: "translateY(-50%)", color: "#6b6355", fontSize: ".85rem", pointerEvents: "none" }}>⌕</span>
          <input className="a-input" placeholder="Search help articles…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.2rem" }} />
        </div>
        <div className="a-grid-3 a-anim" style={{ animationDelay: ".08s" }}>
          {[
            { icon: "⊟", color: "#60a5fa", title: "Documentation",   sub: "Full guides for every feature", action: "Browse docs →" },
            { icon: "◇", color: "#34d399", title: "Live Chat",        sub: "Chat with our team in real time", action: "Start chat →" },
            { icon: "◈", color: "#f472b6", title: "Email Support",    sub: "support@aura.ai · Reply in <4h", action: "Send email →" },
          ].map((c, i) => (
            <div key={i} className="a-card" style={{ textAlign: "center", padding: "1.6rem 1.2rem", cursor: "pointer", transition: "all .2s", animation: "a-fadeUp .45s ease both", animationDelay: `${i * .07}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: c.color, margin: "0 auto .9rem" }}>{c.icon}</div>
              <div style={{ fontSize: ".88rem", fontWeight: 700, color: "#c8a96e", marginBottom: ".3rem" }}>{c.title}</div>
              <div style={{ fontSize: ".75rem", color: "#6b6355", marginBottom: ".8rem" }}>{c.sub}</div>
              <div style={{ fontSize: ".75rem", color: c.color, fontWeight: 700 }}>{c.action}</div>
            </div>
          ))}
        </div>
        <div className="a-card a-anim" style={{ animationDelay: ".15s" }}>
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>?</span><span className="card-hd-title">Frequently Asked Questions</span></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(245,158,11,.07)" : "none" }}>
                <button
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 0", background: "none", border: "none", cursor: "pointer", gap: "1rem", textAlign: "left", fontFamily: "'Syne',sans-serif" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#c8a96e" }}>{faq.q}</span>
                  <span style={{ color: "#f59e0b", fontSize: ".85rem", flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ fontSize: ".78rem", color: "#6b6355", lineHeight: 1.65, paddingBottom: ".9rem", animation: "a-fadeUp .2s ease both" }}>{faq.a}</div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ fontSize: ".8rem", color: "#4a4035", padding: "1rem 0" }}>No results for "{search}"</div>}
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// SHARED STYLES (used by all 5 pages above)
// ═══════════════════════════════════════
const sharedCss = `
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .aura-page{flex:1;overflow-y:auto;padding:2rem 2.4rem;display:flex;flex-direction:column;gap:1.4rem;}
  .aura-page::-webkit-scrollbar{width:4px;} .aura-page::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .a-page-hd{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
  .a-page-title{font-family:'Literata',serif;font-size:1.55rem;font-weight:500;color:#f5e6c8;letter-spacing:-.02em;line-height:1.2;}
  .a-page-sub{font-size:.8rem;color:#6b6355;margin-top:.25rem;}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.4rem 1.6rem;}
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .a-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
  .a-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;box-shadow:0 6px 20px rgba(245,158,11,.22);}
  .a-btn-primary:hover{transform:translateY(-1px);}
  .a-btn-ghost{background:rgba(245,158,11,.07);color:#c8a96e;border:1px solid rgba(245,158,11,.12);border-radius:10px;padding:.45rem 1rem;font-size:.78rem;}
  .a-btn-ghost:hover{background:rgba(245,158,11,.12);}
  .a-label{font-size:.72rem;font-weight:700;color:#6b6355;margin-bottom:.35rem;display:block;}
  .a-input,.a-textarea{width:100%;background:#0f0d0a;border:1px solid rgba(245,158,11,.1);border-radius:10px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.6rem .9rem;outline:none;transition:border-color .2s;}
  .a-input:focus,.a-textarea:focus{border-color:rgba(245,158,11,.25);}
  .a-input::placeholder{color:#4a4035;}
  .a-toggle-wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;}
  .a-toggle{width:38px;height:21px;border-radius:100px;background:#1a1610;border:1px solid rgba(245,158,11,.12);position:relative;cursor:pointer;transition:all .2s;flex-shrink:0;}
  .a-toggle.on{background:rgba(245,158,11,.2);border-color:#f59e0b;}
  .a-toggle::after{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#6b6355;top:2px;left:2px;transition:all .2s;}
  .a-toggle.on::after{background:#f59e0b;left:19px;}
  .a-badge{display:inline-flex;align-items:center;font-size:.62rem;font-weight:700;letter-spacing:.04em;padding:.18rem .55rem;border-radius:100px;text-transform:uppercase;}
  .a-badge-amber{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}
  .a-badge-blue{background:rgba(96,165,250,.1);color:#60a5fa;border:1px solid rgba(96,165,250,.2);}
  .a-badge-green{background:rgba(52,211,153,.1);color:#34d399;border:1px solid rgba(52,211,153,.2);}
  .a-badge-red{background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.2);}
  .a-badge-muted{background:rgba(255,255,255,.04);color:#6b6355;border:1px solid rgba(245,158,11,.08);}
  .a-progress-track{height:5px;background:#1a1610;border-radius:100px;overflow:hidden;}
  .a-progress-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#f59e0b,#d97706);transition:width .6s ease;}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .save-toast{font-size:.75rem;font-weight:700;color:#34d399;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);padding:.3rem .8rem;border-radius:8px;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:900px){.a-grid-2,.a-grid-3,.a-grid-4{grid-template-columns:1fr;}}
`;
