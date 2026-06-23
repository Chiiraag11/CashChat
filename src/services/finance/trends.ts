import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { MonthlyTrendItem } from '@/types';

/**
 * Monthly income vs. expenses for the trailing N months.
 * Uses a raw query for date_trunc('month', ...) grouping, which Prisma's
 * query builder doesn't express natively. Still fully parameterized and
 * scoped to the caller's own account ids — never touches user-supplied text.
 */
export async function getMonthlyTrend(userId: string, months = 6): Promise<MonthlyTrendItem[]> {
  const accounts = await prisma.financeAccount.findMany({ where: { userId }, select: { id: true } });
  const accountIds = accounts.map((a: { id: string }) => a.id);
  if (accountIds.length === 0) return [];

  type Row = { month: Date; income: string | null; expenses: string | null };

  const rows = await prisma.$queryRaw<Row[]>`
    SELECT
      date_trunc('month', t."transactionDate") AS month,
      SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END) AS income,
      SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END) AS expenses
    FROM transactions t
    WHERE t."accountId" IN (${Prisma.join(accountIds)})
      AND t."transactionDate" >= now() - interval '1 month' * ${months}
    GROUP BY month
    ORDER BY month ASC
  `;

  return rows.map((r: Row) => ({
    month: r.month.toISOString().slice(0, 7),
    income: r.income ? Number(r.income) : 0,
    expenses: r.expenses ? Number(r.expenses) : 0,
  }));
}
