import { NextResponse } from 'next/server'
import { isRateLimited, redeemPasscode, sendActivationSms, sendPasscodeSms } from '@/lib/security'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`passcode:${ip}`, 5)) return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
  let body: { code?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Please provide a valid JSON request.' }, { status: 400 }) }
  if (typeof body.code !== 'string' || body.code.length < 10 || body.code.length > 20 || !/^[A-Za-z0-9]+$/.test(body.code)) return NextResponse.json({ error: 'Enter a valid 10–20 character passcode.' }, { status: 400 })
  const redeemed = redeemPasscode(body.code)
  if (!redeemed) return NextResponse.json({ error: 'That passcode is invalid or has already been used.' }, { status: 401 })

  await Promise.allSettled([
    sendPasscodeSms(redeemed.category, redeemed.replacement),
    sendActivationSms(redeemed.category === '3day' ? '3-Day Trial via Passcode' : `${redeemed.category} via Passcode`),
  ])
  return NextResponse.json({ success: true, category: redeemed.category, durationDays: redeemed.category === '3day' ? 3 : redeemed.category === 'week' ? 7 : 30 })
}

export async function GET() {
  return NextResponse.json({ message: 'Passcode verification endpoint is ready.' })
}
