import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import i18n from "@/lib/i18n";
import { useUser } from "@/hooks/useUser";
import { ThemeToggle } from "@/components/ThemeToggle";

const LANG_OPTIONS = [
  { code: "en", label: "EN", full: "English" },
  { code: "lt", label: "LT", full: "Lietuvių" },
  { code: "es", label: "ES", full: "Español" },
];

interface StripePlan {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, string>;
  prices: { id: string; unit_amount: number; currency: string; interval: string | null }[];
}

export function AppSidebar() { return <AppSidebarInner />; }

export default function AppSidebarInner() {
  const [location, navigate]           = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen]         = useState(false);
  const [bizMenuOpen, setBizMenuOpen]   = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<"growth" | "pro" | null>(null);
  const { t } = useTranslation();
  const { user, updatePlan, signOut }   = useUser();
  const currentLang = LANG_OPTIONS.find(l => l.code === i18n.language) ?? LANG_OPTIONS[0];

  const bizRef  = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  /* close menus on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bizRef.current  && !bizRef.current.contains(e.target as Node))  setBizMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* handle ?upgraded=plan query param after Stripe success */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgraded = params.get("upgraded");
    if (upgraded === "growth" || upgraded === "pro") {
      updatePlan(upgraded as "growth" | "pro");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  /* Fetch Stripe plans from backend */
  const { data: stripePlans } = useQuery<{ data: StripePlan[] }>({
    queryKey: ["/api/stripe/plans"],
    staleTime: 5 * 60 * 1000,
  });

  /* Checkout mutation */
  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, planKey }: { priceId: string; planKey: string }) => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planKey, customerEmail: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      return data as { url: string };
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const NAV = [
    { label: t("nav.dashboard"),     icon: "▦",  path: "/dashboard" },
    { label: t("nav.documents"),     icon: "⊟",  path: "/documents" },
    { label: t("nav.agents"),        icon: "◈",  path: "/agent" },
    { label: t("nav.playground"),    icon: "◻",  path: "/playground" },
    { label: t("nav.conversations"), icon: "◇",  path: "/conversations" },
    { label: t("nav.insights"),      icon: "◉",  path: "/insights" },
    { label: t("nav.revenue"),       icon: "◎",  path: "/revenue" },
    { label: t("nav.integrations"),  icon: "⊕",  path: "/integrations" },
    { label: t("nav.deploy"),        icon: "⊗",  path: "/deploy" },
  ];

  const PLANS = [
    { key: "free",   label: t("sidebar.freePlan"),   desc: t("sidebar.planFreeDesc"),    price: null,  stripePlanName: null },
    { key: "growth", label: t("sidebar.growthPlan"), desc: t("sidebar.planGrowthDesc"),  price: "$29", stripePlanName: "Aura Growth Plan" },
    { key: "pro",    label: t("sidebar.proPlan"),    desc: t("sidebar.planProDesc"),     price: "$79", stripePlanName: "Aura Pro Plan" },
  ] as const;

  const currentPlan = user?.plan ?? "free";
  const planLabel   = PLANS.find(p => p.key === currentPlan)?.label ?? t("sidebar.freePlan");
  const bizName     = user?.businessName ?? "Main Store";
  const bizInitial  = user?.bizInitial   ?? "M";
  const userName    = user?.name         ?? "John Doe";
  const userEmail   = user?.email        ?? "john@mainstore.com";
  const userInit    = user?.initials     ?? "JD";

  function handlePlanClick(planKey: "free" | "growth" | "pro") {
    if (planKey === "free") {
      updatePlan("free");
      setBizMenuOpen(false);
      return;
    }
    setBizMenuOpen(false);
    setUpgradeModal(planKey);
  }

  function handleUpgrade(planKey: "growth" | "pro") {
    if (!stripePlans?.data) return;
    const planName = planKey === "growth" ? "Aura Growth Plan" : "Aura Pro Plan";
    const product  = stripePlans.data.find(p => p.name === planName);
    if (!product) return;
    const monthlyPrice = product.prices.find(pr => pr.interval === "month");
    if (!monthlyPrice) return;
    checkoutMutation.mutate({ priceId: monthlyPrice.id, planKey });
  }

  const modalPlan = upgradeModal ? PLANS.find(p => p.key === upgradeModal) : null;

  return (
    <>
      <style>{css}</style>

      {/* ── Upgrade modal ── */}
      {upgradeModal && modalPlan && (
        <div className="sb-modal-overlay" onClick={() => setUpgradeModal(null)}>
          <div className="sb-modal" onClick={e => e.stopPropagation()}>
            <button className="sb-modal-close" onClick={() => setUpgradeModal(null)}>✕</button>
            <div className="sb-modal-badge">{upgradeModal === "growth" ? "⚡" : "✦"}</div>
            <h2 className="sb-modal-title">{modalPlan.label}</h2>
            <p className="sb-modal-price">
              {upgradeModal === "growth" ? "$29" : "$79"}
              <span className="sb-modal-interval">/month</span>
            </p>
            <p className="sb-modal-desc">{modalPlan.desc}</p>

            <ul className="sb-modal-features">
              {upgradeModal === "growth" ? (
                <>
                  <li>✓ Unlimited AI conversations</li>
                  <li>✓ All deployment channels</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Priority email support</li>
                </>
              ) : (
                <>
                  <li>✓ Everything in Growth</li>
                  <li>✓ Custom AI personality</li>
                  <li>✓ White-label widget</li>
                  <li>✓ Priority phone support</li>
                  <li>✓ Revenue intelligence</li>
                </>
              )}
            </ul>

            <button
              className="sb-modal-btn"
              onClick={() => handleUpgrade(upgradeModal)}
              disabled={checkoutMutation.isPending || !stripePlans?.data}
              data-testid={`button-upgrade-${upgradeModal}`}
            >
              {checkoutMutation.isPending
                ? "Redirecting…"
                : !stripePlans?.data
                ? "Loading…"
                : `Upgrade to ${modalPlan.label}`}
            </button>
            <p className="sb-modal-note">Secure payment via Stripe · Cancel anytime</p>
          </div>
        </div>
      )}

      <aside className="sidebar">
        {/* Logo */}
        <div className="sb-logo" onClick={() => navigate("/")}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}>
            <defs>
              <linearGradient id="sb-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#sb-logo-grad)"/>
            <circle cx="12" cy="14" r="2" fill="white"/>
            <circle cx="20" cy="14" r="2" fill="white"/>
            <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="16" cy="7" r="1" fill="white"/>
            <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="sb-logo-text">Aura</span>
        </div>

        {/* Business / Plan selector */}
        <div className="sb-biz-wrap" ref={bizRef}>
          <button
            className="sb-biz"
            onClick={() => { setBizMenuOpen(o => !o); setUserMenuOpen(false); setLangOpen(false); }}
            data-testid="button-biz-menu"
          >
            <div className="sb-biz-av">{bizInitial}</div>
            <div className="sb-biz-info">
              <div className="sb-biz-name">{bizName}</div>
              <div className="sb-biz-plan">{planLabel}</div>
            </div>
            <div className="sb-biz-chevron" style={{ transform: bizMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</div>
          </button>

          {bizMenuOpen && (
            <div className="sb-biz-menu">
              <div className="sb-biz-menu-lbl">{t("sidebar.currentPlan")}</div>
              {PLANS.map(plan => (
                <button
                  key={plan.key}
                  className={`sb-plan-item ${currentPlan === plan.key ? "active" : ""}`}
                  onClick={() => handlePlanClick(plan.key)}
                  data-testid={`plan-option-${plan.key}`}
                >
                  <div>
                    <div className="sb-plan-name">
                      {plan.label}
                      {plan.price && <span className="sb-plan-price">{plan.price}/mo</span>}
                    </div>
                    <div className="sb-plan-desc">{plan.desc}</div>
                  </div>
                  {currentPlan === plan.key && <span className="sb-plan-check">✓</span>}
                  {currentPlan !== plan.key && plan.key !== "free" && (
                    <span className="sb-plan-badge">{t("sidebar.upgrade")}</span>
                  )}
                </button>
              ))}
              <div className="sb-biz-divider" />
              <button
                className="sb-plan-add"
                onClick={() => { setBizMenuOpen(false); navigate("/register"); }}
                data-testid="button-add-business"
              >
                <span className="sb-plan-add-icon">+</span>
                {t("sidebar.addBusiness")}
              </button>
            </div>
          )}
        </div>

        <div className="sb-sec-lbl">{t("sidebar.mainSection")}</div>
        <nav className="sb-nav">
          {NAV.map(item => {
            const active = location === item.path || location.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                className={`sb-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                data-testid={`link-nav-${item.path.replace("/", "")}`}
              >
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
                {active && <span className="sb-pip" />}
              </button>
            );
          })}
        </nav>

        <div className="sb-sec-lbl" style={{ marginTop: "auto", paddingTop: "1rem" }}>{t("sidebar.settingsSection")}</div>
        <button
          className={`sb-item ${location === "/settings" ? "active" : ""}`}
          onClick={() => navigate("/settings")}
          data-testid="link-nav-settings"
        >
          <span className="sb-icon">⚙</span>
          <span className="sb-label">{t("nav.settings")}</span>
          {location === "/settings" && <span className="sb-pip" />}
        </button>
        <button
          className={`sb-item ${location === "/help" ? "active" : ""}`}
          onClick={() => navigate("/help")}
          data-testid="link-nav-help"
        >
          <span className="sb-icon">?</span>
          <span className="sb-label">{t("nav.help")}</span>
          {location === "/help" && <span className="sb-pip" />}
        </button>

        {/* Language selector */}
        <div className="sb-lang-row" ref={langRef}>
          <button className="sb-lang-btn" onClick={() => { setLangOpen(o => !o); setUserMenuOpen(false); setBizMenuOpen(false); }} data-testid="button-language-switcher">
            <span className="sb-lang-globe">🌐</span>
            <span className="sb-lang-label">{currentLang.full}</span>
            <span style={{ marginLeft: "auto", color: "#4a4035", fontSize: "0.7rem", transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
          </button>
          {langOpen && (
            <div className="sb-lang-menu">
              {LANG_OPTIONS.map(l => (
                <button
                  key={l.code}
                  className={`sb-lang-option ${i18n.language === l.code ? "active" : ""}`}
                  onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                  data-testid={`language-option-${l.code}`}
                >
                  <span className="sb-lang-code">{l.label}</span>
                  <span className="sb-lang-full">{l.full}</span>
                  {i18n.language === l.code && <span style={{ marginLeft: "auto", color: "#f59e0b" }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="sb-theme-row" style={{ padding: "0.3rem 0.5rem 0" }}>
          <div className="sb-lang-btn" style={{ justifyContent: "center" }}>
            <ThemeToggle />
          </div>
        </div>

        {/* User profile */}
        <div className="sb-user-wrap" ref={userRef}>
          <div
            className="sb-user"
            onClick={() => { setUserMenuOpen(o => !o); setBizMenuOpen(false); setLangOpen(false); }}
            data-testid="button-user-menu"
          >
            <div className="sb-user-av">{userInit}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{userName}</div>
              <div className="sb-user-email">{userEmail}</div>
            </div>
            <div className="sb-user-chevron" style={{ transform: userMenuOpen ? "rotate(180deg)" : "none" }}>⌄</div>
          </div>

          {userMenuOpen && (
            <div className="sb-user-menu">
              <button className="sb-user-item" onClick={() => { navigate("/settings"); setUserMenuOpen(false); }}>⚙ {t("sidebar.accountSettings")}</button>
              <button className="sb-user-item" onClick={() => { setUserMenuOpen(false); setUpgradeModal(currentPlan === "free" ? "growth" : "pro"); }}>◎ {t("sidebar.billing")}</button>
              <div style={{ height: 1, background: "rgba(245,158,11,0.08)", margin: "0.3rem 0" }} />
              <button
                className="sb-user-item"
                style={{ color: "#f87171" }}
                onClick={async () => { await signOut(); setUserMenuOpen(false); navigate("/login"); }}
                data-testid="button-sign-out"
              >
                → {t("sidebar.signOut")}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

const css = `
  /* ── Modal ── */
  .sb-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center;
    animation: sbFade 0.2s ease both;
    backdrop-filter: blur(8px);
  }
  .sb-modal {
    background: #1f2937; border: 1px solid #374151;
    border-radius: 24px; padding: 2.5rem 2.5rem;
    max-width: 420px; width: calc(100% - 2rem);
    position: relative;
    animation: sbSlideUp 0.3s ease both;
    box-shadow: 0 25px 80px rgba(0,0,0,0.8);
    font-family: 'Inter', sans-serif;
  }
  .sb-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem;
    background: none; border: none; color: #9ca3af;
    font-size: 1.125rem; cursor: pointer; padding: 0.25rem 0.5rem;
    border-radius: 6px; transition: all 0.2s;
  }
  .sb-modal-close:hover { color: #f3f4f6; background: #374151; }
  .sb-modal-badge {
    width: 56px; height: 56px; border-radius: 14px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.75rem; margin-bottom: 1.25rem;
  }
  .sb-modal-title { font-size: 1.5rem; font-weight: 800; color: #f3f4f6; margin: 0 0 0.5rem; }
  .sb-modal-price { font-size: 2.5rem; font-weight: 800; color: #10b981; margin: 0 0 0.5rem; }
  .sb-modal-interval { font-size: 1rem; font-weight: 400; color: #9ca3af; }
  .sb-modal-desc { font-size: 0.9375rem; color: #9ca3af; margin: 0 0 1.5rem; line-height: 1.6; }
  .sb-modal-features { list-style: none; margin: 0 0 1.75rem; padding: 0; display: flex; flex-direction: column; gap: 0.625rem; }
  .sb-modal-features li { font-size: 0.9375rem; color: #d1d5db; }
  .sb-modal-btn {
    width: 100%; padding: 1rem;
    background: linear-gradient(135deg,#10b981,#059669);
    border: none; border-radius: 12px;
    font-family: 'Inter',sans-serif; font-size: 1rem; font-weight: 700;
    color: #ffffff; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }
  .sb-modal-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4); }
  .sb-modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .sb-modal-note { text-align: center; font-size: 0.8125rem; color: #6b7280; margin: 0.75rem 0 0; }
  @keyframes sbFade    { from{opacity:0} to{opacity:1} }
  @keyframes sbSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

  .sidebar {
    width: 240px; flex-shrink: 0;
    background: #111827;
    border-right: 1px solid #1f2937;
    display: flex; flex-direction: column;
    padding: 0 0 0.5rem; overflow-y: auto;
    position: relative; height: 100vh;
    font-family: 'Inter', sans-serif;
  }
  .sidebar::-webkit-scrollbar { width: 6px; }
  .sidebar::-webkit-scrollbar-track { background: #111827; }
  .sidebar::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }

  .sb-logo {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1.5rem 1.25rem 1.25rem; cursor: pointer;
    transition: opacity 0.2s;
  }
  .sb-logo:hover { opacity: 0.8; }
  .sb-logo-text { font-size: 1.25rem; font-weight: 800; color: #f3f4f6; letter-spacing: -0.025em; }

  .sb-biz-wrap { margin: 0 1rem 1.25rem; position: relative; }
  .sb-biz {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    display: flex; align-items: center; gap: 0.75rem;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .sb-biz:hover { background: #374151; border-color: #4b5563; }
  .sb-biz-av {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg,#10b981,#059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem; font-weight: 800; color: #ffffff; flex-shrink: 0;
  }
  .sb-biz-name { font-size: 0.875rem; font-weight: 700; color: #f3f4f6; text-align: left; }
  .sb-biz-plan { font-size: 0.75rem; color: #9ca3af; text-align: left; }
  .sb-biz-chevron { margin-left: auto; color: #9ca3af; font-size: 0.875rem; flex-shrink: 0; transition: transform 0.2s; }

  .sb-biz-menu {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 200;
    background: #1f2937; border: 1px solid #374151;
    border-radius: 14px; overflow: hidden;
    animation: a-fadeUp 0.15s ease both;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }
  .sb-biz-menu-lbl {
    padding: 0.75rem 1rem 0.5rem;
    font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em;
    color: #6b7280; text-transform: uppercase;
  }
  .sb-plan-item {
    display: flex; align-items: center; gap: 0.625rem;
    width: 100%; padding: 0.75rem 1rem;
    background: none; border: none;
    font-family: 'Inter',sans-serif; cursor: pointer;
    text-align: left; transition: background 0.2s;
  }
  .sb-plan-item:hover { background: rgba(16, 185, 129, 0.05); }
  .sb-plan-item.active { background: rgba(16, 185, 129, 0.1); }
  .sb-plan-name { font-size: 0.9375rem; font-weight: 700; color: #f3f4f6; display: flex; align-items: center; gap: 0.5rem; }
  .sb-plan-price { font-size: 0.75rem; font-weight: 600; color: #10b981; }
  .sb-plan-desc { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }
  .sb-plan-check { margin-left: auto; color: #10b981; font-size: 1rem; flex-shrink: 0; }
  .sb-plan-badge {
    margin-left: auto; font-size: 0.6875rem; font-weight: 800;
    padding: 0.25rem 0.5rem; border-radius: 100px; flex-shrink: 0;
    background: rgba(16, 185, 129, 0.1); color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .sb-biz-divider { height: 1px; background: #374151; margin: 0.5rem 0; }
  .sb-plan-add {
    display: flex; align-items: center; gap: 0.75rem;
    width: 100%; padding: 0.75rem 1rem;
    background: none; border: none;
    font-family: 'Inter',sans-serif; font-size: 0.9375rem; font-weight: 700;
    color: #10b981; cursor: pointer; text-align: left;
    transition: background 0.2s;
  }
  .sb-plan-add:hover { background: rgba(16, 185, 129, 0.05); }
  .sb-plan-add-icon {
    width: 20px; height: 20px; border-radius: 6px;
    background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: #10b981; flex-shrink: 0;
  }

  .sb-sec-lbl {
    padding: 0 1.25rem 0.5rem;
    font-size: 0.6875rem; letter-spacing: 0.08em;
    color: #6b7280; font-weight: 700; font-family: 'Inter',sans-serif;
    text-transform: uppercase;
  }
  .sb-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.75rem; }
  .sb-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.75rem 1rem; border-radius: 10px;
    border: none; background: none;
    color: #9ca3af; font-family: 'Inter',sans-serif;
    font-size: 0.9375rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    text-align: left; width: 100%; position: relative;
  }
  .sb-item:hover { background: #1f2937; color: #d1d5db; }
  .sb-item.active { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
  .sb-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
  .sb-label { flex: 1; }
  .sb-pip {
    position: absolute; right: 0.75rem;
    width: 6px; height: 6px; border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  .sb-lang-row { padding: 0.3rem 0.5rem 0; position: relative; }
  .sb-lang-btn {
    display: flex; align-items: center; gap: 0.55rem;
    width: 100%; padding: 0.45rem 0.75rem; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    font-family: 'Syne',sans-serif; transition: background 0.15s;
  }
  .sb-lang-btn:hover { background: rgba(245,158,11,0.06); }
  .sb-lang-globe { font-size: 0.85rem; flex-shrink: 0; }
  .sb-lang-label { font-size: 0.78rem; font-weight: 600; color: #6b6355; flex: 1; }
  .sb-lang-menu {
    position: absolute; bottom: calc(100% + 4px); left: 0.5rem; right: -0.5rem;
    background: #141109; border: 1px solid rgba(245,158,11,0.15);
    border-radius: 10px; overflow: hidden;
    animation: a-fadeUp 0.15s ease both;
    z-index: 200;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .sb-lang-option {
    display: flex; align-items: center; gap: 0.6rem;
    width: 100%; padding: 0.55rem 0.85rem;
    background: none; border: none;
    font-family: 'Syne',sans-serif; font-size: 0.77rem;
    color: #c8a96e; cursor: pointer; transition: background 0.15s;
    text-align: left;
  }
  .sb-lang-option:hover { background: rgba(245,158,11,0.08); }
  .sb-lang-option.active { color: #f59e0b; }
  .sb-lang-code { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; color: #6b6355; min-width: 20px; }
  .sb-lang-full { flex: 1; }

  .sb-user-wrap { position: relative; }
  .sb-user {
    display: flex; align-items: center; gap: 0.55rem;
    padding: 0.75rem 1rem 0.5rem;
    margin-top: 0.2rem;
    border-top: 1px solid rgba(245,158,11,0.08);
    cursor: pointer; transition: background 0.15s;
  }
  .sb-user:hover { background: rgba(245,158,11,0.04); }
  .sb-user-av {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg,#f59e0b,#b45309);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.62rem; font-weight: 800; color: #0a0805; flex-shrink: 0;
  }
  .sb-user-name  { font-size: 0.73rem; font-weight: 700; color: #c8a96e; }
  .sb-user-email { font-size: 0.6rem; color: #4a4035; }
  .sb-user-chevron { margin-left: auto; color: #6b6355; font-size: 0.75rem; transition: transform 0.2s; }

  .sb-user-menu {
    position: absolute; bottom: calc(100% + 4px); left: 0.5rem; right: 0.5rem; z-index: 200;
    background: #141109; border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px; overflow: hidden;
    animation: a-fadeUp 0.15s ease both;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .sb-user-item {
    display: block; width: 100%;
    padding: 0.55rem 0.85rem;
    background: none; border: none;
    font-family: 'Syne',sans-serif; font-size: 0.77rem; font-weight: 600;
    color: #c8a96e; text-align: left; cursor: pointer;
    transition: background 0.15s;
  }
  .sb-user-item:hover { background: rgba(245,158,11,0.07); }

  @keyframes a-fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
`;
