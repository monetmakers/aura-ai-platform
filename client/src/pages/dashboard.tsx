import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  /* Chart data (translated labels) */
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

  /* Custom tooltip */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: "#1f2937", border: "1px solid #374151",
          borderRadius: 10, padding: "0.5rem 0.875rem",
          fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", color: "#f3f4f6",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}>
          <div style={{ color: "#10b981", fontWeight: 700, marginBottom: "0.25rem" }}>{label}</div>
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
      <style>{css}</style>

      <div className="aura-dashboard">

        {/* Page header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">{t("dashboard.title")}</h1>
            <p className="dash-subtitle">{t("dashboard.subtitle")}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/playground")}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}>
              <defs>
                <linearGradient id="btn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: "#ffffff", stopOpacity: 0.9}} />
                  <stop offset="100%" style={{stopColor: "#ffffff", stopOpacity: 0.7}} />
                </linearGradient>
              </defs>
              <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#btn-grad)"/>
              <circle cx="12" cy="14" r="2" fill="#10b981"/>
              <circle cx="20" cy="14" r="2" fill="#10b981"/>
              <path d="M11 19Q16 22 21 19" stroke="#10b981" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="16" cy="7" r="1" fill="#10b981"/>
              <line x1="16" y1="8" x2="16" y2="11" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {t("dashboard.testingEnv")}
          </button>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          {[
            {
              label: t("dashboard.statConversations"),
              value: String(stats?.totalConversations ?? 0),
              sub: t("dashboard.statSubAllTime"),
              icon: "💬",
              accent: "#10b981",
            },
            {
              label: t("dashboard.statMessages"),
              value: String(stats?.totalMessages ?? 0),
              sub: t("dashboard.statSubAllTime"),
              icon: "📨",
              accent: "#3b82f6",
            },
            {
              label: t("dashboard.statDocuments"),
              value: `${readyDocs}/${stats?.totalDocuments ?? 0}`,
              sub: t("dashboard.statSubReadyTraining"),
              icon: "📚",
              accent: "#ec4899",
            },
            {
              label: t("dashboard.statSatisfaction"),
              value: stats?.avgSatisfaction ? `${stats.avgSatisfaction}%` : "N/A",
              sub: t("dashboard.statSubRating"),
              icon: "⭐",
              accent: "#f59e0b",
            },
          ].map((s, i) => (
            <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-top">
                <span className="stat-label">{s.label}</span>
                <div className="stat-icon" style={{ background: `${s.accent}15` }}>
                  <span style={{ fontSize: "1.25rem" }}>{s.icon}</span>
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
                <span className="card-icon">📈</span>
                <span className="card-title">{t("dashboard.chartVolume")}</span>
              </div>
              <span className="badge">{t("dashboard.badgeLast7")}</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "Inter" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "Inter" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fill="url(#volumeGrad)" 
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Message Topics */}
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-icon">🏷️</span>
                <span className="card-title">{t("dashboard.chartTopics")}</span>
              </div>
              <span className="badge">{t("dashboard.badgeThisMonth")}</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topicsData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis 
                  type="number" 
                  tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "Inter" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  type="category" 
                  dataKey="topic" 
                  tick={{ fill: "#d1d5db", fontSize: 12, fontFamily: "Inter" }} 
                  axisLine={false} 
                  tickLine={false} 
                  width={70} 
                />
                <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[0, 6, 6, 0]} 
                  barSize={14} 
                />
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
                <span className="card-icon">⚡</span>
                <span className="card-title">{t("dashboard.quickActionsTitle")}</span>
              </div>
            </div>
            <div className="quick-actions">
              {[
                { icon: "📚", label: t("dashboard.qaUploadLabel"),    sub: t("dashboard.qaUploadSub"),    color: "#10b981", path: "/documents" },
                { icon: "⚙️", label: t("dashboard.qaConfigureLabel"),  sub: t("dashboard.qaConfigureSub"), color: "#3b82f6", path: "/agent" },
                { icon: "🧪", label: t("dashboard.qaPlaygroundLabel"), sub: t("dashboard.qaPlaygroundSub"),color: "#ec4899", path: "/playground" },
                { icon: "🚀", label: t("dashboard.qaConnectLabel"),    sub: t("dashboard.qaConnectSub"),   color: "#f59e0b", path: "/deploy" },
              ].map((a, i) => (
                <button className="quick-action-btn" key={i} onClick={() => navigate(a.path)}>
                  <div className="qa-icon" style={{ background: `${a.color}15`, color: a.color }}>
                    <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                  </div>
                  <div className="qa-content">
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
                <span className="card-icon">🤖</span>
                <span className="card-title">{t("dashboard.agentStatusTitle")}</span>
              </div>
            </div>
            <div className="agent-status">
              <div className="agent-orb">
                <div className="orb-ring" />
                <div className="orb-core">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#orb-grad)"/>
                    <circle cx="12" cy="14" r="2" fill="white"/>
                    <circle cx="20" cy="14" r="2" fill="white"/>
                    <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="16" cy="7" r="1" fill="white"/>
                    <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="agent-status-label">
                {stats?.totalConversations ? t("dashboard.agentActive") : t("dashboard.agentNotConfigured")}
              </div>
              <div className="agent-status-desc">
                {stats?.totalConversations
                  ? t("dashboard.agentActiveDesc", { count: stats.totalConversations })
                  : t("dashboard.agentNotConfiguredDesc")}
              </div>
              <button className="btn-secondary" onClick={() => navigate("/agent")}>
                {stats?.totalConversations ? t("dashboard.manageAgent") : t("dashboard.createAgent")}
              </button>
            </div>

            <div className="checklist">
              {[
                { done: (stats?.totalDocuments ?? 0) > 0,     label: t("dashboard.checklistUpload") },
                { done: false,                                  label: t("dashboard.checklistConfigure") },
                { done: (stats?.totalConversations ?? 0) > 0, label: t("dashboard.checklistTest") },
                { done: false,                                  label: t("dashboard.checklistDeploy") },
              ].map((item, i) => (
                <div className="check-item" key={i}>
                  <div className={`check-box ${item.done ? "done" : ""}`}>
                    {item.done && <span>✓</span>}
                  </div>
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

/* Styles */
const css = `
  .aura-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Header */
  .dash-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .dash-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0 0 0.375rem;
  }

  .dash-subtitle {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0;
  }

  .btn-primary {
    display: flex;
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
    white-space: nowrap;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  .stat-card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s;
    cursor: default;
    animation: fadeUp 0.5s ease both;
  }

  .stat-card:hover {
    border-color: #374151;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-value {
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-sub {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  /* Charts */
  .charts-row {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 1024px) {
    .charts-row {
      grid-template-columns: 1fr;
    }
  }

  .chart-card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .card-title-group {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .card-icon {
    font-size: 1.125rem;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #f3f4f6;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  /* Bottom Row */
  .bottom-row {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 1024px) {
    .bottom-row {
      grid-template-columns: 1fr;
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.125rem;
    border-radius: 12px;
    background: #1f2937;
    border: 1px solid #374151;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  .quick-action-btn:hover {
    background: #374151;
    border-color: #4b5563;
    transform: translateX(4px);
  }

  .qa-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .qa-content {
    flex: 1;
  }

  .qa-label {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .qa-sub {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .qa-arrow {
    color: #6b7280;
    font-size: 1.125rem;
    transition: all 0.2s;
  }

  .quick-action-btn:hover .qa-arrow {
    color: #10b981;
    transform: translateX(3px);
  }

  /* Agent Status */
  .agent-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 0 1.75rem;
    text-align: center;
    gap: 0.75rem;
  }

  .agent-orb {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 0.5rem;
  }

  .orb-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px dashed rgba(16, 185, 129, 0.3);
    animation: spin 12s linear infinite;
  }

  .orb-core {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid rgba(16, 185, 129, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
  }

  .agent-status-label {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
  }

  .agent-status-desc {
    font-size: 0.875rem;
    color: #9ca3af;
    line-height: 1.6;
    max-width: 260px;
  }

  .btn-secondary {
    background: #1f2937;
    color: #10b981;
    border: 1px solid #10b981;
    border-radius: 10px;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }

  /* Checklist */
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid #1f2937;
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  .check-box {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    flex-shrink: 0;
    border: 2px solid #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: transparent;
    transition: all 0.2s;
  }

  .check-box.done {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;
  }

  .check-label {
    font-size: 0.875rem;
    color: #9ca3af;
    transition: all 0.2s;
  }

  .check-label.done {
    color: #10b981;
    text-decoration: line-through;
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
