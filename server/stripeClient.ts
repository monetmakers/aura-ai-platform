import Stripe from "stripe";

// Use Stripe SDK directly with the secret key from environment
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2023-10-16" as any });
}

export { getStripe };

// Helper: create a Stripe Checkout session for a subscription
export async function createCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<{ url: string; id: string }> {
  const stripe = getStripe();

  const params: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  };
  if (customerEmail) params.customer_email = customerEmail;

  const session = await stripe.checkout.sessions.create(params);
  return { url: session.url!, id: session.id };
}

// Helper: list all active products with their prices
export async function listProductsWithPrices() {
  const stripe = getStripe();

  const products = await stripe.products.list({ active: true, limit: 20 });
  const prices   = await stripe.prices.list({ active: true, limit: 50 });

  return products.data.map(p => ({
    id:          p.id,
    name:        p.name,
    description: p.description ?? "",
    metadata:    p.metadata ?? {},
    prices:      prices.data
      .filter(pr => pr.product === p.id)
      .map(pr => ({
        id:         pr.id,
        unit_amount: pr.unit_amount ?? 0,
        currency:   pr.currency,
        interval:   (pr.recurring as { interval: string } | null)?.interval ?? null,
      })),
  }));
}

// Helper: create a product + monthly price in Stripe (used by seed script)
export async function ensurePlan(name: string, amountCents: number, planKey: string) {
  const stripe = getStripe();

  // Find existing active product by name
  const existing = await stripe.products.list({ active: true, limit: 100 });
  let product = existing.data.find(p => p.name === name);

  if (!product) {
    product = await stripe.products.create({
      name,
      metadata: { plan: planKey },
    });
    console.log(`Created product "${name}" (${product.id})`);
  } else {
    console.log(`Product "${name}" already exists (${product.id})`);
  }

  // Find or create monthly price
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  const monthly = prices.data.find(p => p.recurring?.interval === "month");

  if (monthly) {
    console.log(`  price exists: ${monthly.id} ($${monthly.unit_amount! / 100}/mo)`);
    return { product, price: monthly };
  }

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log(`  created price: ${price.id} ($${amountCents / 100}/mo)`);
  return { product, price };
}
