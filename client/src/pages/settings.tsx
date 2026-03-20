import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  industry: string;
  plan: string;
  stripeCustomerId?: string;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [businessName, setBusinessName] = useState("Main Store");
  const [email, setEmail] = useState("john@mainstore.com");
  const [timezone, setTimezone] = useState("Europe/Dublin");
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [lowConf, setLowConf] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiRequest("GET", "/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user) {
            setBusinessName(data.user.businessName || "Main Store");
            setEmail(data.user.email || "john@mainstore.com");
          }
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    }
    fetchUser();
  }, []);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500); }

  const notifications = [
    { label: t("settings.emailNotif"),   sub: t("settings.emailNotifSub"),   val: emailNotif,   set: setEmailNotif,   id: "toggle-email-notifications" },
    { label: t("settings.weeklyReport"), sub: t("settings.weeklyReportSub"), val: weeklyReport, set: setWeeklyReport, id: "toggle-weekly-report"        },
    { label: t("settings.lowConf"),      sub: t("settings.lowConfSub"),      val: lowConf,      set: setLowConf,      id: "toggle-low-confidence"       },
  ];

  const usageItems = [
    { label: t("settings.conversationsUsed"), val: "0 / 200", pct: 0   },
    { label: t("settings.documentsUsage"),    val: "0 / 50",  pct: 0   },
    { label: t("settings.activeAgents"),      val: "1 / 1",   pct: 100 },
  ];

  const handleManageBilling = async () => {
    if (!user?.stripeCustomerId) {
      alert("No billing account found. Please subscribe first.");
      return;
    }
    setLoadingPortal(true);
    try {
      const res = await apiRequest("POST", "/api/stripe/portal");
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, "_blank");
      } else {
        const err = await res.json();
        alert(`Failed to open billing portal: ${err.error}`);
      }
    } catch (e) {
      console.error("Portal error", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingPortal(false);
    }
  };

  const planDisplay = {
    free: t("settings.freePlan"),
    growth: "Growth",
    pro: "Pro",
    business: "Business",
  };

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">⚙ {t("nav.settings")}</span>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {saved && <span className="save-toast">{t("settings.saved")}</span>}
          <button className="a-btn a-btn-primary" onClick={save} data-testid="button-save-settings">{t("settings.saveChanges")}</button>
        </div>
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">{t("settings.title")}</div>
            <div className="a-page-sub">{t("settings.subtitle")}</div>
          </div>
        </div>

        <div className="a-grid-2 a-anim" style={{ animationDelay: ".05s" }}>
          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#f59e0b" }}>⊕</span><span className="card-hd-title">{t("settings.businessProfile")}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
              <div><label className="a-label">{t("settings.businessName")}</label><input className="a-input" value={businessName} onChange={e => setBusinessName(e.target.value)} data-testid="input-business-name" /></div>
              <div><label className="a-label">{t("settings.contactEmail")}</label><input className="a-input" value={email} onChange={e => setEmail(e.target.value)} data-testid="input-contact-email" /></div>
              <div>
                <label className="a-label">{t("settings.timezone")}</label>
                <select className="a-select" value={timezone} onChange={e => setTimezone(e.target.value)} data-testid="select-timezone">
                  <option value="Europe/Dublin">Europe/Dublin</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                </select>
              </div>
              <div>
                <label className="a-label">{t("settings.language")}</label>
                <select className="a-select" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)} data-testid="select-language">
                  <option value="en">English</option>
                  <option value="lt">Lietuvių</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          <div className="a-card">
            <div className="card-hd"><span style={{ color: "#60a5fa" }}>◉</span><span className="card-hd-title">{t("settings.notifications")}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#c8a96e" }}>{n.label}</div>
                    <div style={{ fontSize: ".68rem", color: "#6b6355", marginTop: ".1rem" }}>{n.sub}</div>
                  </div>
                  <div className={`a-toggle ${n.val ? "on" : ""}`} onClick={() => n.set((v: boolean) => !v)} data-testid={n.id} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="a-card a-anim" style={{ animationDelay: ".1s" }}>
          <div className="card-hd"><span style={{ color: "#f472b6" }}>◈</span><span className="card-hd-title">{t("settings.billing")}</span></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".35rem" }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f5e6c8" }}>
                  {planDisplay[user?.plan as keyof typeof planDisplay] || t("settings.freePlan")}
                </span>
                {user?.plan !== "free" && (
                  <span style={{ fontSize: ".62rem", fontWeight: 700, background: "rgba(245,158,11,.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,.2)", padding: ".15rem .55rem", borderRadius: 100 }}>{t("settings.current")}</span>
                )}
              </div>
              <div style={{ fontSize: ".78rem", color: "#6b6355" }}>{t("settings.agentLimit")}</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="a-btn a-btn-primary" data-testid="button-upgrade-plan">{t("settings.upgradeBtn")}</button>
              {user?.stripeCustomerId && (
                <button className="a-btn" style={{ background: "rgba(245,158,11,.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,.2)", borderRadius: 10, padding: ".5rem 1rem", fontSize: ".82rem", cursor: "pointer" }} onClick={handleManageBilling} disabled={loadingPortal} data-testid="button-manage-billing">
                  {loadingPortal ? "Loading..." : "Manage Billing"}
                </button>
              )}
            </div>
          </div>
          <div style={{ marginTop: "1.2rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".7rem" }}>
            {usageItems.map((u, i) => (
              <div key={i} style={{ background: "#0f0d0a", borderRadius: 10, padding: ".8rem 1rem", border: "1px solid rgba(245,158,11,.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem" }}>
                  <span style={{ fontSize: ".72rem", color: "#6b6355" }}>{u.label}</span>
                  <span style={{ fontSize: ".72rem", color: "#c8a96e", fontWeight: 700 }}>{u.val}</span>
                </div>
                <div style={{ height: 4, background: "#1a1610", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${u.pct}%`, background: "linear-gradient(90deg,#f59e0b,#d97706)", borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="a-card a-anim" style={{ animationDelay: ".15s", borderColor: "rgba(248,113,113,.15)" }}>
          <div className="card-hd"><span style={{ color: "#f87171" }}>⚠</span><span className="card-hd-title">{t("settings.dangerZone")}</span></div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="a-btn" style={{ background: "rgba(248,113,113,.08)", color: "#f87171", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: ".5rem 1rem", fontSize: ".78rem" }} data-testid="button-delete-all-data">{t("settings.deleteConversations")}</button>
            <button className="a-btn" style={{ background: "rgba(248,113,113,.08)", color: "#f87171", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: ".5rem 1rem", fontSize: ".78rem" }} data-testid="button-delete-account">{t("settings.deleteAccount")}</button>
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
  .a-input,.a-select{width:100%;background:#0f0d0a;border:1px solid rgba(245,158,11,.1);border-radius:10px;color:#e8dece;font-family:'Syne',sans-serif;font-size:.82rem;padding:.6rem .9rem;outline:none;transition:border-color .2s;}
  .a-input:focus,.a-select:focus{border-color:rgba(245,158,11,.25);}
  .a-input::placeholder{color:#4a4035;}
  .a-select option{background:#141109;}
  .a-toggle{width:38px;height:21px;border-radius:100px;background:#1a1610;border:1px solid rgba(245,158,11,.12);position:relative;cursor:pointer;transition:all .2s;flex-shrink:0;}
  .a-toggle.on{background:rgba(245,158,11,.2);border-color:#f59e0b;}
  .a-toggle::after{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#6b6355;top:2px;left:2px;transition:all .2s;}
  .a-toggle.on::after{background:#f59e0b;left:19px;}
  .card-hd{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;}
  .card-hd-title{font-size:.88rem;font-weight:700;color:#c8a96e;}
  .save-toast{font-size:.75rem;font-weight:700;color:#34d399;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);padding:.3rem .8rem;border-radius:8px;animation:a-fadeUp .25s ease;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:900px){.a-grid-2{grid-template-columns:1fr;}}
`;
