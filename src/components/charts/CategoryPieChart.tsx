'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategoryBreakdown } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0F7A4D', '#2E9E6B', '#5BBE8E', '#9AD8B5', '#C8EBD8', '#E5484D', '#F2A65A'];

export function CategoryPieChart() {
  const { data, isLoading } = useCategoryBreakdown();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading || !data ? (
          <div className="h-full w-full animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="category" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {data.map((entry, i) => (
                  <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
