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
            <div className="reg-logo-mark">✦</div>
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
                  {registerMutation.isPending ? "Creating…" : `✦ ${t("register.submit")}`}
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
    min-height: 100vh; width: 100%;
    background: #0f0d0a;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Syne', sans-serif;
  }
  .reg-card {
    width: 100%; max-width: 560px;
    background: #141109;
    border: 1px solid rgba(245,158,11,0.14);
    border-radius: 20px;
    padding: 2.4rem 2.6rem;
    animation: regFadeUp 0.4s ease both;
  }
  .reg-logo { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem; }
  .reg-logo-mark {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg,#f59e0b,#d97706);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; color: #0a0805; font-weight: 900;
  }
  .reg-logo-text { font-size: 1.15rem; font-weight: 800; color: #f5e6c8; letter-spacing: -0.02em; }
  .reg-title {
    font-family: 'Literata', serif;
    font-size: 1.6rem; font-weight: 500;
    color: #f5e6c8; letter-spacing: -0.02em; margin: 0 0 0.35rem;
  }
  .reg-sub { font-size: 0.8rem; color: #6b6355; margin: 0 0 1.8rem; }
  .reg-form { display: flex; flex-direction: column; gap: 1rem; }
  .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media(max-width:500px) { .reg-row { grid-template-columns: 1fr; } }
  .reg-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .reg-label { font-size: 0.7rem; font-weight: 700; color: #6b6355; letter-spacing: 0.03em; }
  .reg-input {
    background: #0f0d0a;
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 10px;
    color: #e8dece;
    font-family: 'Syne',sans-serif;
    font-size: 0.82rem;
    padding: 0.65rem 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .reg-input:focus { border-color: rgba(245,158,11,0.35); }
  .reg-input::placeholder { color: #4a4035; }
  .reg-select { cursor: pointer; appearance: none; }
  .reg-select option { background: #141109; }
  .reg-error { font-size: 0.65rem; color: #f87171; }
  .reg-err-box {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px; padding: 0.55rem 0.85rem;
    font-size: 0.77rem; color: #f87171;
  }
  .reg-submit {
    margin-top: 0.5rem;
    background: linear-gradient(135deg,#f59e0b,#d97706);
    color: #0a0805; border: none; border-radius: 12px;
    padding: 0.8rem; font-size: 0.85rem; font-weight: 800;
    font-family: 'Syne',sans-serif; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 24px rgba(245,158,11,0.25);
  }
  .reg-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(245,158,11,0.35); }
  .reg-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .reg-signin { text-align: center; font-size: 0.75rem; color: #4a4035; margin-top: 0.25rem; }
  .reg-signin-link {
    background: none; border: none; color: #f59e0b;
    font-family: 'Syne',sans-serif; font-size: 0.75rem; font-weight: 700;
    cursor: pointer; padding: 0; text-decoration: underline;
  }
  .reg-success {
    display: flex; flex-direction: column; align-items: center;
    padding: 2rem 0; text-align: center; gap: 0.6rem;
  }
  .reg-success-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(52,211,153,0.12); border: 2px solid #34d399;
    display: flex; align-items: center; justify-content: center;
    color: #34d399; font-size: 1.4rem; font-weight: 700;
  }
  .reg-success-title { font-size: 1.1rem; font-weight: 700; color: #f5e6c8; }
  .reg-success-sub { font-size: 0.78rem; color: #6b6355; }
  @keyframes regFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
