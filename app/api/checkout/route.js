import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (existing.data.length > 0) {
      customer = existing.data[0];
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 });
      if (subs.data.length > 0) return NextResponse.json({ error: "already_subscribed" }, { status: 400 });
    } else { customer = await stripe.customers.create({ email }); }
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL || "https://agf-companion.vercel.app"}?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://agf-companion.vercel.app"}?cancelled=true`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) { console.error("Checkout error:", err); return NextResponse.json({ error: err.message }, { status: 500 }); }
}
