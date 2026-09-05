import { NextResponse } from 'next/server'
import { SAFE_SERVICE_MESSAGE } from '@/lib/security'

const supported = ['slides', 'website', 'docs', 'career', 'image', 'upscale', 'vector', 'chat', 'audio']

export async function POST(request: Request, { params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params
  if (!supported.includes(feature)) return NextResponse.json({ error: 'Unsupported Sham AI feature.' }, { status: 404 })
  let body: { prompt?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Please provide a valid JSON request.' }, { status: 400 }) }
  if (typeof body.prompt !== 'string' || body.prompt.trim().length < 2 || body.prompt.length > 4000) return NextResponse.json({ error: 'A prompt between 2 and 4000 characters is required.' }, { status: 400 })
  if (feature === 'chat' && !process.env.GROQ_API_KEY) return NextResponse.json({ error: SAFE_SERVICE_MESSAGE }, { status: 503 })
  return NextResponse.json({ feature, status: 'queued', unlimited: true, message: 'Your Sham AI creation has been queued.' })
}
