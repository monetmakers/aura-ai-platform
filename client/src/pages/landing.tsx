import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

/* Typewriter Animation Hook */
function useTypewriter(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);
  
  return { displayed, done };
}

/* Chat Demo Scenarios */
const chatScripts = [
  {
    business: "☕ Brew & Co. Coffee",
    color: "#10b981",
    messages: [
      { from: "user", text: "Do you have oat milk lattes?" },
      { from: "bot", text: "Absolutely! Our oat milk lattes are made with Oatly barista blend. We also offer almond and coconut milk. Want to see our full drinks menu?" },
      { from: "user", text: "What time do you open on Sundays?" },
      { from: "bot", text: "We're open Sundays 8 AM - 4 PM. Come in early - our cinnamon rolls sell out by noon!" },
    ]
  },
  {
    business: "🔧 Fix-It Plumbing",
    color: "#3b82f6",
    messages: [
      { from: "user", text: "My kitchen sink is leaking, how soon can you come?" },
      { from: "bot", text: "We have emergency slots available today! For a kitchen sink leak we typically arrive within 2 hours. Shall I book you in?" },
      { from: "user", text: "How much does it usually cost?" },
      { from: "bot", text: "Most sink repairs run $80-$150. We give a fixed quote before starting - no surprises. I can send you our pricing guide if you like." },
    ]
  },
  {
    business: "👗 Nova Fashion Store",
    color: "#ec4899",
    messages: [
      { from: "user", text: "Is the white linen dress still available in size S?" },
      { from: "bot", text: "Yes! The Santorini Linen Dress in size S is in stock. It ships in 1-2 business days with free returns. Want me to reserve one for you?" },
      { from: "user", text: "What's your return policy?" },
      { from: "bot", text: "30-day hassle-free returns, no questions asked. Just use the prepaid label in your package. We process refunds within 48 hours." },
    ]
  },
];

interface ChatBubbleProps {
  msg: { from: string; text: string };
  accentColor: string;
  isLast: boolean;
}

function ChatBubble({ msg, accentColor, isLast }: ChatBubbleProps) {
  const { displayed, done } = useTypewriter(msg.text, 25, msg.from === "bot" ? 300 : 0);
  const isBot = msg.from === "bot";
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignSelf: isBot ? "flex-start" : "flex-end",
      maxWidth: "85%",
      animation: "bubbleIn 0.3s ease both"
    }}>
      <div style={{
        padding: "0.75rem 1rem",
        borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
        background: isBot ? "#1f2937" : `${accentColor}15`,
        border: isBot ? "1px solid #374151" : `1px solid ${accentColor}40`,
        fontSize: "0.875rem",
        lineHeight: 1.6,
        color: isBot ? "#e5e7eb" : "#f3f4f6",
        fontFamily: "'Inter', sans-serif",
      }}>
        {isLast && isBot ? displayed : msg.text}
        {isLast && isBot && !done && (
          <span style={{ opacity: 0.6, animation: "blink 0.9s step-end infinite" }}>▋</span>
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
        setTimeout(() => setScriptIdx(i => (i + 1) % chatScripts.length), 2500);
        return;
      }
      const delay = count === 0 ? 700 : script.messages[count - 1].text.length * 30 + 1000;
      setTimeout(() => {
        count++;
        setVisibleCount(count);
        showNext();
      }, delay);
    }
    showNext();
  }, [scriptIdx, script.messages]);

  return (
    <div style={{
      background: "#111827",
      borderRadius: 24,
      overflow: "hidden",
      border: "1px solid #374151",
      boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
      width: "100%",
      maxWidth: 420,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#1f2937",
        padding: "1rem 1.25rem",
        borderBottom: "1px solid #374151",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${script.color}, ${script.color}cc)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          flexShrink: 0,
          transition: "background 0.5s"
        }}>✨</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f3f4f6" }}>{script.business}</div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>AI Customer Agent</div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
          color: "#10b981"
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981"
          }} />
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{
        minHeight: 260,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: "#0f172a",
      }}>
        {script.messages.slice(0, visibleCount).map((msg, i) => (
          <ChatBubble
            key={`${scriptIdx}-${i}`}
            msg={msg}
            accentColor={script.color}
            isLast={i === visibleCount - 1}
          />
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: "0.875rem 1rem",
        borderTop: "1px solid #374151",
        display: "flex",
        gap: "0.625rem",
        background: "#111827"
      }}>
        <div style={{
          flex: 1,
          background: "#1f2937",
          border: "1px solid #374151",
          borderRadius: 100,
          padding: "0.5rem 1rem",
          fontSize: "0.8125rem",
          color: "#6b7280",
          fontFamily: "'Inter', sans-serif"
        }}>Ask anything...</div>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${script.color}, ${script.color}dd)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.95rem",
          color: "#ffffff",
          cursor: "pointer",
          flexShrink: 0,
          transition: "transform 0.2s"
        }}>➤</div>
      </div>
    </div>
  );
}

