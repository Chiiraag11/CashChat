/**
 * Prisma client singleton.
 * Next.js hot-reloads modules in dev, which would otherwise create a new
 * PrismaClient (and a new connection pool) on every edit. We cache the
 * instance on `globalThis` in non-production environments to avoid
 * exhausting Postgres connections.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
