import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

/* ─── Typewriter hook ─── */
function useTypewriter(text: string, speed = 38, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/* ─── Animated chat demo ─── */
const chatScripts = [
  {
    business: "☕ Brew & Co. Coffee",
    color: "#f59e0b",
    messages: [
      { from: "user", text: "Do you have oat milk lattes?" },
      { from: "bot",  text: "Absolutely! Our oat milk lattes are made with Oatly barista blend. We also offer almond and coconut milk. Want to see our full drinks menu?" },
      { from: "user", text: "What time do you open on Sundays?" },
      { from: "bot",  text: "We're open Sundays 8 AM – 4 PM. Come in early — our cinnamon rolls sell out by noon!" },
    ]
  },
  {
    business: "🔧 Fix-It Plumbing",
    color: "#34d399",
    messages: [
      { from: "user", text: "My kitchen sink is leaking, how soon can you come?" },
      { from: "bot",  text: "We have emergency slots available today! For a kitchen sink leak we typically arrive within 2 hours. Shall I book you in?" },
      { from: "user", text: "How much does it usually cost?" },
      { from: "bot",  text: "Most sink repairs run $80–$150. We give a fixed quote before starting — no surprises. I can send you our pricing guide if you like." },
    ]
  },
  {
    business: "🛍️ Nova Fashion Store",
    color: "#f472b6",
    messages: [
      { from: "user", text: "Is the white linen dress still available in size S?" },
      { from: "bot",  text: "Yes! The Santorini Linen Dress in size S is in stock. It ships in 1–2 business days with free returns. Want me to reserve one for you?" },
      { from: "user", text: "What's your return policy?" },
      { from: "bot",  text: "30-day hassle-free returns, no questions asked. Just use the prepaid label in your package. We process refunds within 48 hours." },
    ]
  },
];

interface ChatBubbleProps {
  msg: { from: string; text: string };
  accentColor: string;
  isLast: boolean;
  scriptIdx: number;
  idx: number;
}

function ChatBubble({ msg, accentColor, isLast, scriptIdx, idx }: ChatBubbleProps) {
  const { displayed, done } = useTypewriter(msg.text, 22, msg.from === "bot" ? 300 : 0);
  const isBot = msg.from === "bot";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignSelf: isBot ? "flex-start" : "flex-end",
      maxWidth: "82%", animation: "bubbleIn 0.3s ease both"
    }}>
      <div style={{
        padding: "0.6rem 0.9rem", borderRadius: isBot ? "14px 14px 14px 3px" : "14px 14px 3px 14px",
        background: isBot ? "#1a1610" : `${accentColor}22`,
        border: isBot ? "1px solid rgba(245,158,11,0.1)" : `1px solid ${accentColor}44`,
        fontSize: "0.78rem", lineHeight: 1.55,
        color: isBot ? "#c8a96e" : "#f5e6c8",
        fontFamily: "'Syne', sans-serif",
      }}>
        {isLast && isBot ? displayed : msg.text}
        {isLast && isBot && !done && (
          <span style={{ opacity: 0.5, animation: "blink 0.8s step-end infinite" }}>▍</span>
        )}
      </div>
    </div>
  );
}

