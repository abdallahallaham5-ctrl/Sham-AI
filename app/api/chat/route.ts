import { NextResponse } from 'next/server'

const limit = 30
const buckets = new Map<string, number[]>()

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const recent = (buckets.get(ip) ?? []).filter((time) => now - time < 60_000)
  if (recent.length >= limit) return NextResponse.json({ error: 'Please slow down and try again in a moment.' }, { status: 429 })
  recent.push(now); buckets.set(ip, recent)
  let body: { messages?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid chat request.' }, { status: 400 }) }
  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 20) return NextResponse.json({ error: 'A valid conversation is required.' }, { status: 400 })
  const messages = body.messages.filter((item): item is { role: 'user' | 'assistant'; content: string } => typeof item === 'object' && item !== null && ((item as any).role === 'user' || (item as any).role === 'assistant') && typeof (item as any).content === 'string' && (item as any).content.length <= 4000)
  if (!messages.length) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 })
  const pollinations = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: 'openai', messages: [{ role: 'system', content: 'You are Sham AI, a concise, helpful assistant. Respond in the user’s language.' }, ...messages], stream: false }) }).catch(() => null)
  if (pollinations?.ok) { const data = await pollinations.json(); const message = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text; if (message) return NextResponse.json({ message }) }
  return NextResponse.json({ error: 'Sham AI chat is temporarily unavailable. Please try again shortly.' }, { status: 503 })
}
