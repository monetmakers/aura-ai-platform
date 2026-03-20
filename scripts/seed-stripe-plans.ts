/**
 * Creates Growth and Pro subscription plans in Stripe.
 * Run once: npx tsx scripts/seed-stripe-plans.ts
 * Safe to run multiple times — checks if plans already exist.
 */
import { ensurePlan } from "../server/stripeClient";

async function main() {
  console.log("Seeding Stripe subscription plans...\n");
  await ensurePlan("Aura Growth Plan", 2900, "growth"); // $29/mo
  await ensurePlan("Aura Pro Plan",    7900, "pro");    // $79/mo
  console.log("\n✅ Done! View plans at https://dashboard.stripe.com/test/products");
}

main().catch(e => { console.error(e); process.exit(1); });
