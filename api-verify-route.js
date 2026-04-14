import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { session_id } = await req.json();
    
    if (!session_id) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid' && session.status === 'complete') {
      return Response.json({ 
        active: true,
        customer: session.customer,
        subscription: session.subscription,
        email: session.customer_details?.email,
      });
    }

    return Response.json({ active: false });
  } catch (err) {
    console.error('Stripe verify error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
