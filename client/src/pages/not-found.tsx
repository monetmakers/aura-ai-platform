import { useLocation } from "wouter";

export default function NotFoundPage() {
  const [, navigate] = useLocation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      background: '#0f172a'
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '1rem', opacity: 0.5 }}>🤖</div>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 800,
        color: '#f3f4f6',
        marginBottom: '1rem'
      }}>404</h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#9ca3af',
        marginBottom: '2rem'
      }}>Page not found</p>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '0.875rem 1.75rem',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
