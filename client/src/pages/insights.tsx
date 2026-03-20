import { useState } from "react";
import { useTranslation } from "react-i18next";

const INTENTS = [
  { label: "Opening hours enquiry",   confidence: 94, count: 142, trend: "+12%" },
  { label: "Return / refund request", confidence: 87, count: 98,  trend: "+4%"  },
  { label: "Product availability",    confidence: 82, count: 76,  trend: "+18%" },
  { label: "Delivery status",         confidence: 78, count: 64,  trend: "-2%"  },
  { label: "Pricing enquiry",         confidence: 71, count: 51,  trend: "+7%"  },
];

const GAPS = [
  { label: "No info on loyalty programme",     priority: "high",   count: 34 },
  { label: "Missing sizing guide for jackets", priority: "high",   count: 28 },
  { label: "Wholesale / bulk order pricing",   priority: "medium", count: 19 },
  { label: "Gift wrapping options",            priority: "low",    count: 11 },
];

const TEMPLATES = [
  { label: "Loyalty programme",  text: "Our loyalty programme rewards you with 1 point per €1 spent. Points can be redeemed for discounts at checkout. Sign up free at [link]." },
  { label: "Sizing guide",       text: "For our jackets, we recommend sizing up if you're between sizes. Our full sizing guide is available at [link]. Returns are free if the size isn't right!" },
];

