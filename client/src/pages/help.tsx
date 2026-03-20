import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function HelpPage() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  const FAQS = [
    { q: t("help.faq1Q"), a: t("help.faq1A") },
    { q: t("help.faq2Q"), a: t("help.faq2A") },
    { q: t("help.faq3Q"), a: t("help.faq3A") },
    { q: t("help.faq4Q"), a: t("help.faq4A") },
    { q: t("help.faq5Q"), a: t("help.faq5A") },
    { q: t("help.faq6Q"), a: t("help.faq6A") },
  ];

  const helpCards = [
    { icon: "◉", titleKey: "cardGettingStarted", descKey: "cardGettingStartedDesc", color: "#f59e0b" },
    { icon: "⊟", titleKey: "cardKB",             descKey: "cardKBDesc",             color: "#60a5fa" },
    { icon: "◈", titleKey: "cardVideos",          descKey: "cardVideosDesc",         color: "#34d399" },
    { icon: "⊕", titleKey: "cardAPI",             descKey: "cardAPIDesc",            color: "#f472b6" },
  ];

  const resources = [
    { labelKey: "discord",  subKey: "discordSub",  icon: "💬" },
    { labelKey: "roadmap",  subKey: "roadmapSub",  icon: "◎"  },
    { labelKey: "changelog",subKey: "changelogSub",icon: "⊟"  },
  ];

  const filtered = FAQS.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">? {t("help.title")}</span>
        <input className="a-search" placeholder={t("help.searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search-help" />
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("help.title")}</div>
            <div className="a-page-sub">{t("help.subtitle")}</div>
          </div>
        </div>

        <div className="help-cards a-anim" style={{ animationDelay: ".05s" }}>
          {helpCards.map((card, i) => (
            <a key={i} href="#" className="help-card" data-testid={`help-card-${i}`}>
              <div className="help-card-icon" style={{ color: card.color, background: `${card.color}18` }}>{card.icon}</div>
              <div className="help-card-title">{t(`help.${card.titleKey}`)}</div>
              <div className="help-card-desc">{t(`help.${card.descKey}`)}</div>
              <span className="help-card-arrow">→</span>
            </a>
          ))}
        </div>

        <div className="a-card a-anim" style={{ animationDelay: ".1s" }}>
          <div className="card-hd"><span style={{ color: "#f59e0b" }}>◉</span><span className="card-hd-title">{t("help.faqTitle")}</span></div>
          {filtered.length === 0 && (
            <div style={{ color: "#6b6355", fontSize: ".82rem", padding: ".5rem 0" }}>{t("help.noResults")} "{search}"</div>
          )}
          {filtered.map((faq, i) => (
            <div key={i} className="faq-item" data-testid={`faq-${i}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-chevron" style={{ transform: openFaq === i ? "rotate(180deg)" : "none" }}>⌄</span>
              </button>
              {openFaq === i && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>

        <div className="a-grid-2 a-anim" style={{ animationDelay: ".15s" }}>
          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#60a5fa" }}>◇</span><span className="card-hd-title">{t("help.contactSupport")}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
              <div><label className="a-label">{t("help.subject")}</label><input className="a-input" placeholder={t("help.subjectPlaceholder")} data-testid="input-support-subject" /></div>
              <div><label className="a-label">{t("help.message")}</label><textarea className="a-textarea" placeholder={t("help.messagePlaceholder")} style={{ minHeight: 90 }} data-testid="textarea-support-message" /></div>
              {msgSent ? (
                <div style={{ fontSize: ".78rem", color: "#34d399", fontWeight: 700 }}>{t("help.messageSent")}</div>
              ) : (
                <button className="a-btn a-btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => setMsgSent(true)} data-testid="button-send-support">{t("help.sendMessage")}</button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
            <div className="a-card" style={{ flex: 1 }}>
              <div className="card-hd"><span style={{ color: "#34d399" }}>⊕</span><span className="card-hd-title">{t("help.community")}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {resources.map((r, i) => (
                  <a key={i} href="#" className="resource-row" data-testid={`resource-${i}`}>
                    <div className="resource-icon">{r.icon}</div>
                    <div>
                      <div className="resource-label">{t(`help.${r.labelKey}`)}</div>
                      <div className="resource-sub">{t(`help.${r.subKey}`)}</div>
                    </div>
                    <span className="resource-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="a-card" style={{ background: "rgba(245,158,11,.04)", borderColor: "rgba(245,158,11,.15)" }}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#f59e0b", marginBottom: ".35rem" }}>{t("help.gettingStartedGuide")}</div>
              <div style={{ fontSize: ".72rem", color: "#6b6355", lineHeight: 1.55 }}>{t("help.gettingStartedGuideDesc")}</div>
              <button className="a-btn a-btn-primary" style={{ marginTop: ".8rem", fontSize: ".75rem" }} data-testid="button-getting-started">{t("help.viewGuide")}</button>
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
  .a-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.5rem 1.2rem;font-size:.82rem;box-shadow:0 6px 20px rgba(245,158,11,.22);}
  .a-btn-primary:hover{transform:translateY(-1px);}
  .a-label{font-size:.72rem;font-weight:700;color:#6b6355;margin-bottom:.35rem;display:block;}
  .a-input,.a-textarea,.a-search{background:#0f0d0a;border:1px solid rgba(245,158,11,.1);border-radius:10px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.6rem .9rem;outline:none;transition:border-color .2s;}
  .a-input,.a-textarea{width:100%;}
  .a-input:focus,.a-textarea:focus,.a-search:focus{border-color:rgba(245,158,11,.25);}
  .a-input::placeholder,.a-textarea::placeholder,.a-search::placeholder{color:#4a4035;}
  .a-textarea{resize:vertical;min-height:80px;line-height:1.6;}
  .a-search{width:200px;font-size:.78rem;}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .help-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;}
  .help-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.1rem 1.2rem;text-decoration:none;transition:all .2s;display:flex;flex-direction:column;gap:.3rem;position:relative;}
  .help-card:hover{border-color:rgba(245,158,11,.22);transform:translateY(-1px);}
  .help-card-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.9rem;margin-bottom:.3rem;}
  .help-card-title{font-size:.82rem;font-weight:700;color:#c8a96e;}
  .help-card-desc{font-size:.7rem;color:#6b6355;line-height:1.45;}
  .help-card-arrow{margin-top:auto;font-size:.85rem;color:#4a4035;transition:color .15s;}
  .help-card:hover .help-card-arrow{color:#f59e0b;}
  .faq-item{border-bottom:1px solid rgba(245,158,11,.06);}
  .faq-item:last-child{border-bottom:none;}
  .faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.85rem 0;background:none;border:none;font-family:'Syne',sans-serif;font-size:.82rem;font-weight:600;color:#c8a96e;cursor:pointer;width:100%;text-align:left;transition:color .15s;}
  .faq-q:hover{color:#f5e6c8;}
  .faq-chevron{flex-shrink:0;color:#6b6355;font-size:.9rem;transition:transform .2s;}
  .faq-a{font-size:.78rem;color:#6b6355;line-height:1.6;padding:.25rem 0 1rem;animation:a-fadeUp .2s ease;}
  .resource-row{display:flex;align-items:center;gap:.65rem;padding:.5rem 0;border-bottom:1px solid rgba(245,158,11,.06);text-decoration:none;transition:all .15s;cursor:pointer;}
  .resource-row:last-child{border-bottom:none;}
  .resource-row:hover .resource-label{color:#f5e6c8;}
  .resource-icon{width:28px;height:28px;border-radius:7px;background:rgba(245,158,11,.07);display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0;}
  .resource-label{font-size:.8rem;font-weight:600;color:#c8a96e;}
  .resource-sub{font-size:.67rem;color:#6b6355;margin-top:.1rem;}
  .resource-arrow{margin-left:auto;color:#4a4035;font-size:.85rem;transition:color .15s;}
  .resource-row:hover .resource-arrow{color:#f59e0b;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:900px){.help-cards{grid-template-columns:1fr 1fr;}.a-grid-2{grid-template-columns:1fr;}}
`;
