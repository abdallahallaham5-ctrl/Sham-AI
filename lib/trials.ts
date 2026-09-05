import { createHash } from 'node:crypto'

const usage = new Map<string, { count: number; updatedAt: number }>()
const MAX_TRIALS = 3

function keyFor(ip: string, deviceId: string) {
  const subnet = ip.includes(':') ? ip.split(':').slice(0, 4).join(':') : ip.split('.').slice(0, 3).join('.')
  return createHash('sha256').update(`${subnet}:${deviceId}`).digest('hex')
}

export function consumeTrial(ip: string, deviceId: string) {
  const key = keyFor(ip, deviceId)
  const current = usage.get(key) ?? { count: 0, updatedAt: Date.now() }
  if (current.count >= MAX_TRIALS) return { allowed: false, remaining: 0 }
  current.count += 1
  current.updatedAt = Date.now()
  usage.set(key, current)
  return { allowed: true, remaining: MAX_TRIALS - current.count }
}

export const TRIAL_LIMIT = MAX_TRIALS
