import { useTranslation } from "react-i18next";

export default function RevenuePage() {
  const { t } = useTranslation();

  const stats = [
    { label: t("revenue.conversionAssists"),   value: "0",    sub: t("revenue.thisMonth"),        color: "#f59e0b", icon: "◎" },
    { label: t("revenue.totalValue"),          value: "€0",   sub: t("revenue.revenueInfluenced"), color: "#34d399", icon: "◈" },
    { label: t("revenue.missedOpportunities"), value: "0",    sub: t("revenue.escalatedOrLost"),   color: "#f87171", icon: "⚠" },
    { label: t("revenue.sentimentTrend"),      value: "N/A",  sub: t("revenue.avgRating"),         color: "#60a5fa", icon: "◉" },
  ];
  const convOpps = [
    { label: t("revenue.opp1"), count: 0, value: "€0" },
    { label: t("revenue.opp2"), count: 0, value: "€0" },
    { label: t("revenue.opp3"), count: 0, value: "€0" },
  ];
  const missedSales = [
    { label: t("revenue.ms1"), count: 0, priority: "high"   },
    { label: t("revenue.ms2"), count: 0, priority: "medium" },
    { label: t("revenue.ms3"), count: 0, priority: "low"    },
  ];
  const roi = [
    { label: t("revenue.chatsHandled"),   value: "0",  unit: t("revenue.chats"),   color: "#f59e0b" },
    { label: t("revenue.timeSaved"),      value: "0",  unit: t("revenue.hours"),   color: "#34d399" },
    { label: t("revenue.estimatedSavings"), value: "€0", unit: t("revenue.atRate"), color: "#60a5fa" },
  ];

  return (
    <>
      <style>{sharedCss}</style>
      <div className="aura-topbar"><span className="aura-topbar-title">◎ {t("revenue.title")}</span></div>
      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("revenue.title")}</div>
            <div className="a-page-sub">{t("revenue.subtitle")}</div>
          </div>
        </div>
        <div className="a-grid-4 a-anim" style={{ animationDelay: ".05s" }}>
          {stats.map((s, i) => (
            <div key={i} className="a-card" style={{ animationDelay: `${i * .07}s`, animation: "a-fadeUp .45s ease both" }} data-testid={`stat-${i}`}>
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
            <div className="card-hd"><span style={{ color: "#34d399" }}>◎</span><span className="card-hd-title">{t("revenue.conversionOpps")}</span></div>
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
            <div className="card-hd"><span style={{ color: "#f87171" }}>⚠</span><span className="card-hd-title">{t("revenue.missedSalesSignals")}</span></div>
            {missedSales.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderBottom: i < missedSales.length - 1 ? "1px solid rgba(245,158,11,.06)" : "none" }}>
                <span style={{ fontSize: ".8rem", color: "#6b6355" }}>{m.label}</span>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <span style={{ fontSize: ".72rem", color: "#c8a96e", fontWeight: 700 }}>{m.count}</span>
                  <span className={`a-badge ${m.priority === "high" ? "a-badge-red" : m.priority === "medium" ? "a-badge-amber" : "a-badge-muted"}`}>{t(`common.${m.priority}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="a-card a-anim" style={{ animationDelay: ".15s", background: "rgba(245,158,11,.03)", borderColor: "rgba(245,158,11,.14)" }}>
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>◈</span><span className="card-hd-title">{t("revenue.roiCalculator")}</span></div>
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
  .a-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
  .a-badge{display:inline-flex;align-items:center;font-size:.62rem;font-weight:700;letter-spacing:.04em;padding:.18rem .55rem;border-radius:100px;text-transform:uppercase;}
  .a-badge-amber{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}
  .a-badge-red{background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.2);}
  .a-badge-muted{background:rgba(255,255,255,.04);color:#6b6355;border:1px solid rgba(245,158,11,.08);}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:900px){.a-grid-2,.a-grid-4{grid-template-columns:1fr;}}
`;
