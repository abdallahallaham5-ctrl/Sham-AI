'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function AccountControls() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')
  if (status === 'loading') return null
  if (session?.user) return <div className="account-controls"><div className="account-avatar">{(session.user.name ?? 'S').slice(0, 2).toUpperCase()}</div><span>{session.user.name ?? session.user.email}<small>Free Trial</small></span><button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button></div>
  async function requestOtp() { setMessage('Sending code...'); const response = await fetch('/api/auth/request-otp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) }); setMessage(response.ok ? 'Code sent. Check your inbox.' : (await response.json()).error) ; if (response.ok) setSent(true) }
  return <div className="account-controls"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email to sign in" type="email" aria-label="Email to sign in" />{sent && <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" maxLength={6} aria-label="Verification code" />}<button onClick={sent ? () => signIn('email-otp', { email, code, callbackUrl: '/' }) : requestOtp}>{sent ? 'Verify' : 'Send code'}</button><button className="oauth-button" onClick={() => signIn('google')}>Continue with Google</button>{message && <small role="status">{message}</small>}</div>
}
