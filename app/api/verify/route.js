import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) return NextResponse.json({ subscribed: false });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return NextResponse.json({ subscribed: false });
    const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "active", limit: 1 });
    return NextResponse.json({ subscribed: subs.data.length > 0 });
  } catch (err) { return NextResponse.json({ subscribed: false }); }
}
