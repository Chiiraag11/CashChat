import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { createDemoData } from '@/lib/demoData';

/**
 * NextAuth config.
 * - PrismaAdapter persists users/accounts/sessions (see prisma/schema.prisma:
 *   User, NextAuthAccount, Session models).
 * - Session strategy is JWT: the session cookie itself carries the user id,
 *   so route handlers and middleware can authorize requests without a DB
 *   round trip on every call.
 */
const GMAIL_READONLY_SCOPE =
  'https://www.googleapis.com/auth/gmail.readonly';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  allowDangerousEmailAccountLinking: true,
  authorization: {
    params: {
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ].join(' '),
      access_type: 'offline',
    },
  },
}),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  events: {
  async createUser({ user }) {
    console.log("NEW USER CREATED:", user.email);

    await createDemoData(user.id);

    console.log("DEMO DATA CREATED FOR:", user.email);
  },
},
  callbacks: {
    
async jwt({ token, user, account }) {
  if (user) {
    token.userId = user.id;
  }

  if (
    account?.provider === 'google' &&
    account.access_token &&
    (account.scope ?? '')
      .split(/\s+/)
      .includes(GMAIL_READONLY_SCOPE)
  ) {
    token.googleAccessToken = account.access_token;
    token.googleRefreshToken =
      account.refresh_token ?? token.googleRefreshToken;
    token.googleAccessTokenExpiresAt = account.expires_at
      ? account.expires_at * 1000
      : Date.now() + 60 * 60 * 1000;
    token.googleScope = account.scope ?? '';
  }

  return token;
},

    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as typeof session.user & { id: string }).id = token.userId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
