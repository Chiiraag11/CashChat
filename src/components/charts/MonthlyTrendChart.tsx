'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useMonthlyTrend } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '12px',
        minWidth: '140px',
      }}
    >
      <div style={{ color: 'var(--text-3)', marginBottom: '8px', fontSize: '11px' }}>{label}</div>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          <span style={{ color: 'var(--text-2)', textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span
            className="fig"
            style={{
              color: p.dataKey === 'income' ? 'var(--emerald)' : 'var(--danger)',
              fontWeight: '600',
            }}
          >
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyTrendChart() {
  const { data, isLoading } = useMonthlyTrend(6);

  return (
    <div className="glass" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
            }}
          >
            Monthly Trend
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
            Income vs. Expenses
          </p>
        </div>
        {/* Legend dots */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: 'Income',   color: 'var(--emerald)' },
            { label: 'Expenses', color: 'var(--danger)' },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-2)' }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div
          className="skeleton"
          style={{ height: '200px', width: '100%', borderRadius: '8px' }}
        />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00C896" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00C896" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FF4D6D" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FF4D6D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-3)' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-3)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#00C896"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#00C896', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#FF4D6D"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#FF4D6D', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
