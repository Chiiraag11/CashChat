import { withAuth } from 'next-auth/middleware';

/**
 * Protects /dashboard, /chat, and the dashboard/chat API routes. NextAuth's
 * withAuth() checks for a valid JWT session cookie and redirects
 * unauthenticated browser requests to /login (configured in lib/auth.ts),
 * or returns 401 for API requests.
 */
export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/api/dashboard/:path*', '/api/chat/:path*'],
};