function ChatDemo() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const script = chatScripts[scriptIdx];

  useEffect(() => {
    setVisibleCount(0);
    let count = 0;
    function showNext() {
      if (count >= script.messages.length) {
        setTimeout(() => setScriptIdx(i => (i + 1) % chatScripts.length), 2400);
        return;
      }
      const delay = count === 0 ? 600 : script.messages[count - 1].text.length * 28 + 900;
      setTimeout(() => {
        count++;
        setVisibleCount(count);
        showNext();
      }, delay);
    }
    showNext();
  }, [scriptIdx]);

  return (
    <div style={{
      background: "#0a0805", borderRadius: 20, overflow: "hidden",
      border: "1px solid rgba(245,158,11,0.15)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.05)",
      width: "100%", maxWidth: 380, fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{
        background: "#141109", padding: "0.9rem 1.1rem",
        borderBottom: "1px solid rgba(245,158,11,0.1)",
        display: "flex", alignItems: "center", gap: "0.7rem"
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `linear-gradient(135deg, ${script.color}, ${script.color}99)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", flexShrink: 0, transition: "background 0.5s"
        }}>✦</div>
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f5e6c8" }}>{script.business}</div>
          <div style={{ fontSize: "0.62rem", color: "#6b6355" }}>AI Customer Agent</div>
        </div>
        <div style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.35rem",
          fontSize: "0.62rem", color: "#34d399"
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
          Online
        </div>
      </div>

      <div style={{
        minHeight: 240, padding: "1rem", display: "flex",
        flexDirection: "column", gap: "0.65rem", background: "#0f0d0a",
      }}>
        {script.messages.slice(0, visibleCount).map((msg, i) => (
          <ChatBubble
            key={`${scriptIdx}-${i}`}
            msg={msg}
            accentColor={script.color}
            isLast={i === visibleCount - 1}
            scriptIdx={scriptIdx}
            idx={i}
          />
        ))}
      </div>

      <div style={{
        padding: "0.75rem 1rem", borderTop: "1px solid rgba(245,158,11,0.08)",
        display: "flex", gap: "0.5rem", background: "#0a0805"
      }}>
        <div style={{
          flex: 1, background: "#141109", border: "1px solid rgba(245,158,11,0.1)",
          borderRadius: 100, padding: "0.45rem 0.9rem",
          fontSize: "0.72rem", color: "#4a4035", fontFamily: "'Syne', sans-serif"
        }}>Ask anything…</div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.85rem", color: "#0a0805", cursor: "pointer", flexShrink: 0
        }}>↑</div>
      </div>
    </div>
  );
}

/* ─── Ticker ─── */
const tickerItems = [
  "☕ Brew & Co. — 98% CSAT",
  "🔧 FastFix Plumbing — 3× faster response",
  "🛍️ Nova Fashion — €12K saved monthly",
  "🍕 Tony's Pizzeria — 0 missed orders",
  "💆 Zen Spa — fully automated bookings",
  "🏋️ IronGym — 24/7 member support",
  "📦 ShipFast — returns handled automatically",
];

function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div style={{
      overflow: "hidden", borderTop: "1px solid rgba(245,158,11,0.08)",
      borderBottom: "1px solid rgba(245,158,11,0.08)",
      padding: "0.75rem 0", background: "#0a0805", position: "relative",
    }}>
      <div style={{
        display: "flex", gap: "3rem", whiteSpace: "nowrap",
        animation: "ticker 28s linear infinite",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: "0.78rem", fontWeight: 600, color: "#6b6355",
            fontFamily: "'Syne', sans-serif", flexShrink: 0,
          }}>
            {item} <span style={{ color: "#f59e0b", margin: "0 0.5rem" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Pricing card ─── */
interface PricingCardProps {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  color?: string;
  buttonLabel?: string;
  popularLabel?: string;
}

function PricingCard({ plan, price, desc, features, highlight, color, buttonLabel = "Get started →", popularLabel = "POPULAR" }: PricingCardProps) {
  return (
    <div
      style={{
        background: highlight ? "linear-gradient(160deg, #1e1810, #141109)" : "#141109",
        border: `1px solid ${highlight ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.08)"}`,
        borderRadius: 18, padding: "2rem 1.8rem",
        position: "relative", overflow: "hidden",
        boxShadow: highlight ? "0 16px 48px rgba(245,158,11,0.12)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        flex: 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 24px 64px rgba(245,158,11,0.18)"
          : "0 12px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 16px 48px rgba(245,158,11,0.12)"
          : "none";
      }}
    >
      {highlight && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#0a0805", fontSize: "0.6rem", fontWeight: 800,
          padding: "0.2rem 0.6rem", borderRadius: 100,
          letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif",
        }}>{popularLabel}</div>
      )}
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: color ?? "#6b6355", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: "'Syne', sans-serif" }}>{plan}</div>
      <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#f5e6c8", lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>
        {price}<span style={{ fontSize: "0.9rem", color: "#6b6355", fontWeight: 400 }}>/mo</span>
      </div>
      <div style={{ fontSize: "0.78rem", color: "#4a4035", margin: "0.6rem 0 1.4rem", fontFamily: "'Syne', sans-serif" }}>{desc}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.6rem" }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.78rem", color: "#a89880", fontFamily: "'Syne', sans-serif" }}>
            <span style={{ color: color ?? "#f59e0b", flexShrink: 0, marginTop: 1 }}>✦</span>{f}
          </div>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "0.7rem", borderRadius: 10, cursor: "pointer",
        background: highlight ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(245,158,11,0.08)",
        color: highlight ? "#0a0805" : "#c8a96e",
        fontWeight: 800, fontSize: "0.82rem",
        fontFamily: "'Syne', sans-serif",
        border: highlight ? "none" : "1px solid rgba(245,158,11,0.15)",
        transition: "all 0.2s",
      }}>{buttonLabel}</button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════ */
