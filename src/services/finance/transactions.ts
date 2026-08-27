import { prisma } from '@/lib/prisma';
import type { PaginatedTransactions } from '@/types';

export async function getPaginatedTransactions(
  userId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedTransactions> {
  const accounts = await prisma.financeAccount.findMany({ where: { userId }, select: { id: true, name: true } });
  const accountIds = accounts.map((a: { id: string; name: string }) => a.id);
  const nameById = new Map(accounts.map((a: { id: string; name: string }) => [a.id, a.name]));

  if (accountIds.length === 0) {
    return { items: [], page, pageSize, totalCount: 0 };
  }

  const where = { accountId: { in: accountIds } };

  const [totalCount, rows] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: rows.map((t: typeof rows[number]) => ({
      id: t.id,
      amount: Number(t.amount),
      category: t.category,
      merchant: t.merchant,
      transactionDate: t.transactionDate.toISOString(),
      type: t.type,
      accountName: nameById.get(t.accountId) ?? 'Unknown',
    })),
    page,
    pageSize,
    totalCount,
  };
}
