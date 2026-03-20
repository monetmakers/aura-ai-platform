import { useState, useRef, useEffect } from "react";
import i18n from "@/lib/i18n";

const LANGS = [
  { code: "en", label: "EN", full: "English" },
  { code: "lt", label: "LT", full: "Lietuvių" },
  { code: "es", label: "ES", full: "Español" },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.code === i18n.language) ?? LANGS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 14,
        right: 18,
        zIndex: 9999,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <button
        data-testid="button-language-switcher-global"
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.38rem 0.8rem",
          background: open ? "rgba(245,158,11,0.18)" : "rgba(15,13,10,0.78)",
          border: "1px solid rgba(245,158,11,0.35)",
          borderRadius: 100,
          color: "#f59e0b",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          cursor: "pointer",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          transition: "background 0.15s, border-color 0.15s",
          boxShadow: "0 2px 16px rgba(0,0,0,0.55)",
        }}
        onMouseEnter={e => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.14)";
        }}
        onMouseLeave={e => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = "rgba(15,13,10,0.78)";
        }}
      >
        <span style={{ fontSize: "0.82rem" }}>🌐</span>
        {current.label}
        <span style={{
          fontSize: "0.56rem",
          opacity: 0.75,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          display: "inline-block",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          background: "#141109",
          border: "1px solid rgba(245,158,11,0.22)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 36px rgba(0,0,0,0.65)",
          minWidth: 138,
        }}>
          {LANGS.map(lang => (
            <button
              key={lang.code}
              data-testid={`lang-option-${lang.code}`}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                width: "100%",
                padding: "0.55rem 1rem",
                background: i18n.language === lang.code ? "rgba(245,158,11,0.12)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: i18n.language === lang.code ? "#f59e0b" : "#c8a96e",
                fontSize: "0.8rem",
                fontWeight: i18n.language === lang.code ? 700 : 400,
                fontFamily: "'Syne', sans-serif",
                textAlign: "left",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => {
                if (i18n.language !== lang.code)
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.07)";
              }}
              onMouseLeave={e => {
                if (i18n.language !== lang.code)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: i18n.language === lang.code ? "#f59e0b" : "#6b6355",
                minWidth: 22,
              }}>{lang.label}</span>
              {lang.full}
              {i18n.language === lang.code && (
                <span style={{ marginLeft: "auto", color: "#f59e0b", fontSize: "0.72rem" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
