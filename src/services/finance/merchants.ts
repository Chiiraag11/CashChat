import { prisma } from '@/lib/prisma';
import type { TopMerchantItem } from '@/types';

export async function getTopMerchants(userId: string, limit = 10, days = 90): Promise<TopMerchantItem[]> {
  const accounts = await prisma.financeAccount.findMany({ where: { userId }, select: { id: true } });
  const accountIds = accounts.map((a: { id: string }) => a.id);
  if (accountIds.length === 0) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const grouped = await prisma.transaction.groupBy({
    by: ['merchant'],
    where: { accountId: { in: accountIds }, type: 'debit', transactionDate: { gte: since } },
    _sum: { amount: true },
    _count: { _all: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: limit,
  });

  return grouped.map((g: { merchant: string; _sum: { amount: unknown }; _count: { _all: number } }) => ({
    merchant: g.merchant,
    totalSpent: g._sum.amount ? Number(g._sum.amount) : 0,
    transactionCount: g._count._all,
  }));
}
