import { randomInt, timingSafeEqual } from 'node:crypto'

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const passcodes = new Map<'week' | 'month' | '3day', { code: string; expiresAt: number }>()
const redeemed = new Set<string>()
const requestLog = new Map<string, number[]>()

export type PasscodeCategory = 'week' | 'month' | '3day'

export function generatePasscode(length = 16) {
  return Array.from({ length }, () => ALPHANUMERIC[randomInt(ALPHANUMERIC.length)]).join('')
}

const emailOtps = new Map<string, { code: string; expiresAt: number }>()

export function issueEmailOtp(email: string) {
  const code = String(randomInt(100000, 1000000))
  emailOtps.set(email.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000 })
  return code
}

export function consumeEmailOtp(email: string, code: string) {
  const entry = emailOtps.get(email.toLowerCase())
  if (!entry || entry.expiresAt < Date.now() || !/^\d{6}$/.test(code) || !safeEqual(entry.code, code)) return false
  emailOtps.delete(email.toLowerCase())
  return true
}

export function getOrCreatePasscode(category: PasscodeCategory) {
  const current = passcodes.get(category)
  if (current && current.expiresAt > Date.now()) return current.code
  const code = generatePasscode()
  passcodes.set(category, { code, expiresAt: Date.now() + 30 * 60 * 1000 })
  return code
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function isRateLimited(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now()
  const recent = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs)
  recent.push(now)
  requestLog.set(key, recent)
  return recent.length > limit
}

export function redeemPasscode(code: string) {
  if (!/^[A-Za-z0-9]{10,20}$/.test(code) || redeemed.has(code)) return null
  for (const [category, entry] of passcodes) {
    if (entry.expiresAt > Date.now() && safeEqual(entry.code, code)) {
      redeemed.add(code)
      passcodes.delete(category)
      const replacement = getOrCreatePasscode(category)
      return { category, replacement }
    }
  }
  return null
}

export const PAYMENT_CHECKOUT_URLS = {
  week: () => process.env.PAYMENT_LINK_WEEKLY,
  month: () => process.env.PAYMENT_LINK_MONTHLY,
} as const

export const SAFE_SERVICE_MESSAGE = 'Service temporarily updating, please try again shortly.'

export async function sendAdminSms(message: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER
  const to = process.env.ADMIN_PHONE_NUMBER
  if (!sid || !token || !from || !to) return false
  const client = (await import('twilio')).default(sid, token)
  await client.messages.create({ body: message, from, to })
  return true
}

export async function sendPasscodeSms(category: PasscodeCategory, code: string) {
  return sendAdminSms(`Sham AI ${category} passcode: ${code}. Expires in 30 minutes.`)
}

export async function sendActivationSms(plan: string) {
  const timestamp = new Date().toISOString()
  return sendAdminSms(`Sham AI Alert: New user activated plan ${plan} at ${timestamp}.`)
}
