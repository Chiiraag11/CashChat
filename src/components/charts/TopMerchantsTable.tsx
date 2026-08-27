'use client';

import { useTopMerchants } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

export function TopMerchantsTable() {
  const { data, isLoading } = useTopMerchants();

  const maxSpend = data?.[0]?.totalSpent ?? 1;

  return (
    <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
            }}
          >
            Top Merchants
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
            Last 90 days
          </p>
        </div>
        <span className="badge badge-violet">{data?.length ?? 0} merchants</span>
      </div>

      {/* Body */}
      {isLoading || !data ? (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: '36px', borderRadius: '6px', opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-3)',
            fontSize: '13px',
          }}
        >
          No merchant activity yet. Add some transactions to get started.
        </div>
      ) : (
        <div>
          {data.map((m, idx) => {
            const pct = (m.totalSpent / maxSpend) * 100;
            const isTop = idx === 0;
            return (
              <div
                key={m.merchant}
                style={{
                  padding: '12px 20px',
                  borderBottom: idx < data.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  {/* Left: rank + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        background: isTop ? 'var(--emerald-dim, rgba(0,200,150,0.12))' : 'var(--surface-3)',
                        color: isTop ? 'var(--emerald)' : 'var(--text-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-1)',
                      }}
                    >
                      {m.merchant}
                    </span>
                  </div>

                  {/* Right: txns + amount */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                      {m.transactionCount} txns
                    </span>
                    <span
                      className="fig"
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-1)',
                        minWidth: '80px',
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(m.totalSpent)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '3px',
                    background: 'var(--surface-3)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isTop
                        ? 'linear-gradient(90deg, var(--emerald), #00E5B4)'
                        : 'var(--surface-3)',
                      borderRadius: '99px',
                      transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
                      backgroundImage: !isTop
                        ? `linear-gradient(90deg, rgba(139,92,246,0.6), rgba(59,130,246,0.4))`
                        : undefined,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
