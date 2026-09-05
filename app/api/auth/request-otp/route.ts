import { NextResponse } from 'next/server'
import { isRateLimited, issueEmailOtp } from '@/lib/security'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`otp:${ip}`, 3, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  const code = issueEmailOtp(email)
  const admin = process.env.ADMIN_GMAIL
  const password = process.env.GMAIL_APP_PASSWORD
  if (!admin || !password) return NextResponse.json({ error: 'Email sign-in is temporarily unavailable.' }, { status: 503 })
  const { default: nodemailer } = await import('nodemailer')
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: admin, pass: password } })
  await transporter.sendMail({ from: admin, to: email, subject: 'Your Sham AI verification code', text: `Your Sham AI verification code is ${code}. It expires in 10 minutes.` })
  return NextResponse.json({ ok: true })
}
