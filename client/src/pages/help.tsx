import { useTranslation } from "react-i18next";

export default function HelpPage() {
  const { t } = useTranslation();

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
      }}>❓ {t("nav.help")}</h1>
      <p style={{
        fontSize: '1rem',
        color: '#9ca3af',
        marginBottom: '2rem'
      }}>Get help and learn how to use Aura</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ color: '#f3f4f6', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Documentation</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9375rem', marginBottom: '1rem' }}>Learn how to set up and use Aura</p>
          <a href="#" style={{ color: '#10b981', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none' }}>View Docs →</a>
        </div>

        <div style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
          <h3 style={{ color: '#f3f4f6', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Chat</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9375rem', marginBottom: '1rem' }}>Chat with our support team</p>
          <button style={{ color: '#10b981', fontSize: '0.9375rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Start Chat →</button>
        </div>

        <div style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧</div>
          <h3 style={{ color: '#f3f4f6', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Email Support</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9375rem', marginBottom: '1rem' }}>Get help via email</p>
          <a href="mailto:support@aura.ai" style={{ color: '#10b981', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none' }}>support@aura.ai →</a>
        </div>
      </div>
    </div>
  );
}
