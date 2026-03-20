import { useState } from "react";
import { useLocation } from "wouter";

const NAV = [
  { label: "Dashboard",     icon: "▦",  path: "/dashboard" },
  { label: "Documents",     icon: "⊟",  path: "/documents" },
  { label: "Agents",        icon: "◈",  path: "/agent" },
  { label: "Playground",    icon: "◻",  path: "/playground" },
  { label: "Conversations", icon: "◇",  path: "/conversations" },
  { label: "AI Insights",   icon: "◉",  path: "/insights" },
  { label: "Revenue",       icon: "◎",  path: "/revenue" },
  { label: "Integrations",  icon: "⊕",  path: "/integrations" },
  { label: "Deploy",        icon: "⊗",  path: "/deploy" },
];

export default function AppSidebar() {
  const [location, navigate] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <style>{css}</style>
      <aside className="sidebar">
        {/* Logo */}
        <div className="sb-logo" onClick={() => navigate("/")}>
          <div className="sb-logo-mark">✦</div>
          <span className="sb-logo-text">Aura</span>
        </div>

        {/* Business switcher */}
        <div className="sb-biz">
          <div className="sb-biz-av">M</div>
          <div className="sb-biz-info">
            <div className="sb-biz-name">Main Store</div>
            <div className="sb-biz-plan">Free Plan</div>
          </div>
          <div className="sb-biz-chevron">⌄</div>
        </div>

        {/* Nav */}
        <div className="sb-sec-lbl">MAIN</div>
        <nav className="sb-nav">
          {NAV.map(item => {
            const active = location === item.path || location.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                className={`sb-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
                {active && <span className="sb-pip" />}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="sb-sec-lbl" style={{ marginTop: "auto", paddingTop: "1rem" }}>SETTINGS</div>
        <button
          className={`sb-item ${location === "/settings" ? "active" : ""}`}
          onClick={() => navigate("/settings")}
        >
          <span className="sb-icon">⚙</span>
          <span className="sb-label">Settings</span>
          {location === "/settings" && <span className="sb-pip" />}
        </button>
        <button
          className={`sb-item ${location === "/help" ? "active" : ""}`}
          onClick={() => navigate("/help")}
        >
          <span className="sb-icon">?</span>
          <span className="sb-label">Help & Support</span>
          {location === "/help" && <span className="sb-pip" />}
        </button>

        {/* User footer */}
        <div className="sb-user" onClick={() => setUserMenuOpen(o => !o)}>
          <div className="sb-user-av">JD</div>
          <div className="sb-user-info">
            <div className="sb-user-name">John Doe</div>
            <div className="sb-user-email">john@mainstore.com</div>
          </div>
          <div className="sb-user-chevron" style={{ transform: userMenuOpen ? "rotate(180deg)" : "none" }}>⌄</div>
        </div>

        {userMenuOpen && (
          <div className="sb-user-menu">
            <button className="sb-user-item" onClick={() => navigate("/settings")}>⚙ Account settings</button>
            <button className="sb-user-item">◎ Billing</button>
            <div style={{ height: 1, background: "rgba(245,158,11,0.08)", margin: "0.3rem 0" }} />
            <button className="sb-user-item" style={{ color: "#f87171" }}>→ Sign out</button>
          </div>
        )}
      </aside>
    </>
  );
}

const css = `
  .sidebar {
    width: 224px; flex-shrink: 0;
    background: #0a0805;
    border-right: 1px solid rgba(245,158,11,0.1);
    display: flex; flex-direction: column;
    padding: 0 0 0.5rem; overflow-y: auto;
    position: relative;
  }
  .sidebar::-webkit-scrollbar { width: 0; }

  .sb-logo {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 1.3rem 1.2rem 1rem; cursor: pointer;
  }
  .sb-logo-mark {
    width: 28px; height: 28px; border-radius: 7px;
    background: linear-gradient(135deg,#f59e0b,#d97706);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; color: #0a0805; font-weight: 900; flex-shrink: 0;
  }
  .sb-logo-text {
    font-size: 1.1rem; font-weight: 800; color: #f5e6c8; letter-spacing: -0.02em;
  }

  .sb-biz {
    margin: 0 0.7rem 1rem;
    padding: 0.55rem 0.75rem;
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px;
    display: flex; align-items: center; gap: 0.6rem;
    cursor: pointer; transition: background 0.15s;
  }
  .sb-biz:hover { background: rgba(245,158,11,0.1); }
  .sb-biz-av {
    width: 26px; height: 26px; border-radius: 6px;
    background: linear-gradient(135deg,#34d399,#059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #022c22; flex-shrink: 0;
  }
  .sb-biz-name { font-size: 0.75rem; font-weight: 700; color: #f5e6c8; }
  .sb-biz-plan { font-size: 0.62rem; color: #6b6355; }
  .sb-biz-chevron { margin-left: auto; color: #6b6355; font-size: 0.75rem; }

  .sb-sec-lbl {
    padding: 0 1.2rem 0.35rem;
    font-size: 0.58rem; letter-spacing: 0.1em;
    color: #4a4035; font-weight: 700; font-family: 'Syne',sans-serif;
  }

  .sb-nav { display: flex; flex-direction: column; gap: 1px; padding: 0 0.5rem; }

  .sb-item {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.5rem 0.75rem; border-radius: 8px;
    border: none; background: none;
    color: #6b6355; font-family: 'Syne',sans-serif;
    font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    text-align: left; width: 100%; position: relative;
  }
  .sb-item:hover { background: rgba(245,158,11,0.06); color: #c8a96e; }
  .sb-item.active { background: rgba(245,158,11,0.1); color: #f5c842; }
  .sb-icon { font-size: 0.88rem; width: 17px; text-align: center; flex-shrink: 0; }
  .sb-pip {
    position: absolute; right: 0.6rem;
    width: 5px; height: 5px; border-radius: 50%;
    background: #f59e0b;
  }

  .sb-user {
    display: flex; align-items: center; gap: 0.55rem;
    padding: 0.75rem 1rem 0.5rem;
    margin-top: 0.4rem;
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
    margin: 0 0.5rem 0.5rem;
    background: #141109;
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px; overflow: hidden;
    animation: a-fadeUp 0.15s ease both;
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
