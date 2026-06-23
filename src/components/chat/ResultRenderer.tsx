'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/table';
import type { ChatApiResponse } from '@/types/chat';

const COLORS = ['#0F7A4D', '#2E9E6B', '#5BBE8E', '#9AD8B5', '#E5484D', '#F2A65A', '#6B8FE5'];

export function ResultRenderer({ result }: { result: ChatApiResponse }) {
  return (
    <div className="mt-3 space-y-3">
      {result.chartType !== 'none' && result.chartData && result.chartData.length > 0 && (
        <div className="h-64 w-full rounded-md border bg-card p-3">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(result)}
          </ResponsiveContainer>
        </div>
      )}

      {result.rows.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-md border">
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(result.rows[0] ?? {}).map((col) => (
                  <TableHeadCell key={col}>{col}</TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.rows.map((row, i) => (
                <TableRow key={i}>
                  {Object.values(row).map((val, j) => (
                    <TableCell key={j} className="ledger-figure">
                      {val === null ? '—' : String(val)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer select-none">View generated SQL</summary>
        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 font-mono text-[11px]">{result.sql}</pre>
      </details>
    </div>
  );
}

function renderChart(result: ChatApiResponse) {
  const data = result.chartData ?? [];

  if (result.chartType === 'pie') {
    return (
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={80} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  if (result.chartType === 'line') {
    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0F7A4D" strokeWidth={2} dot={false} />
      </LineChart>
    );
  }

  // default: bar
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
      <YAxis tick={{ fontSize: 11 }} />
      <Tooltip />
      <Bar dataKey="value" fill="#0F7A4D" radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}
