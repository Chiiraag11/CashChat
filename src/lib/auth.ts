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
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
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
