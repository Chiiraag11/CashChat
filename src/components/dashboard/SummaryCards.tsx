'use client';

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendVal?: string;
  accent?: 'emerald' | 'red' | 'violet' | 'default';
  loading?: boolean;
}

function KPICard({ label, value, sub, trend, trendVal, accent = 'default', loading }: KPICardProps) {
  const accentColor =
    accent === 'emerald' ? 'var(--emerald)' :
    accent === 'red'     ? 'var(--danger)'  :
    accent === 'violet'  ? 'var(--violet)'  :
    'var(--text-1)';

  const TrendIcon =
    trend === 'up'   ? TrendingUp :
    trend === 'down' ? TrendingDown :
    Activity;

  const trendColor = trend === 'up' ? 'var(--emerald)' : trend === 'down' ? 'var(--danger)' : 'var(--text-3)';

  return (
    <div
      className="glass glass-hover"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--text-3)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        {trend && trendVal && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              fontWeight: '500',
              color: trendColor,
              background:
                trend === 'up' ? 'var(--emerald-dim, rgba(0,200,150,0.1))' :
                trend === 'down' ? 'var(--red-dim, rgba(255,77,109,0.1))' :
                'transparent',
              padding: '2px 6px',
              borderRadius: '5px',
            }}
          >
            <TrendIcon size={10} strokeWidth={2.5} />
            {trendVal}
          </span>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="skeleton" style={{ height: '32px', width: '140px' }} />
      ) : (
        <div
          className="fig"
          style={{
            fontSize: '26px',
            fontWeight: '700',
            color: accentColor,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      )}

      {/* Sub label */}
      {loading ? (
        <div className="skeleton" style={{ height: '12px', width: '100px' }} />
      ) : (
        sub && (
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
            {sub}
          </span>
        )
      )}
    </div>
  );
}

export function SummaryCards() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(255,77,109,0.08)',
          border: '1px solid rgba(255,77,109,0.2)',
          fontSize: '13px',
          color: 'var(--danger)',
        }}
      >
        Couldn't load your summary. Try refreshing.
      </div>
    );
  }

  const netSavings = data?.netSavings ?? 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}
    >
      <KPICard
        label="Total Income"
        value={data ? formatCurrency(data.totalIncome) : '—'}
        sub="This period"
        trend="up"
        trendVal="+12.4%"
        accent="emerald"
        loading={isLoading}
      />
      <KPICard
        label="Total Expenses"
        value={data ? formatCurrency(data.totalExpenses) : '—'}
        sub="Across all accounts"
        trend="down"
        trendVal="-3.1%"
        accent="red"
        loading={isLoading}
      />
      <KPICard
        label="Net Savings"
        value={data ? formatCurrency(netSavings) : '—'}
        sub={netSavings >= 0 ? 'On track' : 'Over budget'}
        trend={netSavings >= 0 ? 'up' : 'down'}
        trendVal={netSavings >= 0 ? 'Healthy' : 'Review'}
        accent={netSavings >= 0 ? 'emerald' : 'red'}
        loading={isLoading}
      />
      <KPICard
        label="Transactions"
        value={data?.transactionCount ?? '—'}
        sub="Total recorded"
        trend="neutral"
        accent="violet"
        loading={isLoading}
      />
    </div>
  );
}
