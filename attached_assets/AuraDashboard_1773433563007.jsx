import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ─── Google Fonts injected once ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Literata:ital,wght@0,400;0,500;1,400&display=swap"
    rel="stylesheet"
  />
);

/* ─── Mock data ─── */
const volumeData = [
  { day: "Mon", v: 0 }, { day: "Tue", v: 0 }, { day: "Wed", v: 0 },
  { day: "Thu", v: 0 }, { day: "Fri", v: 0 }, { day: "Sat", v: 0 }, { day: "Sun", v: 0 },
];
const topicsData = [
  { topic: "General", count: 0 },
  { topic: "Support", count: 0 },
  { topic: "Product", count: 0 },
  { topic: "Pricing", count: 0 },
  { topic: "Other",   count: 0 },
];
const navItems = [
  { label: "Dashboard",    icon: "▦",  key: "dashboard" },
  { label: "Documents",    icon: "⊟",  key: "documents" },
  { label: "Agents",       icon: "◈",  key: "agents" },
  { label: "Playground",   icon: "◻",  key: "playground" },
  { label: "Conversations",icon: "◇",  key: "conversations" },
  { label: "AI Insights",  icon: "◉",  key: "insights" },
  { label: "Revenue",      icon: "◎",  key: "revenue" },
  { label: "Integrations", icon: "⊕",  key: "integrations" },
  { label: "Deploy",       icon: "⊗",  key: "deploy" },
];

