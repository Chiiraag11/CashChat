import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export class UnauthorizedError extends Error {
  constructor() {
    super('Not authenticated.');
    this.name = 'UnauthorizedError';
  }
}

/** Resolves the authenticated user's id in a route handler, or throws. */
export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  return userId;
}
