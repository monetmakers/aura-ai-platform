import { useState, useEffect, useCallback } from "react";

export interface UserData {
  name: string;
  email: string;
  businessName: string;
  industry: string;
  plan: "free" | "growth" | "pro";
  initials: string;
  bizInitial: string;
}

const STORAGE_KEY = "aura_user";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";
}

function buildUserData(u: {
  name?: string | null; email?: string | null;
  businessName?: string | null; industry?: string | null; plan?: string;
}): UserData {
  const name = u.name ?? "";
  const businessName = u.businessName ?? "";
  return {
    name,
    email: u.email ?? "",
    businessName,
    industry: u.industry ?? "",
    plan: (u.plan ?? "free") as UserData["plan"],
    initials: getInitials(name),
    bizInitial: (businessName[0] ?? "B").toUpperCase(),
  };
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sync with server session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then((data: { user: any }) => {
        if (data.user) {
          const ud = buildUserData(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ud));
          setUser(ud);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function saveUser(data: Omit<UserData, "initials" | "bizInitial">) {
    const full: UserData = {
      ...data,
      initials: getInitials(data.name),
      bizInitial: (data.businessName[0] ?? "B").toUpperCase(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setUser(full);
  }

  function updatePlan(plan: UserData["plan"]) {
    if (!user) return;
    const updated = { ...user, plan };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, saveUser, updatePlan, signOut, buildUserData };
}