export default function InsightsPage() {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  function analyze() {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); }, 2000);
  }

  function copy(text: string, i: number) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  const voiceChars = [t("insights.voiceChar1"), t("insights.voiceChar2"), t("insights.voiceChar3"), t("insights.voiceChar4")];

  const statCards = [
    { icon: "◉", label: t("insights.discoveredIntents"), value: "5",  sub: t("insights.thisMonth"),        color: "#f59e0b" },
    { icon: "◎", label: t("insights.avgConfidence"),     value: "82%", sub: t("insights.acrossAllIntents"), color: "#34d399" },
    { icon: "◈", label: t("insights.knowledgeGaps"),     value: "4",   sub: t("insights.needAttention"),    color: "#f472b6" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">◉ {t("insights.title")}</span>
        <button className={`a-btn a-btn-primary ${analyzing ? "loading" : ""}`} onClick={analyze} disabled={analyzing} data-testid="button-auto-analyze">
          {analyzing ? t("insights.analysing") : t("insights.autoAnalyse")}
        </button>
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("insights.title")}</div>
            <div className="a-page-sub">{t("insights.subtitle")}</div>
          </div>
        </div>

        <div className="ins-stats a-anim" style={{ animationDelay: "0.05s" }}>
          {statCards.map((s, i) => (
            <div key={i} className="ins-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="ins-stat-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
              <div className="ins-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="ins-stat-label">{s.label}</div>
              <div className="ins-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="ins-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="a-card a-anim" style={{ animationDelay: "0.1s" }}>
              <div className="card-hd"><span style={{ color: "#f472b6" }}>◈</span><span className="card-hd-title">{t("insights.brandVoice")}</span></div>
              <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                <span className="a-badge a-badge-amber">Friendly</span>
                <span className="a-badge a-badge-blue">Informative</span>
                <span className="a-badge a-badge-green">Helpful</span>
                <span className="a-badge a-badge-muted">Concise</span>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b6355" }}>{t("insights.formalityLevel")}</span>
                  <span style={{ fontSize: "0.72rem", color: "#f59e0b", fontWeight: 700 }}>42%</span>
                </div>
                <div className="a-progress-track"><div className="a-progress-fill" style={{ width: "42%" }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.6rem", color: "#4a4035" }}>
                  <span>{t("common.casual")}</span><span>{t("common.formal")}</span>
                </div>
              </div>
              <div className="voice-chars">
                {voiceChars.map((c, i) => (
                  <div key={i} className="voice-char"><span style={{ color: "#34d399" }}>✓</span> {c}</div>
                ))}
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.15s" }}>
              <div className="card-hd"><span style={{ color: "#f87171" }}>⚠</span><span className="card-hd-title">{t("insights.knowledgeGapsSection")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {GAPS.map((g, i) => (
                  <div key={i} className="gap-row" data-testid={`knowledge-gap-${i}`}>
                    <div className="gap-info">
                      <div className="gap-label">{g.label}</div>
                      <div className="gap-count">{g.count} {t("insights.unanswered")}</div>
                    </div>
                    <span className={`a-badge ${g.priority === "high" ? "a-badge-red" : g.priority === "medium" ? "a-badge-amber" : "a-badge-muted"}`}>
                      {t(`common.${g.priority}`)}
                    </span>
                  </div>
                ))}
              </div>
              <button className="a-btn a-btn-ghost" style={{ marginTop: "1rem", width: "100%", justifyContent: "center", fontSize: "0.78rem" }}>
                {t("insights.addToKB")}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="a-card a-anim" style={{ animationDelay: "0.08s" }}>
              <div className="card-hd"><span style={{ color: "#60a5fa" }}>◉</span><span className="card-hd-title">{t("insights.discoveredIntents")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {INTENTS.map((intent, i) => (
                  <div key={i} className="intent-row" data-testid={`intent-${i}`}>
                    <div className="intent-top">
                      <span className="intent-label">{intent.label}</span>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span className="intent-count">{intent.count}</span>
                        <span className={`intent-trend ${intent.trend.startsWith("+") ? "up" : "down"}`}>{intent.trend}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className="a-progress-track" style={{ flex: 1 }}>
                        <div className="a-progress-fill" style={{ width: `${intent.confidence}%`, background: "linear-gradient(90deg,#60a5fa,#3b82f6)" }} />
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "#60a5fa", fontWeight: 700, minWidth: "30px", textAlign: "right" }}>{intent.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="a-card a-anim" style={{ animationDelay: "0.18s" }}>
              <div className="card-hd"><span style={{ color: "#34d399" }}>⊟</span><span className="card-hd-title">{t("insights.suggestedTemplates")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {TEMPLATES.map((tmpl, i) => (
                  <div key={i} className="template-card" data-testid={`response-template-${i}`}>
                    <div className="template-label">{tmpl.label}</div>
                    <div className="template-text">{tmpl.text}</div>
                    <button className="template-copy" onClick={() => copy(tmpl.text, i)} data-testid={`button-copy-template-${i}`}>
                      {copied === i ? t("common.copied") : t("common.copy")}
                    </button>
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
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .aura-page{flex:1;overflow-y:auto;padding:2rem 2.4rem;display:flex;flex-direction:column;gap:1.4rem;}
  .aura-page::-webkit-scrollbar{width:4px;} .aura-page::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .a-page-hd{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
  .a-page-title{font-family:'Literata',serif;font-size:1.55rem;font-weight:500;color:#f5e6c8;letter-spacing:-.02em;}
  .a-page-sub{font-size:.8rem;color:#6b6355;margin-top:.25rem;}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.4rem 1.6rem;}
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;box-shadow:0 6px 20px rgba(245,158,11,.22);}
  .a-btn-primary:hover{transform:translateY(-1px);}
  .a-btn-primary.loading{opacity:.7;cursor:not-allowed;}
  .a-btn-ghost{background:rgba(245,158,11,.07);color:#c8a96e;border:1px solid rgba(245,158,11,.12);border-radius:10px;padding:.5rem 1rem;font-size:.78rem;}
  .a-btn-ghost:hover{background:rgba(245,158,11,.12);}
  .a-badge{display:inline-flex;align-items:center;font-size:.62rem;font-weight:700;letter-spacing:.04em;padding:.18rem .55rem;border-radius:100px;text-transform:uppercase;}
  .a-badge-amber{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}
  .a-badge-blue{background:rgba(96,165,250,.1);color:#60a5fa;border:1px solid rgba(96,165,250,.2);}
  .a-badge-green{background:rgba(52,211,153,.1);color:#34d399;border:1px solid rgba(52,211,153,.2);}
  .a-badge-red{background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.2);}
  .a-badge-muted{background:rgba(255,255,255,.04);color:#6b6355;border:1px solid rgba(245,158,11,.1);}
  .a-progress-track{height:5px;background:#1a1610;border-radius:100px;overflow:hidden;}
  .a-progress-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#f59e0b,#d97706);transition:width .6s ease;}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .ins-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
  .ins-stat-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.2rem 1.4rem;text-align:center;animation:a-fadeUp .45s ease both;}
  .ins-stat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;margin:0 auto .75rem;}
  .ins-stat-val{font-size:1.8rem;font-weight:800;line-height:1;margin-bottom:.25rem;}
  .ins-stat-label{font-size:.78rem;font-weight:700;color:#c8a96e;margin-bottom:.15rem;}
  .ins-stat-sub{font-size:.65rem;color:#4a4035;}
  .ins-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
  .voice-chars{display:flex;flex-direction:column;gap:.4rem;}
  .voice-char{font-size:.78rem;color:#6b6355;display:flex;align-items:center;gap:.5rem;}
  .gap-row{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.55rem 0;border-bottom:1px solid rgba(245,158,11,.06);}
  .gap-row:last-child{border-bottom:none;}
  .gap-label{font-size:.8rem;font-weight:600;color:#c8a96e;margin-bottom:.1rem;}
  .gap-count{font-size:.65rem;color:#6b6355;}
  .intent-row{padding:.5rem 0;border-bottom:1px solid rgba(245,158,11,.06);}
  .intent-row:last-child{border-bottom:none;}
  .intent-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.4rem;}
  .intent-label{font-size:.8rem;font-weight:600;color:#c8a96e;}
  .intent-count{font-size:.7rem;color:#6b6355;}
  .intent-trend{font-size:.65rem;font-weight:700;}
  .intent-trend.up{color:#34d399;}
  .intent-trend.down{color:#f87171;}
  .template-card{background:#0f0d0a;border:1px solid rgba(245,158,11,.08);border-radius:10px;padding:.9rem 1rem;}
  .template-label{font-size:.75rem;font-weight:700;color:#f59e0b;margin-bottom:.4rem;}
  .template-text{font-size:.75rem;color:#6b6355;line-height:1.55;margin-bottom:.7rem;}
  .template-copy{background:rgba(52,211,153,.08);color:#34d399;border:1px solid rgba(52,211,153,.18);border-radius:7px;padding:.25rem .7rem;font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;transition:all .15s;}
  .template-copy:hover{background:rgba(52,211,153,.14);}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:900px){.ins-stats{grid-template-columns:1fr 1fr;}.ins-grid{grid-template-columns:1fr;}}
`;
