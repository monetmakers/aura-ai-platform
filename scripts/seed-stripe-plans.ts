/**
 * Creates Growth and Pro subscription plans in Stripe.
 * Run once: npx tsx scripts/seed-stripe-plans.ts
 * Safe to run multiple times — checks if plans already exist.
 * Safe to skip if STRIPE_SECRET_KEY is not set (for local builds).
 */
import { ensurePlan } from "../server/stripeClient";

async function main() {
  // Skip if Stripe key not available (OK for non-production builds)
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log("⚠️  STRIPE_SECRET_KEY not set, skipping Stripe seeding");
    return;
  }

  console.log("Seeding Stripe subscription plans...\n");
  await ensurePlan("Aura Growth Plan", 2900, "growth"); // $29/mo
  await ensurePlan("Aura Pro Plan",    7900, "pro");    // $79/mo
  console.log("\n✅ Done! View plans at https://dashboard.stripe.com/test/products");
}

main().catch(e => { console.error(e); process.exit(1); });
