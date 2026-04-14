import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://agf-companion.vercel.app'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://agf-companion.vercel.app'}?cancelled=true`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
