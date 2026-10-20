import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 })
  const stripe = new Stripe(secret)
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  let event: Stripe.Event
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret) } catch { return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 }) }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'unpaid') console.log('[v0] AM token purchase paid', session.id, session.metadata?.productId)
  }
  return NextResponse.json({ received: true })
}