export default function LandingPage() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const el = document.querySelector(".landing-scroll");
    const handler = () => setScrolled((el?.scrollTop ?? 0) > 40);
    el?.addEventListener("scroll", handler);
    return () => el?.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="landing-root">

        {/* ── NAV ── */}
        <nav className={`lnav ${scrolled ? "scrolled" : ""}`}>
          <div className="lnav-inner">
            <div className="lnav-logo">
              <div className="logo-mark">✦</div>
              <span>Aura</span>
            </div>
            <div className="lnav-links">
              <a href="#features" className="lnav-link">{t("landing.nav.features")}</a>
              <a href="#how" className="lnav-link">{t("landing.nav.howItWorks")}</a>
              <a href="#pricing" className="lnav-link">{t("landing.nav.pricing")}</a>
            </div>
            <div className="lnav-actions">
              <button className="lnav-ghost" onClick={() => navigate("/login")}>{t("landing.nav.signIn")}</button>
              <button className="lnav-cta" onClick={() => navigate("/dashboard")}>{t("landing.nav.startFree")}</button>
            </div>
          </div>
        </nav>

        <div className="landing-scroll">

          {/* ── HERO ── */}
          <section className="hero-section">
            <div className="hero-mesh" />
            <div className="hero-mesh-2" />
            <div className="hero-inner">
              <div className="hero-left">
                <div className="hero-eyebrow">
                  <span>✦</span> {t("landing.hero.badge")}
                </div>
                <h1 className="hero-title">
                  {t("landing.hero.title")}<br />
                  <em>{t("landing.hero.titleEm")}</em>
                </h1>
                <p className="hero-sub">{t("landing.hero.sub")}</p>
                <div className="hero-actions">
                  <button className="hero-cta" onClick={() => navigate("/dashboard")}>{t("landing.hero.cta")}</button>
                  <button className="hero-ghost" onClick={() => navigate("/dashboard")}>{t("landing.hero.ghost")}</button>
                </div>
                <div className="hero-trust">
                  <div className="trust-avatars">
                    {["☕","🔧","🛍️","🍕","💆"].map((e, i) => (
                      <div key={i} className="trust-av" style={{ zIndex: 5 - i }}>{e}</div>
                    ))}
                  </div>
                  <span className="trust-text">{t("landing.hero.trust")}</span>
                </div>
              </div>

              <div className="hero-right">
                <ChatDemo />
                <div className="float-badge float-1">
                  <div style={{ fontSize: "1rem" }}>⚡</div>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f5e6c8" }}>{t("landing.hero.badge2Title")}</div>
                    <div style={{ fontSize: "0.62rem", color: "#6b6355" }}>{t("landing.hero.badge2Sub")}</div>
                  </div>
                </div>
                <div className="float-badge float-2">
                  <div style={{ fontSize: "1rem" }}>📈</div>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399" }}>{t("landing.hero.badge3Title")}</div>
                    <div style={{ fontSize: "0.62rem", color: "#6b6355" }}>{t("landing.hero.badge3Sub")}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── TICKER ── */}
          <Ticker />

          {/* ── FEATURES ── */}
          <section className="section" id="features">
            <div className="section-inner">
              <div className="section-label">{t("landing.features.eyebrow")}</div>
              <h2 className="section-title">{t("landing.features.title")}<br /><em>{t("landing.features.titleEm")}</em></h2>
              <p className="section-sub">{t("landing.features.sub")}</p>
              <div className="features-grid">
                {[
                  {
                    icon: "◈", color: "#f59e0b",
                    title: t("landing.features.f1Title"),
                    desc: t("landing.features.f1Desc"),
                    tags: [t("landing.features.f1t1"), t("landing.features.f1t2"), t("landing.features.f1t3")],
                  },
                  {
                    icon: "⊟", color: "#60a5fa",
                    title: t("landing.features.f2Title"),
                    desc: t("landing.features.f2Desc"),
                    tags: [t("landing.features.f2t1"), t("landing.features.f2t2"), t("landing.features.f2t3")],
                  },
                  {
                    icon: "⊕", color: "#f472b6",
                    title: t("landing.features.f3Title"),
                    desc: t("landing.features.f3Desc"),
                    tags: [t("landing.features.f3t1"), t("landing.features.f3t2"), t("landing.features.f3t3")],
                  },
                  {
                    icon: "◉", color: "#34d399",
                    title: t("landing.features.f4Title"),
                    desc: t("landing.features.f4Desc"),
                    tags: [t("landing.features.f4t1"), t("landing.features.f4t2"), t("landing.features.f4t3")],
                  },
                ].map((f, i) => (
                  <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="feat-icon" style={{ color: f.color, background: `${f.color}18` }}>{f.icon}</div>
                    <h3 className="feat-title">{f.title}</h3>
                    <p className="feat-desc">{f.desc}</p>
                    <div className="feat-tags">
                      {f.tags.map((t, j) => (
                        <span className="feat-tag" key={j} style={{ color: f.color, borderColor: `${f.color}33` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="section alt-bg" id="how">
            <div className="section-inner">
              <div className="section-label">{t("landing.how.eyebrow")}</div>
              <h2 className="section-title">{t("landing.how.title")}<br /><em>{t("landing.how.titleEm")}</em></h2>
              <div className="steps-row">
                {[
                  { n: "01", color: "#f59e0b", title: t("landing.how.s1Title"), desc: t("landing.how.s1Desc") },
                  { n: "02", color: "#60a5fa", title: t("landing.how.s2Title"), desc: t("landing.how.s2Desc") },
                  { n: "03", color: "#34d399", title: t("landing.how.s3Title"), desc: t("landing.how.s3Desc") },
                ].map((s, i) => (
                  <div className="step" key={i}>
                    <div className="step-n" style={{ color: s.color, borderColor: `${s.color}33` }}>{s.n}</div>
                    {i < 2 && <div className="step-connector" />}
                    <h3 className="step-title">{s.title}</h3>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section className="section" id="pricing">
            <div className="section-inner">
              <div className="section-label">{t("landing.pricing.eyebrow")}</div>
              <h2 className="section-title">{t("landing.pricing.title")}<br /><em>{t("landing.pricing.titleEm")}</em></h2>
              <p className="section-sub">{t("landing.pricing.sub")}</p>
              <div className="pricing-row">
                <PricingCard
                  plan={t("landing.pricing.plan1")} price={t("landing.pricing.price1")} color="#6b6355"
                  desc={t("landing.pricing.desc1")}
                  features={["1 AI agent","100 conversations/mo","Website widget only","Community support"]}
                  buttonLabel={t("landing.pricing.getStarted")}
                  popularLabel={t("landing.pricing.popular")}
                />
                <PricingCard
                  plan={t("landing.pricing.plan2")} price={t("landing.pricing.price2")} color="#f59e0b"
                  desc={t("landing.pricing.desc2")} highlight
                  features={["3 AI agents","2,000 conversations/mo","All channels (Web, FB, WhatsApp)","AI Insights dashboard","Priority support"]}
                  buttonLabel={t("landing.pricing.getStarted")}
                  popularLabel={t("landing.pricing.popular")}
                />
                <PricingCard
                  plan={t("landing.pricing.plan3")} price={t("landing.pricing.price3")} color="#60a5fa"
                  desc={t("landing.pricing.desc3")}
                  features={["Unlimited agents","Unlimited conversations","Custom integrations","White-label option","Dedicated onboarding"]}
                  buttonLabel={t("landing.pricing.getStarted")}
                  popularLabel={t("landing.pricing.popular")}
                />
              </div>
            </div>
          </section>

          {/* ── FOOTER CTA ── */}
          <section className="footer-cta">
            <div className="footer-mesh" />
            <div className="section-inner" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div className="section-label" style={{ justifyContent: "center" }}>{t("landing.footerCta.eyebrow")}</div>
              <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                {t("landing.footerCta.title")}<br /><em>{t("landing.footerCta.titleEm")}</em>
              </h2>
              <p className="section-sub" style={{ maxWidth: 480, margin: "0 auto 2.5rem" }}>
                {t("landing.footerCta.sub")}
              </p>
              <button className="hero-cta" style={{ margin: "0 auto" }} onClick={() => navigate("/dashboard")}>
                {t("landing.footerCta.btn")}
              </button>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="footer">
            <div className="lnav-logo" style={{ marginBottom: "0.3rem" }}>
              <div className="logo-mark">✦</div>
              <span>Aura</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#4a4035" }}>{t("landing.footer.copyright")}</div>
          </footer>

        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const css = `
  .landing-root {
    background: #0f0d0a;
    color: #e8dece;
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .landing-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    scroll-behavior: smooth;
  }
  .landing-scroll::-webkit-scrollbar { width: 4px; }
  .landing-scroll::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 4px; }

  /* NAV */
  .lnav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    transition: all 0.3s;
  }
  .lnav.scrolled {
    background: rgba(10,8,5,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(245,158,11,0.1);
  }
  .lnav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 1.2rem 2rem; gap: 2rem;
  }
  .lnav-logo {
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 1.15rem; font-weight: 800; color: #f5e6c8;
    letter-spacing: -0.02em; text-decoration: none;
    flex-shrink: 0;
  }
  .logo-mark {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; color: #0a0805; font-weight: 900;
  }
  .lnav-links { display: flex; gap: 2rem; margin-left: auto; }
  .lnav-link {
    font-size: 0.82rem; font-weight: 600; color: #6b6355;
    text-decoration: none; transition: color 0.2s;
  }
  .lnav-link:hover { color: #c8a96e; }
  .lnav-actions { display: flex; gap: 0.6rem; align-items: center; }
  .lnav-ghost {
    background: none; border: none; color: #6b6355;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    font-family: 'Syne', sans-serif; transition: color 0.2s; padding: 0.4rem 0.8rem;
  }
  .lnav-ghost:hover { color: #c8a96e; }
  .lnav-cta {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0a0805; border: none; border-radius: 9px;
    padding: 0.5rem 1.1rem; font-size: 0.8rem; font-weight: 800;
    cursor: pointer; font-family: 'Syne', sans-serif;
    transition: all 0.2s; box-shadow: 0 4px 16px rgba(245,158,11,0.25);
  }
  .lnav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.35); }

  /* HERO */
  .hero-section {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 8rem 2rem 5rem;
    position: relative; overflow: hidden;
  }
  .hero-mesh {
    position: absolute; top: -20%; left: -10%;
    width: 70%; height: 80%;
    background: radial-gradient(ellipse at center, rgba(245,158,11,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-mesh-2 {
    position: absolute; bottom: -10%; right: -5%;
    width: 50%; height: 60%;
    background: radial-gradient(ellipse at center, rgba(96,165,250,0.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-inner {
    max-width: 1200px; margin: 0 auto; width: 100%;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 5rem; align-items: center; position: relative; z-index: 1;
  }
  .hero-left { display: flex; flex-direction: column; gap: 0; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18);
    border-radius: 100px; padding: 0.3rem 0.85rem;
    font-size: 0.7rem; font-weight: 600; color: #b45309;
    letter-spacing: 0.05em; margin-bottom: 1.5rem;
    width: fit-content;
    animation: fadeUp 0.6s ease both;
  }
  .hero-title {
    font-family: 'Literata', serif;
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 500; line-height: 1.1;
    letter-spacing: -0.02em; color: #f5e6c8;
    margin-bottom: 1.4rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title em { font-style: italic; color: #f59e0b; }
  .hero-sub {
    font-size: 1rem; color: #6b6355; line-height: 1.75;
    max-width: 440px; margin-bottom: 2rem;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-actions {
    display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 2rem;
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .hero-cta {
    display: flex; align-items: center;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0a0805; border: none; border-radius: 12px;
    padding: 0.85rem 1.8rem; font-size: 0.92rem; font-weight: 800;
    cursor: pointer; font-family: 'Syne', sans-serif;
    box-shadow: 0 8px 28px rgba(245,158,11,0.3);
    transition: all 0.2s;
  }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(245,158,11,0.4); }
  .hero-ghost {
    background: rgba(245,158,11,0.06); color: #c8a96e;
    border: 1px solid rgba(245,158,11,0.15); border-radius: 12px;
    padding: 0.85rem 1.5rem; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s;
  }
  .hero-ghost:hover { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); }
  .hero-trust {
    display: flex; align-items: center; gap: 0.8rem;
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .trust-avatars { display: flex; }
  .trust-av {
    width: 28px; height: 28px; border-radius: 50%;
    background: #1a1610; border: 2px solid #0f0d0a;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; margin-left: -6px;
  }
  .trust-av:first-child { margin-left: 0; }
  .trust-text { font-size: 0.72rem; color: #4a4035; }
  .hero-right {
    position: relative;
    display: flex; justify-content: center;
    animation: fadeUp 0.7s 0.2s ease both;
  }
  .float-badge {
    position: absolute;
    display: flex; align-items: center; gap: 0.5rem;
    background: #141109; border: 1px solid rgba(245,158,11,0.15);
    border-radius: 12px; padding: 0.6rem 0.9rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .float-1 { top: -14px; right: -14px; animation: floatA 4s ease-in-out infinite; }
  .float-2 { bottom: 50px; left: -20px; animation: floatB 4.5s ease-in-out infinite; }

  /* TICKER */
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* SECTIONS */
  .section { padding: 6rem 2rem; }
  .alt-bg { background: #0a0805; }
  .section-inner { max-width: 1200px; margin: 0 auto; }
  .section-label {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; font-weight: 700; color: #f59e0b;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1rem;
  }
  .section-title {
    font-family: 'Literata', serif;
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 500; line-height: 1.15;
    color: #f5e6c8; letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }
  .section-title em { font-style: italic; color: #f59e0b; }
  .section-sub {
    font-size: 0.92rem; color: #6b6355; line-height: 1.7;
    max-width: 520px; margin-bottom: 3rem;
  }

  /* FEATURES */
  .features-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem;
  }
  .feature-card {
    background: #141109; border: 1px solid rgba(245,158,11,0.08);
    border-radius: 16px; padding: 1.8rem;
    transition: all 0.25s;
  }
  .feature-card:hover {
    border-color: rgba(245,158,11,0.2); transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  }
  .feat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 1rem;
  }
  .feat-title { font-size: 1rem; font-weight: 700; color: #f5e6c8; margin-bottom: 0.6rem; }
  .feat-desc { font-size: 0.82rem; color: #6b6355; line-height: 1.65; margin-bottom: 1rem; }
  .feat-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .feat-tag {
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.04em;
    padding: 0.2rem 0.6rem; border-radius: 100px;
    border: 1px solid; background: transparent;
  }

  /* STEPS */
  .steps-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
    position: relative;
  }
  .step { display: flex; flex-direction: column; align-items: flex-start; position: relative; }
  .step-n {
    font-size: 2.2rem; font-weight: 800; border: 1px solid;
    border-radius: 14px; width: 60px; height: 60px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.2rem; font-family: 'Literata', serif;
    background: #141109;
  }
  .step-connector {
    position: absolute; top: 30px; left: calc(100% + 1rem);
    width: calc(100% - 2rem);
    border-top: 1px dashed rgba(245,158,11,0.2);
  }
  .step-title { font-size: 1rem; font-weight: 700; color: #f5e6c8; margin-bottom: 0.6rem; }
  .step-desc { font-size: 0.82rem; color: #6b6355; line-height: 1.65; }

  /* PRICING */
  .pricing-row { display: flex; gap: 1.2rem; align-items: stretch; flex-wrap: wrap; }

  /* FOOTER CTA */
  .footer-cta {
    padding: 6rem 2rem; position: relative; overflow: hidden;
    border-top: 1px solid rgba(245,158,11,0.08);
  }
  .footer-mesh {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* FOOTER */
  .footer {
    padding: 2rem; border-top: 1px solid rgba(245,158,11,0.08);
    display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
    background: #0a0805;
  }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hero-right { order: -1; }
    .features-grid { grid-template-columns: 1fr; }
    .steps-row { grid-template-columns: 1fr; }
    .step-connector { display: none; }
    .pricing-row { flex-direction: column; }
    .lnav-links { display: none; }
  }
`;
