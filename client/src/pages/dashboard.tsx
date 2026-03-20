import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Literata:ital,wght@0,400;0,500;1,400&display=swap"
    rel="stylesheet"
  />
);

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  /* ─── Chart data (translated labels) ─── */
  const volumeData = [
    { day: t("dashboard.dayMon"), v: 0 },
    { day: t("dashboard.dayTue"), v: 0 },
    { day: t("dashboard.dayWed"), v: 0 },
    { day: t("dashboard.dayThu"), v: 0 },
    { day: t("dashboard.dayFri"), v: 0 },
    { day: t("dashboard.daySat"), v: 0 },
    { day: t("dashboard.daySun"), v: 0 },
  ];

  const topicsData = [
    { topic: t("dashboard.topicGeneral"),  count: 0 },
    { topic: t("dashboard.topicSupport"),  count: 0 },
    { topic: t("dashboard.topicProduct"),  count: 0 },
    { topic: t("dashboard.topicPricing"),  count: 0 },
    { topic: t("dashboard.topicOther"),    count: 0 },
  ];

  /* ─── Custom tooltip ─── */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: "#0f0d0a", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 8, padding: "6px 12px",
          fontFamily: "Syne, sans-serif", fontSize: 12, color: "#f5e6c8",
        }}>
          <div style={{ color: "#f59e0b", fontWeight: 700 }}>{label}</div>
          <div>{payload[0].value} {t("dashboard.tooltipConversations")}</div>
        </div>
      );
    }
    return null;
  };

  const { data: stats } = useQuery<{
    totalDocuments: number;
    totalConversations: number;
    totalMessages: number;
    avgSatisfaction: number;
  }>({ queryKey: ["/api/stats"] });

  const { data: documents = [] } = useQuery<{ status: string }[]>({
    queryKey: ["/api/documents"],
  });

  const readyDocs = documents.filter((d) => d.status === "ready").length;

  return (
    <>
      <FontLink />
      <style>{css}</style>

      <div className="aura-page">

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">{t("dashboard.title")}</h1>
            <p className="page-sub">{t("dashboard.subtitle")}</p>
          </div>
          <button className="cta-btn" onClick={() => navigate("/playground")}>
            <span>✦</span> {t("dashboard.testingEnv")}
          </button>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          {[
            {
              label: t("dashboard.statConversations"),
              value: String(stats?.totalConversations ?? 0),
              sub: t("dashboard.statSubAllTime"),
              icon: "◇",
              accent: "#f59e0b",
            },
            {
              label: t("dashboard.statMessages"),
              value: String(stats?.totalMessages ?? 0),
              sub: t("dashboard.statSubAllTime"),
              icon: "◎",
              accent: "#34d399",
            },
            {
              label: t("dashboard.statDocuments"),
              value: `${readyDocs}/${stats?.totalDocuments ?? 0}`,
              sub: t("dashboard.statSubReadyTraining"),
              icon: "⊟",
              accent: "#60a5fa",
            },
            {
              label: t("dashboard.statSatisfaction"),
              value: stats?.avgSatisfaction ? `${stats.avgSatisfaction}%` : "N/A",
              sub: t("dashboard.statSubRating"),
              icon: "◈",
              accent: "#f472b6",
            },
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
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-icon" style={{ color: "#f59e0b" }}>↗</span>
                <span className="card-title">{t("dashboard.chartVolume")}</span>
              </div>
              <span className="badge">{t("dashboard.badgeLast7")}</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volumeData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
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
                <span className="card-title">{t("dashboard.chartTopics")}</span>
              </div>
              <span className="badge">{t("dashboard.badgeThisMonth")}</span>
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
                <span className="card-title">{t("dashboard.quickActionsTitle")}</span>
              </div>
            </div>
            <div className="quick-actions">
              {[
                { icon: "⊟", label: t("dashboard.qaUploadLabel"),    sub: t("dashboard.qaUploadSub"),    color: "#f59e0b", path: "/documents" },
                { icon: "◈", label: t("dashboard.qaConfigureLabel"),  sub: t("dashboard.qaConfigureSub"), color: "#34d399", path: "/agent" },
                { icon: "◻", label: t("dashboard.qaPlaygroundLabel"), sub: t("dashboard.qaPlaygroundSub"),color: "#60a5fa", path: "/playground" },
                { icon: "⊕", label: t("dashboard.qaConnectLabel"),    sub: t("dashboard.qaConnectSub"),   color: "#f472b6", path: "/deploy" },
              ].map((a, i) => (
                <button className="quick-action-item" key={i} onClick={() => navigate(a.path)}>
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
                <span className="card-title">{t("dashboard.agentStatusTitle")}</span>
              </div>
            </div>
            <div className="agent-status-body">
              <div className="agent-orb">
                <div className="orb-ring" />
                <div className="orb-core">✦</div>
              </div>
              <div className="agent-status-label">
                {stats?.totalConversations ? t("dashboard.agentActive") : t("dashboard.agentNotConfigured")}
              </div>
              <div className="agent-status-sub">
                {stats?.totalConversations
                  ? t("dashboard.agentActiveDesc", { count: stats.totalConversations })
                  : t("dashboard.agentNotConfiguredDesc")}
              </div>
              <button className="cta-btn-sm" onClick={() => navigate("/agent")}>
                {stats?.totalConversations ? t("dashboard.manageAgent") : t("dashboard.createAgent")}
              </button>
            </div>

            <div className="status-checklist">
              {[
                { done: (stats?.totalDocuments ?? 0) > 0,     label: t("dashboard.checklistUpload") },
                { done: false,                                  label: t("dashboard.checklistConfigure") },
                { done: (stats?.totalConversations ?? 0) > 0, label: t("dashboard.checklistTest") },
                { done: false,                                  label: t("dashboard.checklistDeploy") },
              ].map((item, i) => (
                <div className="check-item" key={i}>
                  <div className={`check-dot ${item.done ? "done" : ""}`}>{item.done ? "✓" : ""}</div>
                  <span className={`check-label ${item.done ? "done" : ""}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const css = `
  .aura-page {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    font-family: 'Syne', sans-serif;
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

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
