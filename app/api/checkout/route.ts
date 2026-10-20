import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRODUCTS } from '@/lib/products'

export async function POST(request: Request) {
  const body = await request.json() as { productId?: string }
  const product = PRODUCTS.find((item) => item.id === body.productId)
  if (!product) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  const stripe = new Stripe(secretKey)
  const origin = request.headers.get('origin') ?? 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: { name: product.name, description: product.description }, unit_amount: product.priceInCents }, quantity: 1 }],
    success_url: `${origin}/shop?success=1&pack=${product.id}`,
    cancel_url: `${origin}/shop?cancelled=1`,
    metadata: { productId: product.id, tokens: String(product.tokens) },
    integration_identifier: `aviation_masters_${Math.random().toString(36).slice(2, 10)}`,
  })
  return NextResponse.json({ url: session.url })
}
