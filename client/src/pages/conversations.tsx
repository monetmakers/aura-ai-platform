import { useState } from "react";
import { useTranslation } from "react-i18next";

const THREADS = [
  { id: 1, name: "Sarah Mitchell", preview: "Do you have oat milk lattes?", time: "2m ago", msgs: 6, resolved: true,
    messages: [
      { from: "user", text: "Hi! Do you have oat milk lattes?", time: "14:21" },
      { from: "bot",  text: "Yes! Our oat milk lattes are made with Oatly barista blend. We also offer almond and coconut. Want to see the full menu?", time: "14:21" },
      { from: "user", text: "What sizes do you offer?", time: "14:22" },
      { from: "bot",  text: "We have Small (8oz), Medium (12oz), and Large (16oz). All available for oat milk at no extra charge!", time: "14:22" },
      { from: "user", text: "Perfect! Can I pre-order for pickup?", time: "14:23" },
      { from: "bot",  text: "Absolutely! You can pre-order via our app or website. Just select 'Pickup' at checkout and choose your time slot. 🎉", time: "14:23" },
    ]
  },
  { id: 2, name: "James O'Brien",  preview: "My order never arrived",          time: "18m ago", msgs: 4, resolved: false,
    messages: [
      { from: "user", text: "My order #4821 was supposed to arrive 2 hours ago. Where is it?", time: "13:55" },
      { from: "bot",  text: "I'm so sorry to hear that! Let me look into order #4821 for you. Could you confirm the delivery address?", time: "13:55" },
      { from: "user", text: "12 Maple Street, Dublin", time: "13:56" },
      { from: "bot",  text: "Thank you. It appears there's a delay on that route. The delivery is now estimated for 15:30. I've escalated this to our team — apologies for the inconvenience!", time: "13:56" },
    ]
  },
  { id: 3, name: "Priya Sharma",   preview: "What's your return policy?",      time: "1h ago",  msgs: 3, resolved: true,
    messages: [
      { from: "user", text: "Hi, what's your return policy on clothing items?", time: "12:45" },
      { from: "bot",  text: "We offer 30-day hassle-free returns on all clothing items! Just use the prepaid label in your parcel. Refunds are processed within 48 hours.", time: "12:45" },
      { from: "user", text: "Great, thanks!", time: "12:46" },
    ]
  },
  { id: 4, name: "Tom Walsh",      preview: "Can I change my subscription?",   time: "3h ago",  msgs: 5, resolved: true,
    messages: [
      { from: "user", text: "I want to upgrade my subscription from Starter to Growth.", time: "10:20" },
      { from: "bot",  text: "Happy to help with that! You can upgrade directly from your billing page. Want me to walk you through it?", time: "10:20" },
      { from: "user", text: "Yes please", time: "10:21" },
      { from: "bot",  text: "Go to Settings → Billing → Change Plan. Select 'Growth' and confirm. The upgrade is instant and you'll only pay the prorated difference.", time: "10:21" },
      { from: "user", text: "Perfect, done! Thanks.", time: "10:23" },
    ]
  },
  { id: 5, name: "Elena Cruz",     preview: "Store opening hours on Sunday?",  time: "5h ago",  msgs: 2, resolved: true,
    messages: [
      { from: "user", text: "Are you open on Sunday?", time: "08:15" },
      { from: "bot",  text: "Yes! We're open Sundays 10am–4pm. See you then! ☀️", time: "08:15" },
    ]
  },
];

