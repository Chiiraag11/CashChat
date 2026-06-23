'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useDashboardSummary';
import { formatCurrency, cn } from '@/lib/utils';

export function RecentTransactionsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactions(page, 10);

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / data.pageSize)) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="h-64 w-full animate-pulse rounded bg-muted" />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>Merchant</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Account</TableHeadCell>
                  <TableHeadCell className="text-right">Amount</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(t.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>{t.merchant}</TableCell>
                    <TableCell className="text-muted-foreground">{t.category}</TableCell>
                    <TableCell className="text-muted-foreground">{t.accountName}</TableCell>
                    <TableCell
                      className={cn('ledger-figure text-right', t.type === 'credit' ? 'text-positive' : 'text-foreground')}
                    >
                      {t.type === 'credit' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {data.page} of {totalPages} &middot; {data.totalCount} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
