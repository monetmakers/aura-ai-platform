import { useTranslation } from "react-i18next";

export default function IntegrationsPage() {
  const { t } = useTranslation();

  const integrations = [
    { name: "Shopify", icon: "🛍️", desc: "Connect your store", color: "#95bf47" },
    { name: "Stripe", icon: "💳", desc: "Payment processing", color: "#635bff" },
    { name: "Slack", icon: "💬", desc: "Team notifications", color: "#4a154b" },
    { name: "Zapier", icon: "⚡", desc: "Automate workflows", color: "#ff4a00" },
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Inter', sans-serif"
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 800,
        color: '#f3f4f6',
        marginBottom: '0.5rem'
      }}>🔌 {t("nav.integrations")}</h1>
      <p style={{
        fontSize: '1rem',
        color: '#9ca3af',
        marginBottom: '2rem'
      }}>Connect Aura with your favorite tools</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {integrations.map(int => (
          <div key={int.name} style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '1.75rem',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{int.icon}</div>
            <h3 style={{ color: '#f3f4f6', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{int.name}</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{int.desc}</p>
            <button style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%'
            }}>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
