import { NextResponse } from 'next/server'
import { sendActivationSms } from '@/lib/security'

export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET
  if (secret && request.headers.get('x-webhook-secret') !== secret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: { plan?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const plan = typeof body.plan === 'string' && ['weekly', 'monthly'].includes(body.plan) ? body.plan : null
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  await sendActivationSms(plan)
  return NextResponse.json({ received: true })
}
