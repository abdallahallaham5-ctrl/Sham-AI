import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
import { consumeEmailOtp } from '@/lib/security'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [Google, GitHub, Facebook, Credentials({
    id: 'email-otp', name: 'Email verification code',
    credentials: { email: { label: 'Email', type: 'email' }, code: { label: 'Verification code', type: 'text' } },
    async authorize(credentials) {
      const email = String(credentials?.email ?? '').trim().toLowerCase()
      const code = String(credentials?.code ?? '').trim()
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consumeEmailOtp(email, code)) return null
      return { id: email, email, name: email.split('@')[0] }
    },
  })],
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, user }) { if (user) { token.email = user.email; token.name = user.name } return token },
    async session({ session, token }) { if (session.user) { session.user.email = token.email as string; session.user.name = token.name as string } return session },
  },
})
