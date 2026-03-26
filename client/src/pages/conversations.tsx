import { useTranslation } from "react-i18next";

export default function ConversationsPage() {
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
      }}>💬 {t("nav.conversations")}</h1>
      <p style={{
        fontSize: '1rem',
        color: '#9ca3af',
        marginBottom: '2rem'
      }}>View and manage your customer conversations</p>

      <div style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💬</div>
        <p style={{ color: '#9ca3af', fontSize: '0.9375rem' }}>
          No conversations yet. Start chatting in the playground or deploy your agent to receive messages.
        </p>
      </div>
    </div>
  );
}