/* Social Proof Ticker */
const tickerItems = [
  "☕ Brew & Co. - 98% CSAT",
  "🔧 FastFix Plumbing - 3x faster response",
  "👗 Nova Fashion - €12K saved monthly",
  "🍕 Tony's Pizzeria - 0 missed orders",
  "💆 Zen Spa - fully automated bookings",
  "💪 IronGym - 24/7 member support",
  "📦 ShipFast - returns handled automatically",
];

function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  
  return (
    <div style={{
      overflow: "hidden",
      borderTop: "1px solid #1f2937",
      borderBottom: "1px solid #1f2937",
      padding: "0.875rem 0",
      background: "#0f172a",
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        gap: "3rem",
        whiteSpace: "nowrap",
        animation: "ticker 30s linear infinite",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#6b7280",
            fontFamily: "'Inter', sans-serif",
            flexShrink: 0,
          }}>
            {item} <span style={{ color: "#10b981", margin: "0 0.5rem" }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Pricing Card */
interface PricingCardProps {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  color?: string;
}

function PricingCard({ plan, price, desc, features, highlight, color = "#6b7280" }: PricingCardProps) {
  return (
    <div
      style={{
        background: highlight ? "linear-gradient(160deg, #1f2937, #111827)" : "#111827",
        border: `1px solid ${highlight ? "#10b981" : "#374151"}`,
        borderRadius: 20,
        padding: "2rem 1.75rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: highlight ? "0 20px 50px rgba(16,185,129,0.15)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        flex: 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 25px 60px rgba(16,185,129,0.2)"
          : "0 12px 40px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 20px 50px rgba(16,185,129,0.15)"
          : "none";
      }}
    >
      {highlight && (
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#ffffff",
          fontSize: "0.6875rem",
          fontWeight: 800,
          padding: "0.25rem 0.75rem",
          borderRadius: 100,
          letterSpacing: "0.05em",
          fontFamily: "'Inter', sans-serif",
        }}>POPULAR</div>
      )}
      <div style={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color: color,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "0.625rem",
        fontFamily: "'Inter', sans-serif"
      }}>{plan}</div>
      <div style={{
        fontSize: "2.75rem",
        fontWeight: 800,
        color: "#f3f4f6",
        lineHeight: 1,
        fontFamily: "'Inter', sans-serif"
      }}>
        {price}<span style={{ fontSize: "1rem", color: "#9ca3af", fontWeight: 400 }}>/mo</span>
      </div>
      <div style={{
        fontSize: "0.875rem",
        color: "#6b7280",
        margin: "0.75rem 0 1.5rem",
        fontFamily: "'Inter', sans-serif"
      }}>{desc}</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        marginBottom: "1.75rem"
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            fontSize: "0.875rem",
            color: "#d1d5db",
            fontFamily: "'Inter', sans-serif"
          }}>
            <span style={{ color: highlight ? "#10b981" : "#3b82f6", flexShrink: 0, marginTop: 2 }}>✓</span>{f}
          </div>
        ))}
      </div>
      <button style={{
        width: "100%",
        padding: "0.875rem",
        borderRadius: 12,
        cursor: "pointer",
        background: highlight ? "linear-gradient(135deg, #10b981, #059669)" : "#1f2937",
        color: highlight ? "#ffffff" : "#d1d5db",
        fontWeight: 700,
        fontSize: "0.9375rem",
        fontFamily: "'Inter', sans-serif",
        border: highlight ? "none" : "1px solid #374151",
        transition: "all 0.2s",
      }}>Get Started</button>
    </div>
  );
}

