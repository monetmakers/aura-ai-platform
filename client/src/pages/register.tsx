import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface AuthResponse {
  user?: {
    id: string; name: string | null; email: string | null;
    businessName: string | null; industry: string | null; plan: string;
  };
  error?: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    businessName: "", industry: "", name: "", email: "", password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.businessName.trim()) e.businessName = "Required";
    if (!form.industry)             e.industry = "Required";
    if (form.name.trim().length < 2) e.name = "Min 2 characters";
    if (!form.email.includes("@"))  e.email = "Valid email required";
    if (form.password.length < 6)   e.password = "Min 6 characters";
    return e;
  }

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          businessName: form.businessName,
          industry: form.industry,
        }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      return data;
    },
    onSuccess: (data) => {
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
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    },
    onError: (err: Error) => {
      setErrors({ submit: err.message });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    registerMutation.mutate();
  }

  const INDUSTRIES = [
    { key: "ecommerce",   label: t("register.industries.ecommerce") },
    { key: "saas",        label: t("register.industries.saas") },
    { key: "hospitality", label: t("register.industries.hospitality") },
    { key: "healthcare",  label: t("register.industries.healthcare") },
    { key: "finance",     label: t("register.industries.finance") },
    { key: "education",   label: t("register.industries.education") },
    { key: "realestate",  label: t("register.industries.realestate") },
    { key: "other",       label: t("register.industries.other") },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="reg-bg">
        <div className="reg-card">
          <div className="reg-logo">
            <div className="reg-logo-mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="reg-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" fill="url(#reg-logo-grad)"/>
                <circle cx="12" cy="14" r="2" fill="white"/>
                <circle cx="20" cy="14" r="2" fill="white"/>
                <path d="M11 19Q16 22 21 19" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="16" cy="7" r="1" fill="white"/>
                <line x1="16" y1="8" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="reg-logo-text">Aura</span>
          </div>

          {submitted ? (
            <div className="reg-success">
              <div className="reg-success-icon">✓</div>
              <div className="reg-success-title">{form.businessName}</div>
              <div className="reg-success-sub">Workspace created — redirecting…</div>
            </div>
          ) : (
            <>
              <h1 className="reg-title">{t("register.title")}</h1>
              <p className="reg-sub">{t("register.subtitle")}</p>

              <form className="reg-form" onSubmit={handleSubmit} noValidate>
                <div className="reg-row">
                  <Field label={t("register.businessName")} error={errors.businessName}>
                    <input
                      className="reg-input"
                      placeholder={t("register.businessNamePh")}
                      value={form.businessName}
                      onChange={e => set("businessName", e.target.value)}
                      data-testid="input-business-name"
                    />
                  </Field>
                  <Field label={t("register.industry")} error={errors.industry}>
                    <select
                      className="reg-input reg-select"
                      value={form.industry}
                      onChange={e => set("industry", e.target.value)}
                      data-testid="select-industry"
                    >
                      <option value="">{t("register.industryPh")}</option>
                      {INDUSTRIES.map(i => (
                        <option key={i.key} value={i.key}>{i.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="reg-row">
                  <Field label={t("register.fullName")} error={errors.name}>
                    <input
                      className="reg-input"
                      placeholder={t("register.fullNamePh")}
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      data-testid="input-full-name"
                    />
                  </Field>
                  <Field label={t("register.email")} error={errors.email}>
                    <input
                      type="email"
                      className="reg-input"
                      placeholder={t("register.emailPh")}
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      data-testid="input-email"
                      autoComplete="email"
                    />
                  </Field>
                </div>

                <Field label={t("register.password")} error={errors.password}>
                  <input
                    type="password"
                    className="reg-input"
                    placeholder={t("register.passwordPh")}
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    data-testid="input-password"
                    autoComplete="new-password"
                  />
                </Field>

                {errors.submit && (
                  <div className="reg-err-box">{errors.submit}</div>
                )}

                <button
                  type="submit"
                  className="reg-submit"
                  disabled={registerMutation.isPending}
                  data-testid="button-create-workspace"
                >
                  {registerMutation.isPending ? "Creating…" : t("register.submit")}
                </button>

                <div className="reg-signin">
                  {t("register.alreadyHave")}{" "}
                  <button
                    type="button"
                    className="reg-signin-link"
                    onClick={() => navigate("/login")}
                    data-testid="link-sign-in"
                  >
                    {t("register.signIn")}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="reg-field">
      <label className="reg-label">{label}</label>
      {children}
      {error && <span className="reg-error">{error}</span>}
    </div>
  );
}

const css = `
  .reg-bg {
    min-height: 100vh;
    width: 100%;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .reg-card {
    width: 100%;
    max-width: 600px;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 24px;
    padding: 3rem 2.5rem;
    animation: regFadeUp 0.4s ease both;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  }

  .reg-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
  }

  .reg-logo-mark {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reg-logo-mark svg {
    width: 40px;
    height: 40px;
    filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
  }

  .reg-logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
  }

  .reg-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .reg-sub {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0 0 2.5rem;
  }

  .reg-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 540px) {
    .reg-row {
      grid-template-columns: 1fr;
    }
  }

  .reg-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .reg-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #d1d5db;
    letter-spacing: 0.01em;
  }

  .reg-input {
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

  .reg-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .reg-input::placeholder {
    color: #6b7280;
  }

  .reg-select {
    cursor: pointer;
    appearance: none;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%239ca3af"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
    background-size: 1.25rem;
    padding-right: 2.5rem;
  }

  .reg-select option {
    background: #1f2937;
    color: #f3f4f6;
  }

  .reg-error {
    font-size: 0.8125rem;
    color: #f87171;
    margin-top: -0.25rem;
  }

  .reg-err-box {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 0.875rem 1.125rem;
    font-size: 0.9375rem;
    color: #f87171;
  }

  .reg-submit {
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

  .reg-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.35);
  }

  .reg-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .reg-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .reg-signin {
    text-align: center;
    font-size: 0.9375rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .reg-signin-link {
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

  .reg-signin-link:hover {
    color: #059669;
    text-decoration: underline;
  }

  .reg-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0;
    text-align: center;
    gap: 1rem;
  }

  .reg-success-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.1);
    border: 3px solid #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10b981;
    font-size: 2rem;
    font-weight: 700;
    animation: successPulse 0.6s ease both;
  }

  .reg-success-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f3f4f6;
  }

  .reg-success-sub {
    font-size: 1rem;
    color: #9ca3af;
  }

  @keyframes regFadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes successPulse {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
