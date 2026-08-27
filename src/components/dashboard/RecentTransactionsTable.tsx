'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Food:          { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  Shopping:      { bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6' },
  Health:        { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
  Utilities:     { bg: 'rgba(139,92,246,0.1)',  color: '#8B5CF6' },
  Transport:     { bg: 'rgba(6,182,212,0.1)',   color: '#06B6D4' },
  Entertainment: { bg: 'rgba(255,77,109,0.1)',  color: '#FF4D6D' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: 'var(--surface-3)', color: 'var(--text-2)' };
}

export function RecentTransactionsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactions(page, 8);
  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / data.pageSize)) : 1;

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
            Recent Transactions
          </h3>
          {data && (
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
              {data.totalCount} total
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading || !data ? (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: '40px', borderRadius: '6px', opacity: 1 - i * 0.12 }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr 110px 140px 100px',
              padding: '8px 20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['Date', 'Merchant', 'Category', 'Account', 'Amount'].map((col, i) => (
              <span
                key={col}
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'var(--text-3)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textAlign: i === 4 ? 'right' : 'left',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {data.items.map((t, idx) => {
            const catStyle = getCategoryStyle(t.category);
            const isCredit = t.type === 'credit';
            return (
              <div
                key={t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '130px 1fr 110px 140px 100px',
                  padding: '10px 20px',
                  borderBottom: idx < data.items.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Date */}
                <span
                  className="fig"
                  style={{ fontSize: '12px', color: 'var(--text-3)' }}
                >
                  {new Date(t.transactionDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                {/* Merchant */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: '12px',
                  }}
                >
                  {t.merchant}
                </span>

                {/* Category pill */}
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: catStyle.bg,
                      color: catStyle.color,
                    }}
                  >
                    {t.category}
                  </span>
                </span>

                {/* Account */}
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: '12px',
                  }}
                >
                  {t.accountName}
                </span>

                {/* Amount */}
                <span
                  className="fig"
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: isCredit ? 'var(--emerald)' : 'var(--text-1)',
                    textAlign: 'right',
                  }}
                >
                  {isCredit ? '+' : '−'}{formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              Page {data.page} of {totalPages} · {data.totalCount} transactions
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { icon: ChevronLeft, disabled: page <= 1, onClick: () => setPage((p) => p - 1) },
                { icon: ChevronRight, disabled: page >= totalPages, onClick: () => setPage((p) => p + 1) },
              ].map(({ icon: Icon, disabled, onClick }, i) => (
                <button
                  key={i}
                  onClick={onClick}
                  disabled={disabled}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: disabled ? 'var(--text-3)' : 'var(--text-2)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.1s',
                  }}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