/* ─── Custom tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#0f0d0a", border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: 8, padding: "6px 12px",
        fontFamily: "Syne, sans-serif", fontSize: 12, color: "#f5e6c8"
      }}>
        <div style={{ color: "#f59e0b", fontWeight: 700 }}>{label}</div>
        <div>{payload[0].value} conversations</div>
      </div>
    );
  }
  return null;
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function AuraDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <>
      <FontLink />
      <style>{css}</style>
      <div className="aura-root">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">✦</div>
            <span className="logo-text">Aura</span>
          </div>

          <div className="biz-switcher">
            <div className="biz-avatar">M</div>
            <div className="biz-info">
              <div className="biz-name">Main Store</div>
              <div className="biz-plan">Free Plan</div>
            </div>
            <div className="biz-chevron">⌄</div>
          </div>

          <div className="nav-section-label">MAIN</div>
          <nav className="nav-list">
            {navItems.map(item => (
              <button
                key={item.key}
                className={`nav-item ${active === item.key ? "active" : ""}`}
                onClick={() => setActive(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {active === item.key && <span className="nav-pip" />}
              </button>
            ))}
          </nav>

          <div className="nav-section-label" style={{ marginTop: "auto", paddingTop: "1.5rem" }}>SETTINGS</div>
          <button className={`nav-item ${active === "settings" ? "active" : ""}`} onClick={() => setActive("settings")}>
            <span className="nav-icon">⚙</span>
            <span className="nav-label">Settings</span>
          </button>

          <div className="sidebar-user">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <div className="user-name">John Doe</div>
              <div className="user-email">john@mainstore.com</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main">

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <span className="topbar-icon">▦</span>
              <span className="topbar-title">Aura</span>
            </div>
            <div className="topbar-right">
              <button className="icon-btn">🌐</button>
              <button className="icon-btn">☾</button>
            </div>
          </header>

          {/* Page body */}
          <div className="page-body">

            {/* Page header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Welcome back to Aura</h1>
                <p className="page-sub">Your AI customer service command centre</p>
              </div>
              <button className="cta-btn">
                <span>✦</span> Testing Environment →
              </button>
            </div>

            {/* Stat cards */}
            <div className="stats-grid">
              {[
                { label: "Conversations", value: "0", sub: "all time",          icon: "◇", accent: "#f59e0b" },
                { label: "Total Messages", value: "0", sub: "all time",          icon: "◎", accent: "#34d399" },
                { label: "Documents",      value: "0/0", sub: "ready for training", icon: "⊟", accent: "#60a5fa" },
                { label: "Avg. Satisfaction", value: "N/A", sub: "customer rating", icon: "◈", accent: "#f472b6" },
              ].map((s, i) => (
                <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="stat-top">
                    <span className="stat-label">{s.label}</span>
                    <div className="stat-icon-wrap" style={{ color: s.accent, background: `${s.accent}18` }}>
                      {s.icon}
                    </div>
                  </div>
                  <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="charts-row">

              {/* Conversation Volume */}
              <div className="chart-card wide">
                <div className="card-header">
                  <div className="card-title-group">
                    <span className="card-icon" style={{ color: "#f59e0b" }}>↗</span>
                    <span className="card-title">Conversation Volume</span>
                  </div>
                  <span className="badge">Last 7 days</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={volumeData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: "#6b6355", fontSize: 11, fontFamily: "Syne" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b6355", fontSize: 11, fontFamily: "Syne" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} fill="url(#vGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Message Topics */}
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <span className="card-icon" style={{ color: "#60a5fa" }}>◇</span>
                    <span className="card-title">Message Topics</span>
                  </div>
                  <span className="badge">This month</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topicsData} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: "#6b6355", fontSize: 10, fontFamily: "Syne" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="topic" tick={{ fill: "#a89880", fontSize: 11, fontFamily: "Syne" }} axisLine={false} tickLine={false} width={56} />
                    <Tooltip cursor={{ fill: "rgba(245,158,11,0.05)" }} content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom row */}
            <div className="bottom-row">

              {/* Quick Actions */}
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <span className="card-icon" style={{ color: "#f59e0b" }}>⚡</span>
                    <span className="card-title">Quick Actions</span>
                  </div>
                </div>
                <div className="quick-actions">
                  {[
                    { icon: "⊟", label: "Upload documents",    sub: "Add knowledge to your agent",  color: "#f59e0b" },
                    { icon: "◈", label: "Configure agent",     sub: "Set tone, name & personality", color: "#34d399" },
                    { icon: "◻", label: "Test in playground",  sub: "Chat with your agent live",    color: "#60a5fa" },
                    { icon: "⊕", label: "Connect channels",    sub: "Deploy to web, FB, WhatsApp",  color: "#f472b6" },
                  ].map((a, i) => (
                    <button className="quick-action-item" key={i}>
                      <div className="qa-icon" style={{ color: a.color, background: `${a.color}18` }}>{a.icon}</div>
                      <div className="qa-text">
                        <div className="qa-label">{a.label}</div>
                        <div className="qa-sub">{a.sub}</div>
                      </div>
                      <span className="qa-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Status */}
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <span className="card-icon" style={{ color: "#34d399" }}>◈</span>
                    <span className="card-title">Agent Status</span>
                  </div>
                </div>
                <div className="agent-status-body">
                  <div className="agent-orb">
                    <div className="orb-ring" />
                    <div className="orb-core">✦</div>
                  </div>
                  <div className="agent-status-label">No Agent Configured</div>
                  <div className="agent-status-sub">Create your first AI agent to start handling customer conversations automatically.</div>
                  <button className="cta-btn-sm">Create Agent →</button>
                </div>

                <div className="status-checklist">
                  {[
                    { done: false, label: "Upload knowledge documents" },
                    { done: false, label: "Configure agent personality" },
                    { done: false, label: "Test in playground" },
                    { done: false, label: "Deploy to live channel" },
                  ].map((item, i) => (
                    <div className="check-item" key={i}>
                      <div className={`check-dot ${item.done ? "done" : ""}`}>{item.done ? "✓" : ""}</div>
                      <span className={`check-label ${item.done ? "done" : ""}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>{/* /page-body */}
        </main>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const css = `
  .aura-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #0f0d0a;
    font-family: 'Syne', sans-serif;
    color: #e8dece;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 232px;
    flex-shrink: 0;
    background: #0a0805;
    border-right: 1px solid rgba(245,158,11,0.08);
    display: flex;
    flex-direction: column;
    padding: 0 0 1rem;
    overflow-y: auto;
  }

  .sidebar-logo {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 1.4rem 1.4rem 1rem;
  }
  .logo-mark {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: #0a0805; font-weight: 900;
  }
  .logo-text {
    font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: #f5e6c8;
  }

  .biz-switcher {
    margin: 0 0.8rem 1.2rem;
    padding: 0.65rem 0.8rem;
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px;
    display: flex; align-items: center; gap: 0.6rem;
    cursor: pointer; transition: background 0.2s;
  }
  .biz-switcher:hover { background: rgba(245,158,11,0.1); }
  .biz-avatar {
    width: 28px; height: 28px; border-radius: 7px;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #022c22;
  }
  .biz-name { font-size: 0.78rem; font-weight: 700; color: #f5e6c8; }
  .biz-plan { font-size: 0.65rem; color: #6b6355; }
  .biz-chevron { margin-left: auto; color: #6b6355; font-size: 0.8rem; }

  .nav-section-label {
    padding: 0 1.4rem 0.4rem;
    font-size: 0.6rem; letter-spacing: 0.1em;
    color: #4a4035; font-weight: 700;
  }

  .nav-list { display: flex; flex-direction: column; gap: 1px; padding: 0 0.6rem; }

  .nav-item {
    display: flex; align-items: center; gap: 0.7rem;
    padding: 0.55rem 0.8rem;
    border-radius: 8px; border: none; background: none;
    color: #6b6355; font-family: 'Syne', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    text-align: left; position: relative; width: 100%;
  }
  .nav-item:hover { background: rgba(245,158,11,0.06); color: #c8a96e; }
  .nav-item.active { background: rgba(245,158,11,0.1); color: #f5c842; }
  .nav-icon { font-size: 0.9rem; width: 18px; text-align: center; }
  .nav-pip {
    position: absolute; right: 0.6rem;
    width: 5px; height: 5px; border-radius: 50%;
    background: #f59e0b;
  }

  .sidebar-user {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.8rem 1rem 0;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(245,158,11,0.08);
  }
  .user-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #b45309);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 800; color: #0a0805; flex-shrink: 0;
  }
  .user-name { font-size: 0.75rem; font-weight: 700; color: #c8a96e; }
  .user-email { font-size: 0.62rem; color: #4a4035; }

  /* ── MAIN ── */
  .main {
    flex: 1; display: flex; flex-direction: column;
    overflow: hidden; background: #0f0d0a;
  }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 2rem;
    border-bottom: 1px solid rgba(245,158,11,0.08);
    background: #0a0805;
    flex-shrink: 0;
  }
  .topbar-left { display: flex; align-items: center; gap: 0.6rem; }
  .topbar-icon { color: #f59e0b; font-size: 1rem; }
  .topbar-title { font-size: 0.88rem; font-weight: 700; color: #c8a96e; }
  .topbar-right { display: flex; gap: 0.4rem; }
  .icon-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.1);
    cursor: pointer; font-size: 0.85rem; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s;
  }
  .icon-btn:hover { background: rgba(245,158,11,0.12); }

  /* ── PAGE BODY ── */
  .page-body {
    flex: 1; overflow-y: auto;
    padding: 2rem 2.4rem;
    display: flex; flex-direction: column; gap: 1.4rem;
  }

  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }
  .page-title {
    font-family: 'Literata', serif;
    font-size: 1.7rem; font-weight: 500;
    color: #f5e6c8; letter-spacing: -0.01em; line-height: 1.2;
  }
  .page-sub { font-size: 0.82rem; color: #6b6355; margin-top: 0.3rem; }

  .cta-btn {
    display: flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0a0805; border: none; border-radius: 10px;
    padding: 0.65rem 1.3rem; font-size: 0.82rem; font-weight: 800;
    font-family: 'Syne', sans-serif; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
    box-shadow: 0 4px 20px rgba(245,158,11,0.25);
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,158,11,0.35); }

  /* ── STATS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .stat-card {
    background: #141109;
    border: 1px solid rgba(245,158,11,0.08);
    border-radius: 14px; padding: 1.2rem 1.3rem;
    transition: all 0.2s; cursor: default;
    animation: fadeUp 0.5s ease both;
  }
  .stat-card:hover {
    border-color: rgba(245,158,11,0.18);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; }
  .stat-label { font-size: 0.72rem; color: #6b6355; font-weight: 600; letter-spacing: 0.02em; }
  .stat-icon-wrap {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }
  .stat-value { font-size: 1.9rem; font-weight: 800; line-height: 1; margin-bottom: 0.3rem; }
  .stat-sub { font-size: 0.68rem; color: #4a4035; }

  /* ── CHARTS ── */
  .charts-row {
    display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem;
  }
  @media (max-width: 1000px) { .charts-row { grid-template-columns: 1fr; } }

  .chart-card {
    background: #141109;
    border: 1px solid rgba(245,158,11,0.08);
    border-radius: 14px; padding: 1.3rem 1.4rem;
  }
  .card-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;
  }
  .card-title-group { display: flex; align-items: center; gap: 0.5rem; }
  .card-icon { font-size: 0.9rem; }
  .card-title { font-size: 0.88rem; font-weight: 700; color: #c8a96e; }
  .badge {
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.04em;
    padding: 0.2rem 0.6rem; border-radius: 100px;
    background: rgba(245,158,11,0.08); color: #6b6355;
    border: 1px solid rgba(245,158,11,0.1);
  }

  /* ── BOTTOM ROW ── */
  .bottom-row {
    display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem;
  }
  @media (max-width: 1000px) { .bottom-row { grid-template-columns: 1fr; } }

  /* Quick actions */
  .quick-actions { display: flex; flex-direction: column; gap: 0.5rem; }
  .quick-action-item {
    display: flex; align-items: center; gap: 0.8rem;
    padding: 0.7rem 0.8rem; border-radius: 10px;
    background: rgba(245,158,11,0.03); border: 1px solid rgba(245,158,11,0.06);
    cursor: pointer; transition: all 0.15s; text-align: left; width: 100%;
    font-family: 'Syne', sans-serif;
  }
  .quick-action-item:hover {
    background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.15);
    transform: translateX(3px);
  }
  .qa-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }
  .qa-label { font-size: 0.8rem; font-weight: 700; color: #c8a96e; }
  .qa-sub { font-size: 0.68rem; color: #4a4035; margin-top: 0.1rem; }
  .qa-arrow { margin-left: auto; color: #4a4035; font-size: 0.85rem; transition: color 0.15s; }
  .quick-action-item:hover .qa-arrow { color: #f59e0b; }

  /* Agent status */
  .agent-status-body {
    display: flex; flex-direction: column; align-items: center;
    padding: 1rem 0 1.2rem; text-align: center; gap: 0.5rem;
  }
  .agent-orb { position: relative; width: 56px; height: 56px; margin-bottom: 0.3rem; }
  .orb-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px dashed rgba(245,158,11,0.3);
    animation: spin 10s linear infinite;
  }
  .orb-core {
    position: absolute; inset: 8px; border-radius: 50%;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #f59e0b; font-size: 1rem;
  }
  .agent-status-label { font-size: 0.88rem; font-weight: 700; color: #c8a96e; }
  .agent-status-sub { font-size: 0.72rem; color: #4a4035; line-height: 1.5; max-width: 220px; }
  .cta-btn-sm {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0a0805; border: none; border-radius: 8px;
    padding: 0.45rem 1rem; font-size: 0.75rem; font-weight: 800;
    font-family: 'Syne', sans-serif; cursor: pointer;
    margin-top: 0.3rem; transition: all 0.2s;
  }
  .cta-btn-sm:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(245,158,11,0.3); }

  .status-checklist {
    display: flex; flex-direction: column; gap: 0.5rem;
    padding-top: 1rem; border-top: 1px solid rgba(245,158,11,0.08);
  }
  .check-item { display: flex; align-items: center; gap: 0.7rem; }
  .check-dot {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid rgba(245,158,11,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: transparent;
  }
  .check-dot.done { background: #34d399; border-color: #34d399; color: #022c22; }
  .check-label { font-size: 0.75rem; color: #4a4035; }
  .check-label.done { color: #34d399; text-decoration: line-through; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── SCROLLBAR ── */
  .page-body::-webkit-scrollbar { width: 4px; }
  .page-body::-webkit-scrollbar-track { background: transparent; }
  .page-body::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 4px; }
`;
