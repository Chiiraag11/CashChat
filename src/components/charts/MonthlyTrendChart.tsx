'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyTrend } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

export function MonthlyTrendChart() {
  const { data, isLoading } = useMonthlyTrend(6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading || !data ? (
          <div className="h-full w-full animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} width={90} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#0F7A4D" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#E5484D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
