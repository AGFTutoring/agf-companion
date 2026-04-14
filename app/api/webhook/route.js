import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
    else { event = JSON.parse(body); }
  } catch (err) { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  switch (event.type) {
    case "checkout.session.completed": console.log("Checkout completed:", event.data.object.customer); break;
    case "customer.subscription.deleted": console.log("Sub cancelled:", event.data.object.customer); break;
    default: break;
  }
  return NextResponse.json({ received: true });
}
