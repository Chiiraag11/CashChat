import { prisma } from '@/lib/prisma';
import type { SummaryCardsData } from '@/types';

/**
 * All finance services scope every query to the requesting user via a
 * sub-select on accounts.userId, mirroring the same tenant-isolation rule
 * the NL->SQL pipeline is required to apply (see lib/openai/schemaContext.ts).
 */
export async function getSummary(userId: string): Promise<SummaryCardsData> {
  const accountIds = await prisma.financeAccount.findMany({
    where: { userId },
    select: { id: true },
  });
  const ids = accountIds.map((a: { id: string }) => a.id);

  if (ids.length === 0) {
    return { totalIncome: 0, totalExpenses: 0, netSavings: 0, transactionCount: 0 };
  }

  const [incomeAgg, expenseAgg, transactionCount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { accountId: { in: ids }, type: 'credit' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { accountId: { in: ids }, type: 'debit' },
      _sum: { amount: true },
    }),
    prisma.transaction.count({ where: { accountId: { in: ids } } }),
  ]);

  const totalIncome = toNumber(incomeAgg._sum.amount);
  const totalExpenses = toNumber(expenseAgg._sum.amount);

  return {
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    transactionCount,
  };
}

/** Prisma returns aggregate sums as Decimal-like objects; Number() on them parses correctly via their toString/valueOf. */
function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}
