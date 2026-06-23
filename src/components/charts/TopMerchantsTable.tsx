'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/table';
import { useTopMerchants } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

export function TopMerchantsTable() {
  const { data, isLoading } = useTopMerchants();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Merchants (90 days)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="h-40 w-full animate-pulse rounded bg-muted" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No merchant activity yet.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Merchant</TableHeadCell>
                <TableHeadCell className="text-right">Transactions</TableHeadCell>
                <TableHeadCell className="text-right">Total Spent</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((m) => (
                <TableRow key={m.merchant}>
                  <TableCell>{m.merchant}</TableCell>
                  <TableCell className="ledger-figure text-right">{m.transactionCount}</TableCell>
                  <TableCell className="ledger-figure text-right">{formatCurrency(m.totalSpent)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
