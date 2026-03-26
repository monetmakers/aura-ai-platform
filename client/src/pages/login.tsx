import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface LoginResponse {
  user: {
    id: string; name: string | null; email: string | null;
    businessName: string | null; industry: string | null; plan: string;
  };
  error?: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      return data;
    },
    onSuccess: (data) => {
      // Sync user to localStorage for sidebar hook
      if (data.user) {
        const u = data.user;
        const initials = (u.name ?? "??").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
        const bizInitial = (u.businessName ?? "B")[0].toUpperCase();
        localStorage.setItem("aura_user", JSON.stringify({
          name: u.name ?? "",
          email: u.email ?? "",
          businessName: u.businessName ?? "",
          industry: u.industry ?? "",
          plan: u.plan ?? "free",
          initials,
          bizInitial,
        }));
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      navigate("/dashboard");
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    loginMutation.mutate();
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="login-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#login-logo-grad)"/>
                <circle cx="12" cy="14" r="2" fill="white"/>
                <circle cx="20" cy="14" r="2" fill="white"/>
                <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="16" cy="7" r="1" fill="white"/>
                <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="login-logo-text">Aura</span>
          </div>

          <h1 className="login-title">{t("login.title", "Welcome back")}</h1>
          <p className="login-sub">{t("login.subtitle", "Sign in to your Aura workspace")}</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label className="login-label">{t("register.email", "Work email")}</label>
              <input
                type="email"
                className="login-input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                data-testid="input-login-email"
                autoComplete="email"
              />
            </div>
            <div className="login-field">
              <label className="login-label">{t("login.password", "Password")}</label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                data-testid="input-login-password"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-submit"
              disabled={loginMutation.isPending}
              data-testid="button-login-submit"
            >
              {loginMutation.isPending ? "Signing in…" : t("login.submit", "Sign in") + " →"}
            </button>

            <div className="login-footer">
              {t("login.noAccount", "Don't have an account?")}{" "}
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/register")}
                data-testid="link-go-register"
              >
                {t("login.createAccount", "Create one free")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const css = `
  .login-bg {
    min-height: 100vh;
    width: 100%;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 24px;
    padding: 3rem 2.5rem;
    animation: loginFadeUp 0.4s ease both;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
  }

  .login-logo-mark {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-logo-mark svg {
    width: 40px;
    height: 40px;
    filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
  }

  .login-logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
  }

  .login-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .login-sub {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0 0 2.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .login-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #d1d5db;
    letter-spacing: 0.01em;
  }

  .login-input {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    color: #f3f4f6;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    padding: 0.875rem 1.125rem;
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }

  .login-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .login-input::placeholder {
    color: #6b7280;
  }

  .login-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 0.875rem 1.125rem;
    font-size: 0.9375rem;
    color: #f87171;
  }

  .login-submit {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
  }

  .login-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.35);
  }

  .login-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-footer {
    text-align: center;
    font-size: 0.9375rem;
    color: #6b7280;
    margin-top: 1.5rem;
  }

  .login-link {
    background: none;
    border: none;
    color: #10b981;
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
    transition: color 0.2s;
  }

  .login-link:hover {
    color: #059669;
    text-decoration: underline;
  }

  @keyframes loginFadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