/* Main Landing Page */
export default function LandingPage() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const el = document.querySelector(".landing-scroll");
    const handler = () => setScrolled((el?.scrollTop ?? 0) > 50);
    el?.addEventListener("scroll", handler);
    return () => el?.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="landing-root">
        {/* Navigation */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <div className="nav-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#logo-grad)"/>
                  <circle cx="12" cy="14" r="2" fill="white"/>
                  <circle cx="20" cy="14" r="2" fill="white"/>
                  <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <circle cx="16" cy="7" r="1" fill="white"/>
                  <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span>Aura</span>
            </div>
            <div className="nav-links">
              <a href="#features" className="nav-link">{t("landing.nav.features")}</a>
              <a href="#how" className="nav-link">{t("landing.nav.howItWorks")}</a>
              <a href="#pricing" className="nav-link">{t("landing.nav.pricing")}</a>
            </div>
            <div className="nav-actions">
              <button className="nav-ghost" onClick={() => navigate("/login")}>{t("landing.nav.signIn")}</button>
              <button className="nav-cta" onClick={() => navigate("/dashboard")}>{t("landing.nav.startFree")}</button>
            </div>
          </div>
        </nav>

        <div className="landing-scroll">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-inner">
              <div className="hero-left">
                <div className="hero-badge">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}>
                    <defs>
                      <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#badge-grad)"/>
                    <circle cx="12" cy="14" r="2" fill="white"/>
                    <circle cx="20" cy="14" r="2" fill="white"/>
                    <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="16" cy="7" r="1" fill="white"/>
                    <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {t("landing.hero.badge")}
                </div>
                <h1 className="hero-title">
                  {t("landing.hero.title")}<br />
                  <span className="gradient-text">{t("landing.hero.titleEm")}</span>
                </h1>
                <p className="hero-subtitle">{t("landing.hero.sub")}</p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                    {t("landing.hero.cta")}
                  </button>
                  <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                    {t("landing.hero.ghost")}
                  </button>
                </div>
                <div className="hero-social-proof">
                  <div className="avatars">
                    {["☕", "🔧", "👗", "🍕", "💆"].map((emoji, i) => (
                      <div key={i} className="avatar" style={{ zIndex: 5 - i }}>{emoji}</div>
                    ))}
                  </div>
                  <span className="social-text">{t("landing.hero.trust")}</span>
                </div>
              </div>

              <div className="hero-right">
                <ChatDemo />
                <div className="float-badge badge-1">
                  <div style={{ fontSize: "1.25rem" }}>⚡</div>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#f3f4f6" }}>
                      {t("landing.hero.badge2Title")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {t("landing.hero.badge2Sub")}
                    </div>
                  </div>
                </div>
                <div className="float-badge badge-2">
                  <div style={{ fontSize: "1.25rem" }}>🚀</div>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#10b981" }}>
                      {t("landing.hero.badge3Title")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {t("landing.hero.badge3Sub")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ticker */}
          <Ticker />

          {/* Features Section */}
          <section className="section" id="features">
            <div className="section-inner">
              <div className="section-label">{t("landing.features.eyebrow")}</div>
              <h2 className="section-title">
                {t("landing.features.title")}<br />
                <span className="gradient-text">{t("landing.features.titleEm")}</span>
              </h2>
              <p className="section-subtitle">{t("landing.features.sub")}</p>
              <div className="features-grid">
                {[
                  {
                    icon: "🎨",
                    color: "#10b981",
                    title: t("landing.features.f1Title"),
                    desc: t("landing.features.f1Desc"),
                    tags: [t("landing.features.f1t1"), t("landing.features.f1t2"), t("landing.features.f1t3")],
                  },
                  {
                    icon: "🌐",
                    color: "#3b82f6",
                    title: t("landing.features.f2Title"),
                    desc: t("landing.features.f2Desc"),
                    tags: [t("landing.features.f2t1"), t("landing.features.f2t2"), t("landing.features.f2t3")],
                  },
                  {
                    icon: "📚",
                    color: "#ec4899",
                    title: t("landing.features.f3Title"),
                    desc: t("landing.features.f3Desc"),
                    tags: [t("landing.features.f3t1"), t("landing.features.f3t2"), t("landing.features.f3t3")],
                  },
                  {
                    icon: "📊",
                    color: "#10b981",
                    title: t("landing.features.f4Title"),
                    desc: t("landing.features.f4Desc"),
                    tags: [t("landing.features.f4t1"), t("landing.features.f4t2"), t("landing.features.f4t3")],
                  },
                ].map((feature, i) => (
                  <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="feature-icon" style={{
                      color: feature.color,
                      background: `${feature.color}20`
                    }}>{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                    <div className="feature-tags">
                      {feature.tags.map((tag, j) => (
                        <span className="tag" key={j} style={{
                          color: feature.color,
                          borderColor: `${feature.color}40`
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="section section-dark" id="how">
            <div className="section-inner">
              <div className="section-label">{t("landing.how.eyebrow")}</div>
              <h2 className="section-title">
                {t("landing.how.title")}<br />
                <span className="gradient-text">{t("landing.how.titleEm")}</span>
              </h2>
              <div className="steps">
                {[
                  { n: "01", color: "#10b981", title: t("landing.how.s1Title"), desc: t("landing.how.s1Desc") },
                  { n: "02", color: "#3b82f6", title: t("landing.how.s2Title"), desc: t("landing.how.s2Desc") },
                  { n: "03", color: "#10b981", title: t("landing.how.s3Title"), desc: t("landing.how.s3Desc") },
                ].map((step, i) => (
                  <div className="step" key={i}>
                    <div className="step-number" style={{
                      color: step.color,
                      borderColor: `${step.color}40`
                    }}>{step.n}</div>
                    {i < 2 && <div className="step-line" />}
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="section" id="pricing">
            <div className="section-inner">
              <div className="section-label">{t("landing.pricing.eyebrow")}</div>
              <h2 className="section-title">
                {t("landing.pricing.title")}<br />
                <span className="gradient-text">{t("landing.pricing.titleEm")}</span>
              </h2>
              <p className="section-subtitle">{t("landing.pricing.sub")}</p>
              <div className="pricing-grid">
                <PricingCard
                  plan={t("landing.pricing.plan1")}
                  price={t("landing.pricing.price1")}
                  color="#6b7280"
                  desc={t("landing.pricing.desc1")}
                  features={[
                    "1 AI agent",
                    "100 conversations/mo",
                    "Website widget only",
                    "Community support"
                  ]}
                />
                <PricingCard
                  plan={t("landing.pricing.plan2")}
                  price={t("landing.pricing.price2")}
                  color="#10b981"
                  desc={t("landing.pricing.desc2")}
                  highlight
                  features={[
                    "3 AI agents",
                    "2,000 conversations/mo",
                    "All channels (Web, FB, WhatsApp)",
                    "AI Insights dashboard",
                    "Priority support"
                  ]}
                />
                <PricingCard
                  plan={t("landing.pricing.plan3")}
                  price={t("landing.pricing.price3")}
                  color="#3b82f6"
                  desc={t("landing.pricing.desc3")}
                  features={[
                    "Unlimited agents",
                    "Unlimited conversations",
                    "Custom integrations",
                    "White-label option",
                    "Dedicated onboarding"
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="cta">
            <div className="cta-bg" />
            <div className="section-inner" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div className="section-label" style={{ justifyContent: "center", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="cta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#cta-grad)"/>
                  <circle cx="12" cy="14" r="2" fill="white"/>
                  <circle cx="20" cy="14" r="2" fill="white"/>
                  <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <circle cx="16" cy="7" r="1" fill="white"/>
                  <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {t("landing.footerCta.eyebrow")}
              </div>
              <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                {t("landing.footerCta.title")}<br />
                <span className="gradient-text">{t("landing.footerCta.titleEm")}</span>
              </h2>
              <p className="section-subtitle" style={{ maxWidth: 500, margin: "0 auto 2.5rem" }}>
                {t("landing.footerCta.sub")}
              </p>
              <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => navigate("/dashboard")}>
                {t("landing.footerCta.btn")}
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="nav-logo" style={{ marginBottom: "0.5rem" }}>
              <div className="logo-mark">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logo-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#logo-grad-footer)"/>
                  <circle cx="12" cy="14" r="2" fill="white"/>
                  <circle cx="20" cy="14" r="2" fill="white"/>
                  <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <circle cx="16" cy="7" r="1" fill="white"/>
                  <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span>Aura</span>
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {t("landing.footer.copyright")}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

/* Styles */
const styles = `
  .landing-root {
    background: #0f172a;
    color: #e5e7eb;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

  .landing-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .landing-scroll::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 3px;
  }

  /* Navigation */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: all 0.3s;
  }

  .nav.scrolled {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #1f2937;
  }

  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 1.25rem 2rem;
    gap: 2rem;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 1.25rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.02em;
    text-decoration: none;
    flex-shrink: 0;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-mark svg {
    width: 32px;
    height: 32px;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    margin-left: auto;
  }

  .nav-link {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: #e5e7eb;
  }

  .nav-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .nav-ghost {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
    padding: 0.5rem 1rem;
  }

  .nav-ghost:hover {
    color: #e5e7eb;
  }

  .nav-cta {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  }

  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 8rem 2rem 5rem;
    position: relative;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    top: -20%;
    left: -10%;
    width: 70%;
    height: 80%;
    background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-inner {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 100px;
    padding: 0.375rem 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #10b981;
    letter-spacing: 0.02em;
    margin-bottom: 1.75rem;
    width: fit-content;
    animation: fadeUp 0.6s ease both;
  }

  .hero-title {
    font-size: clamp(2.75rem, 5vw, 4.5rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: #f3f4f6;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .gradient-text {
    background: linear-gradient(135deg, #10b981, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.125rem;
    color: #9ca3af;
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 2.25rem;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    transition: all 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
  }

  .btn-secondary {
    background: #1f2937;
    color: #e5e7eb;
    border: 1px solid #374151;
    border-radius: 12px;
    padding: 1rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #374151;
    border-color: #4b5563;
  }

  .hero-social-proof {
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .avatars {
    display: flex;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1f2937;
    border: 2px solid #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    margin-left: -8px;
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .social-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .hero-right {
    position: relative;
    display: flex;
    justify-content: center;
    animation: fadeUp 0.7s 0.2s ease both;
  }

  .float-badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 14px;
    padding: 0.75rem 1.125rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }

  .badge-1 {
    top: -16px;
    right: -16px;
    animation: float1 4s ease-in-out infinite;
  }

  .badge-2 {
    bottom: 60px;
    left: -24px;
    animation: float2 4.5s ease-in-out infinite;
  }

  /* Sections */
  .section {
    padding: 6rem 2rem;
  }

  .section-dark {
    background: #111827;
  }

  .section-inner {
    max-width: 1280px;
    margin: 0 auto;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: #10b981;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
  }

  .section-title {
    font-size: clamp(2.25rem, 4vw, 3.25rem);
    font-weight: 800;
    line-height: 1.2;
    color: #f3f4f6;
    letter-spacing: -0.025em;
    margin-bottom: 1.25rem;
  }

  .section-subtitle {
    font-size: 1.0625rem;
    color: #9ca3af;
    line-height: 1.7;
    max-width: 560px;
    margin-bottom: 3.5rem;
  }

  /* Features */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .feature-card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 18px;
    padding: 2rem;
    transition: all 0.3s;
  }

  .feature-card:hover {
    border-color: #374151;
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .feature-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.75rem;
  }

  .feature-desc {
    font-size: 0.9375rem;
    color: #9ca3af;
    line-height: 1.65;
    margin-bottom: 1.25rem;
  }

  .feature-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    border: 1px solid;
    background: transparent;
  }

  /* Steps */
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    position: relative;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
  }

  .step-number {
    font-size: 2.5rem;
    font-weight: 800;
    border: 2px solid;
    border-radius: 16px;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    background: #1f2937;
  }

  .step-line {
    position: absolute;
    top: 36px;
    left: calc(100% + 1.25rem);
    width: calc(100% - 2.5rem);
    border-top: 2px dashed #374151;
  }

  .step-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.75rem;
  }

  .step-desc {
    font-size: 0.9375rem;
    color: #9ca3af;
    line-height: 1.65;
  }

  /* Pricing */
  .pricing-grid {
    display: flex;
    gap: 1.5rem;
    align-items: stretch;
    flex-wrap: wrap;
  }

  /* CTA */
  .cta {
    padding: 6rem 2rem;
    position: relative;
    overflow: hidden;
    border-top: 1px solid #1f2937;
  }

  .cta-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Footer */
  .footer {
    padding: 2.5rem 2rem;
    border-top: 1px solid #1f2937;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #111827;
  }

  /* Animations */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float1 {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }

  @keyframes bubbleIn {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes ticker {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .hero-inner {
      grid-template-columns: 1fr;
      gap: 3.5rem;
    }

    .hero-right {
      order: -1;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .steps {
      grid-template-columns: 1fr;
    }

    .step-line {
      display: none;
    }

    .pricing-grid {
      flex-direction: column;
    }

    .nav-links {
      display: none;
    }
  }
`;