export default function ConversationsPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(THREADS[0]);
  const [filter, setFilter] = useState("all");

  const filtered = THREADS.filter(thread =>
    filter === "all" ? true : filter === "open" ? !thread.resolved : thread.resolved
  );

  const filterTabs = [
    { key: "all",      label: t("conversations.filterAll") },
    { key: "open",     label: t("conversations.filterOpen") },
    { key: "resolved", label: t("conversations.filterResolved") },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">◇ {t("nav.conversations")}</span>
        <div className="conv-filter-tabs">
          {filterTabs.map(f => (
            <button key={f.key} className={`filter-tab ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)} data-testid={`filter-${f.key}`}>
              {f.label}
              {f.key === "open" && <span className="filter-dot" />}
            </button>
          ))}
        </div>
      </div>

      <div className="conv-layout">
        <div className="conv-list">
          {filtered.map((thread, i) => (
            <button
              key={thread.id}
              className={`conv-item ${selected?.id === thread.id ? "active" : ""}`}
              onClick={() => setSelected(thread)}
              style={{ animationDelay: `${i * 0.05}s` }}
              data-testid={`conversation-${thread.id}`}
            >
              <div className="conv-av">{thread.name.charAt(0)}</div>
              <div className="conv-item-info">
                <div className="conv-item-top">
                  <span className="conv-item-name">{thread.name}</span>
                  <span className="conv-item-time">{thread.time}</span>
                </div>
                <div className="conv-item-preview">{thread.preview}</div>
              </div>
              <div className={`conv-status-dot ${thread.resolved ? "resolved" : "open"}`} />
            </button>
          ))}
        </div>

        {selected ? (
          <div className="conv-thread">
            <div className="thread-header">
              <div className="thread-av">{selected.name.charAt(0)}</div>
              <div>
                <div className="thread-name">{selected.name}</div>
                <div className="thread-meta">{selected.msgs} {t("conversations.messages")} · {selected.time}</div>
              </div>
              <span className={`thread-badge ${selected.resolved ? "resolved" : "open"}`}>
                {selected.resolved ? t("conversations.resolved") : t("conversations.openStatus")}
              </span>
            </div>

            <div className="thread-messages">
              {selected.messages.map((msg, i) => (
                <div key={i} className={`thread-msg-wrap ${msg.from}`}>
                  {msg.from === "bot" && <div className="thread-bot-av">✦</div>}
                  <div>
                    <div className={`thread-bubble ${msg.from}`}>{msg.text}</div>
                    <div className="thread-time">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="thread-footer">
              <div style={{ fontSize: "0.72rem", color: "#4a4035", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>◈</span> {t("conversations.handledByAgent")}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="a-btn a-btn-ghost-sm" data-testid="button-export-conversation">{t("conversations.exportBtn")}</button>
                <button className="a-btn a-btn-ghost-sm" data-testid="button-flag-conversation">{t("conversations.flagBtn")}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="conv-empty">
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>◇</div>
            <div style={{ fontSize: "0.85rem", color: "#6b6355" }}>{t("conversations.selectConversation")}</div>
          </div>
        )}
      </div>
    </>
  );
}

const css = `
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .conv-filter-tabs{display:flex;gap:.3rem;}
  .filter-tab{background:none;border:1px solid transparent;border-radius:8px;padding:.3rem .75rem;font-family:'Syne',sans-serif;font-size:.75rem;font-weight:600;color:#6b6355;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:.4rem;}
  .filter-tab:hover{color:#c8a96e;}
  .filter-tab.active{background:rgba(245,158,11,.1);color:#f5c842;border-color:rgba(245,158,11,.2);}
  .filter-dot{width:6px;height:6px;border-radius:50%;background:#f59e0b;}
  .a-btn{display:inline-flex;align-items:center;gap:.4rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;}
  .a-btn-ghost-sm{background:rgba(245,158,11,.07);color:#c8a96e;border:1px solid rgba(245,158,11,.12);border-radius:8px;padding:.35rem .8rem;font-size:.74rem;}
  .a-btn-ghost-sm:hover{background:rgba(245,158,11,.12);}
  .conv-layout{flex:1;display:grid;grid-template-columns:280px 1fr;overflow:hidden;}
  .conv-list{overflow-y:auto;border-right:1px solid rgba(245,158,11,.08);background:#0a0805;display:flex;flex-direction:column;gap:1px;padding:.5rem 0;}
  .conv-list::-webkit-scrollbar{width:0;}
  .conv-item{display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;background:none;border:none;cursor:pointer;width:100%;text-align:left;transition:background .15s;border-radius:0;animation:a-fadeUp .4s ease both;}
  .conv-item:hover{background:rgba(245,158,11,.04);}
  .conv-item.active{background:rgba(245,158,11,.09);}
  .conv-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#2a2015,#3d2e18);border:1px solid rgba(245,158,11,.15);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:700;color:#c8a96e;flex-shrink:0;}
  .conv-item-info{flex:1;min-width:0;}
  .conv-item-top{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;margin-bottom:.15rem;}
  .conv-item-name{font-size:.8rem;font-weight:700;color:#c8a96e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .conv-item-time{font-size:.62rem;color:#4a4035;flex-shrink:0;}
  .conv-item-preview{font-size:.72rem;color:#6b6355;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .conv-status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .conv-status-dot.open{background:#f59e0b;box-shadow:0 0 5px rgba(245,158,11,.4);}
  .conv-status-dot.resolved{background:#4a4035;}
  .conv-thread{display:flex;flex-direction:column;overflow:hidden;}
  .thread-header{display:flex;align-items:center;gap:.8rem;padding:.9rem 1.6rem;border-bottom:1px solid rgba(245,158,11,.08);background:#0a0805;flex-shrink:0;}
  .thread-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#2a2015,#3d2e18);border:1px solid rgba(245,158,11,.15);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:#c8a96e;flex-shrink:0;}
  .thread-name{font-size:.88rem;font-weight:700;color:#f5e6c8;}
  .thread-meta{font-size:.68rem;color:#6b6355;margin-top:.1rem;}
  .thread-badge{margin-left:auto;font-size:.65rem;font-weight:700;padding:.22rem .65rem;border-radius:100px;letter-spacing:.04em;}
  .thread-badge.resolved{background:rgba(52,211,153,.08);color:#34d399;border:1px solid rgba(52,211,153,.2);}
  .thread-badge.open{background:rgba(245,158,11,.08);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}
  .thread-messages{flex:1;overflow-y:auto;padding:1.2rem 1.6rem;display:flex;flex-direction:column;gap:.8rem;background:#0f0d0a;}
  .thread-messages::-webkit-scrollbar{width:4px;} .thread-messages::-webkit-scrollbar-thumb{background:rgba(245,158,11,.12);border-radius:4px;}
  .thread-msg-wrap{display:flex;align-items:flex-start;gap:.6rem;}
  .thread-msg-wrap.user{flex-direction:row-reverse;}
  .thread-bot-av{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:.68rem;color:#0a0805;font-weight:900;flex-shrink:0;margin-top:2px;}
  .thread-bubble{padding:.65rem .95rem;border-radius:12px;font-size:.8rem;line-height:1.55;font-family:'Syne',sans-serif;max-width:72%;}
  .thread-bubble.bot{background:#141109;border:1px solid rgba(245,158,11,.1);color:#c8a96e;border-radius:2px 12px 12px 12px;}
  .thread-bubble.user{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.18);color:#f5e6c8;border-radius:12px 12px 2px 12px;}
  .thread-time{font-size:.62rem;color:#4a4035;margin-top:.25rem;padding:0 .3rem;}
  .thread-footer{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1.6rem;border-top:1px solid rgba(245,158,11,.08);background:#0a0805;flex-shrink:0;}
  .conv-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4a4035;font-family:'Syne',sans-serif;}
  @keyframes a-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;
