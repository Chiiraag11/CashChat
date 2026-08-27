import { prisma } from '@/lib/prisma';
import type { CategoryBreakdownItem } from '@/types';

/** Spend-by-category breakdown, used by the Pie/Bar charts on the dashboard. */
export async function getCategoryBreakdown(userId: string): Promise<CategoryBreakdownItem[]> {
  const accounts = await prisma.financeAccount.findMany({ where: { userId }, select: { id: true } });
  const accountIds = accounts.map((a: { id: string }) => a.id);
  if (accountIds.length === 0) return [];

  const grouped = await prisma.transaction.groupBy({
    by: ['category'],
    where: { accountId: { in: accountIds }, type: 'debit' },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
  });

  return grouped.map((g: { category: string; _sum: { amount: unknown } }) => ({
    category: g.category,
    total: g._sum.amount ? Number(g._sum.amount) : 0,
  }));
}
