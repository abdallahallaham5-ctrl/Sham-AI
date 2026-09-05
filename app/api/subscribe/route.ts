import { NextResponse } from 'next/server'
import { PAYMENT_CHECKOUT_URLS } from '@/lib/security'

export async function GET(request: Request) {
  const plan = new URL(request.url).searchParams.get('plan') === 'month' ? 'month' : 'week'
  const paymentLink = PAYMENT_CHECKOUT_URLS[plan]()
  if (!paymentLink) return NextResponse.json({ error: 'Subscription checkout is not configured yet.' }, { status: 503 })
  return NextResponse.redirect(paymentLink)
}
