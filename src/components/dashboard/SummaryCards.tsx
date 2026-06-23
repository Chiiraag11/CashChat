'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { formatCurrency, cn } from '@/lib/utils';

export function SummaryCards() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return <p className="text-sm text-destructive">Couldn&apos;t load your summary. Try refreshing.</p>;
  }

  const cards = [
    { label: 'Total Income', value: data?.totalIncome, tone: 'positive' as const },
    { label: 'Total Expenses', value: data?.totalExpenses, tone: 'negative' as const },
    { label: 'Net Savings', value: data?.netSavings, tone: data && data.netSavings >= 0 ? 'positive' as const : 'negative' as const },
    { label: 'Transactions', value: data?.transactionCount, tone: 'neutral' as const, isCount: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardTitle>{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-7 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <p
                className={cn(
                  'ledger-figure text-2xl font-semibold',
                  card.tone === 'positive' && 'text-positive',
                  card.tone === 'negative' && 'text-negative',
                )}
              >
                {card.isCount ? card.value ?? 0 : formatCurrency(card.value ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
