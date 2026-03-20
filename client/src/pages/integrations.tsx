import { useState } from "react";
import { useTranslation } from "react-i18next";

const INTEGRATIONS = [
  { categoryKey: "catEcommerce", items: [
    { name: "Shopify",         icon: "🛍️", desc: "Sync product catalogue & orders",       url: "https://partners.shopify.com/signup" },
    { name: "WooCommerce",     icon: "🛒", desc: "WordPress-based store integration",     url: "https://woocommerce.com/document/woocommerce-rest-api/" },
    { name: "BigCommerce",     icon: "📦", desc: "Enterprise e-commerce platform",        url: "https://developer.bigcommerce.com/api-docs/getting-started" },
  ]},
  { categoryKey: "catCRM", items: [
    { name: "HubSpot",         icon: "🟠", desc: "Sync contacts & ticket history",        url: "https://app.hubspot.com/login" },
    { name: "Salesforce",      icon: "☁️", desc: "Enterprise CRM integration",           url: "https://developer.salesforce.com/signup" },
    { name: "Zendesk",         icon: "🎫", desc: "Ticket routing & escalation",           url: "https://www.zendesk.com/register/" },
    { name: "Freshdesk",       icon: "💚", desc: "Customer support platform",             url: "https://freshdesk.com/signup" },
  ]},
  { categoryKey: "catMessaging", items: [
    { name: "WhatsApp",           icon: "💬", desc: "Deploy on WhatsApp Business",        url: "https://business.facebook.com/wa/manage/" },
    { name: "Facebook Messenger", icon: "💙", desc: "Facebook page chat integration",     url: "https://developers.facebook.com/apps/" },
    { name: "Instagram DMs",      icon: "📷", desc: "Respond to Instagram messages",      url: "https://developers.facebook.com/apps/" },
    { name: "Telegram",           icon: "✈️", desc: "Telegram bot integration",          url: "https://core.telegram.org/bots#how-do-i-create-a-bot" },
    { name: "Slack",              icon: "⚡", desc: "Internal team notifications",        url: "https://api.slack.com/apps" },
  ]},
  { categoryKey: "catAnalytics", items: [
    { name: "Google Analytics",icon: "📊", desc: "Track chat conversions & events",       url: "https://analytics.google.com/" },
    { name: "Mixpanel",        icon: "🔥", desc: "User behaviour analytics",              url: "https://mixpanel.com/register/" },
  ]},
  { categoryKey: "catEmail", items: [
    { name: "Mailchimp",       icon: "🐵", desc: "Capture emails & add to lists",         url: "https://login.mailchimp.com/signup/" },
    { name: "SendGrid",        icon: "📧", desc: "Transactional email delivery",          url: "https://signup.sendgrid.com/" },
  ]},
];

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  function toggle(name: string, url?: string) {
    const isConn = connected[name];
    if (!isConn && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setConnected(c => ({ ...c, [name]: !c[name] }));
  }

  const filtered = INTEGRATIONS.map(cat => ({
    ...cat,
    items: cat.items.filter(item => !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  const totalConnected = Object.values(connected).filter(Boolean).length;

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">⊕ {t("integrations.title")}</span>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {totalConnected > 0 && <span className="a-badge a-badge-green">{totalConnected} {t("integrations.connected")}</span>}
          <input className="a-search" placeholder={t("integrations.searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search-integrations" />
        </div>
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("integrations.title")}</div>
            <div className="a-page-sub">{t("integrations.subtitle")}</div>
          </div>
        </div>

        {filtered.map((cat, ci) => (
          <div key={cat.categoryKey} className="a-anim" style={{ animationDelay: `${ci * 0.07}s` }}>
            <div className="int-cat-label">{t(`integrations.${cat.categoryKey}`)}</div>
            <div className="int-grid">
              {cat.items.map((item) => {
                const isConnected = connected[item.name] || false;
                return (
                  <div key={item.name} className={`int-card ${isConnected ? "connected" : ""}`} data-testid={`integration-${item.name.toLowerCase().replace(/\s/g, "-")}`}>
                    <div className="int-card-top">
                      <div className="int-icon">{item.icon}</div>
                      <span className={`a-badge ${isConnected ? "a-badge-green" : "a-badge-muted"}`}>
                        {isConnected ? t("integrations.connectedStatus") : t("integrations.notConnectedStatus")}
                      </span>
                    </div>
                    <div className="int-name">{item.name}</div>
                    <div className="int-desc">{item.desc}</div>
                    <button
                      className={`int-btn ${isConnected ? "disconnect" : "connect"}`}
                      onClick={() => toggle(item.name, item.url)}
                      data-testid={`button-${isConnected ? "disconnect" : "connect"}-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {isConnected ? t("common.disconnect") : t("common.connect")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b6355", padding: "3rem", fontSize: ".85rem" }}>
            {t("integrations.noResults")} "{search}"
          </div>
        )}
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
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-badge{display:inline-flex;align-items:center;font-size:.62rem;font-weight:700;letter-spacing:.04em;padding:.18rem .55rem;border-radius:100px;text-transform:uppercase;}
  .a-badge-green{background:rgba(52,211,153,.1);color:#34d399;border:1px solid rgba(52,211,153,.2);}
  .a-badge-muted{background:rgba(255,255,255,.04);color:#6b6355;border:1px solid rgba(245,158,11,.08);}
  .a-search{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:9px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.78rem;padding:.4rem .85rem;outline:none;transition:border-color .2s;width:200px;}
  .a-search:focus{border-color:rgba(245,158,11,.25);}
  .a-search::placeholder{color:#4a4035;}
  .int-cat-label{font-size:.68rem;font-weight:700;letter-spacing:.08em;color:#4a4035;text-transform:uppercase;margin-bottom:.65rem;}
  .int-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.85rem;}
  .int-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.1rem 1.2rem;transition:all .2s;display:flex;flex-direction:column;gap:.4rem;}
  .int-card:hover{border-color:rgba(245,158,11,.2);transform:translateY(-1px);}
  .int-card.connected{border-color:rgba(52,211,153,.2);background:rgba(52,211,153,.03);}
  .int-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem;}
  .int-icon{font-size:1.4rem;}
  .int-name{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .int-desc{font-size:.72rem;color:#6b6355;line-height:1.45;flex:1;}
  .int-btn{margin-top:.6rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;border-radius:8px;padding:.35rem .7rem;cursor:pointer;transition:all .15s;border:1px solid;}
  .int-btn.connect{background:rgba(245,158,11,.08);color:#f59e0b;border-color:rgba(245,158,11,.2);}
  .int-btn.connect:hover{background:rgba(245,158,11,.15);}
  .int-btn.disconnect{background:rgba(248,113,113,.07);color:#f87171;border-color:rgba(248,113,113,.18);}
  .int-btn.disconnect:hover{background:rgba(248,113,113,.13);}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;
