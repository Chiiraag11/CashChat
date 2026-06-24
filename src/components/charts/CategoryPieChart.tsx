'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useCategoryBreakdown } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#00C896', '#8B5CF6', '#3B82F6', '#F59E0B', '#FF4D6D', '#06B6D4', '#10B981'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '12px',
      }}
    >
      <div style={{ color: 'var(--text-2)', marginBottom: '4px' }}>{category}</div>
      <div
        className="fig"
        style={{ color: 'var(--text-1)', fontWeight: '600', fontSize: '14px' }}
      >
        {formatCurrency(total)}
      </div>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px 16px',
        marginTop: '12px',
      }}
    >
      {payload?.map((entry: any, i: number) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: entry.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-2)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CategoryPieChart() {
  const { data, isLoading } = useCategoryBreakdown();

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
            Spending by Category
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
            Current period
          </p>
        </div>
        <span className="badge badge-emerald">This month</span>
      </div>

      {/* Chart */}
      {isLoading || !data ? (
        <div
          className="skeleton"
          style={{ height: '200px', width: '100%', borderRadius: '8px' }}
        />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[i % COLORS.length]}
                  opacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
