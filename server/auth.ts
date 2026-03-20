import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Express, Request, Response } from "express";

const SALT_ROUNDS = 10;

function safeUser(u: typeof users.$inferSelect) {
  const { password: _pw, ...rest } = u;
  return rest;
}

export function registerAuthRoutes(app: Express) {
  // ── Register ────────────────────────────────────────────────────────
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password, businessName, industry } = req.body as {
        name: string; email: string; password: string;
        businessName: string; industry: string;
      };

      if (!name || !email || !password || !businessName || !industry) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const username = email.split("@")[0] + "_" + Date.now();

      const [user] = await db.insert(users).values({
        username,
        password: hash,
        name,
        email,
        businessName,
        industry,
        plan: "free",
      }).returning();

      (req.session as any).userId = user.id;
      return res.json({ user: safeUser(user) });
    } catch (err: any) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "Registration failed" });
    }
  });

  // ── Login ───────────────────────────────────────────────────────────
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      (req.session as any).userId = user.id;
      return res.json({ user: safeUser(user) });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  // ── Current user ─────────────────────────────────────────────────────
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) return res.json({ user: null });

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        (req.session as any).userId = undefined;
        return res.json({ user: null });
      }
      return res.json({ user: safeUser(user) });
    } catch {
      return res.json({ user: null });
    }
  });

  // ── Logout ───────────────────────────────────────────────────────────
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  // ── Update plan (called after Stripe success) ─────────────────────
  app.patch("/api/auth/plan", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { plan } = req.body as { plan: string };
      if (!["free", "growth", "pro"].includes(plan)) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const [user] = await db.update(users)
        .set({ plan })
        .where(eq(users.id, userId))
        .returning();

      return res.json({ user: safeUser(user) });
    } catch {
      return res.status(500).json({ error: "Failed to update plan" });
    }
  });
}
