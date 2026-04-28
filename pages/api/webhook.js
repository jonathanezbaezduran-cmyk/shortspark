import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed":
      // Payment success — user is now PRO
      // Here you'd save to a DB (e.g. Supabase/PlanetScale)
      console.log("New subscriber:", event.data.object.customer_email);
      break;

    case "customer.subscription.deleted":
      // Subscription canceled
      console.log("Subscription canceled:", event.data.object.customer);
      break;

    default:
      break;
  }

  res.status(200).json({ received: true });
}
