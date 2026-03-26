import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useUser();

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
      }}>⚙️ {t("nav.settings")}</h1>
      <p style={{
        fontSize: '1rem',
        color: '#9ca3af',
        marginBottom: '2rem'
      }}>Manage your account and preferences</p>

      <div style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <h3 style={{ color: '#f3f4f6', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 700 }}>Account Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Business Name</div>
            <div style={{ fontSize: '1rem', color: '#f3f4f6', fontWeight: 600 }}>{user?.businessName || 'Not set'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Email</div>
            <div style={{ fontSize: '1rem', color: '#f3f4f6', fontWeight: 600 }}>{user?.email || 'Not set'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Plan</div>
            <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700, textTransform: 'capitalize' }}>{user?.plan || 'Free'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
