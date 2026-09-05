import { NextResponse } from 'next/server'
import { consumeTrial } from '@/lib/trials'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
  let body: { deviceId?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  if (typeof body.deviceId !== 'string' || !/^[a-f0-9]{32,128}$/i.test(body.deviceId)) return NextResponse.json({ error: 'A valid device identifier is required.' }, { status: 400 })
  const result = consumeTrial(ip, body.deviceId)
  if (!result.allowed) return NextResponse.json({ error: 'Your 3 free trial generations have been used. Subscribe or redeem a passcode to continue.', locked: true, remaining: 0 }, { status: 402 })
  return NextResponse.json(result)
}
