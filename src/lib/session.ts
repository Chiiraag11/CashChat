
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export class UnauthorizedError extends Error {
  constructor() {
    super('Not authenticated.');
    this.name = 'UnauthorizedError';
  }
}

/**
 * Require a signed-in user, then use the shared demo-data owner's
 * ID for the read-only dashboard and chat queries.
 */
export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const signedInUserId = (
    session?.user as { id?: string } | undefined
  )?.id;

  if (!signedInUserId) {
    throw new UnauthorizedError();
  }

  const demoOwnerEmail = process.env.DEMO_DATA_OWNER_EMAIL;

  if (!demoOwnerEmail) {
    throw new Error('DEMO_DATA_OWNER_EMAIL is not configured.');
  }

  const demoOwner = await prisma.user.findUnique({
    where: { email: demoOwnerEmail.trim() },
    select: {
      id: true,
      accounts: {
        select: { id: true },
      },
    },
  });

  if (!demoOwner || demoOwner.accounts.length === 0) {
    throw new Error(
      'Demo data owner not found or has no financial accounts.'
    );
  }

  return demoOwner.id;
}
