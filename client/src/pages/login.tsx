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
            <div className="login-logo-mark">✦</div>
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
    min-height: 100vh; width: 100%;
    background: #0f0d0a;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Syne', sans-serif;
  }
  .login-card {
    width: 100%; max-width: 420px;
    background: #141109;
    border: 1px solid rgba(245,158,11,0.14);
    border-radius: 20px;
    padding: 2.4rem 2.6rem;
    animation: loginFadeUp 0.35s ease both;
  }
  .login-logo {
    display: flex; align-items: center; gap: 0.6rem;
    margin-bottom: 2rem;
  }
  .login-logo-mark {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg,#f59e0b,#d97706);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; color: #0a0805; font-weight: 900;
  }
  .login-logo-text { font-size: 1.15rem; font-weight: 800; color: #f5e6c8; letter-spacing: -0.02em; }
  .login-title {
    font-family: 'Literata', serif;
    font-size: 1.55rem; font-weight: 500;
    color: #f5e6c8; letter-spacing: -0.02em; margin: 0 0 0.3rem;
  }
  .login-sub { font-size: 0.8rem; color: #6b6355; margin: 0 0 1.8rem; }
  .login-form { display: flex; flex-direction: column; gap: 1rem; }
  .login-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .login-label { font-size: 0.7rem; font-weight: 700; color: #6b6355; letter-spacing: 0.03em; }
  .login-input {
    background: #0f0d0a;
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px;
    color: #e8dece;
    font-family: 'Syne',sans-serif;
    font-size: 0.85rem;
    padding: 0.7rem 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .login-input:focus { border-color: rgba(245,158,11,0.35); }
  .login-input::placeholder { color: #4a4035; }
  .login-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px;
    padding: 0.55rem 0.85rem;
    font-size: 0.77rem; color: #f87171;
  }
  .login-submit {
    margin-top: 0.4rem;
    background: linear-gradient(135deg,#f59e0b,#d97706);
    color: #0a0805; border: none; border-radius: 12px;
    padding: 0.82rem; font-size: 0.88rem; font-weight: 800;
    font-family: 'Syne',sans-serif; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 24px rgba(245,158,11,0.25);
  }
  .login-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(245,158,11,0.35); }
  .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .login-footer { text-align: center; font-size: 0.75rem; color: #4a4035; }
  .login-link {
    background: none; border: none; color: #f59e0b;
    font-family: 'Syne',sans-serif; font-size: 0.75rem; font-weight: 700;
    cursor: pointer; padding: 0; text-decoration: underline;
  }
  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
