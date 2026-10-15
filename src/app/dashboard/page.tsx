
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { TopMerchantsTable } from '@/components/charts/TopMerchantsTable';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: 'none',
        boxSizing: 'border-box',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Demo data and AI notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 16px',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          background: 'rgba(139, 92, 246, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles
            size={21}
            color="#a78bfa"
            style={{ flexShrink: 0 }}
          />

          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-1)',
                margin: 0,
              }}
            >
              Demo Data · AI-Powered CashChat
            </p>

            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-3)',
                margin: '4px 0 0',
                lineHeight: 1.5,
              }}
            >
              These are sample financial figures. Ask CashChat AI
              questions about spending, trends, and merchants.
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#a78bfa',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Ask CashChat
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Page header */}
      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--text-1)',
            letterSpacing: '-0.02em',
          }}
        >
          Good morning, Chirag 👋
        </h2>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-3)',
            marginTop: '4px',
          }}
        >
          Here&apos;s what&apos;s happening with your money.
        </p>
      </div>

      {/* KPI strip */}
      <SummaryCards />

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
          width: '100%',
        }}
      >
        <CategoryPieChart />
        <MonthlyTrendChart />
      </div>

      {/* Full-width merchants */}
      <TopMerchantsTable />

      {/* Full-width transactions */}
      <RecentTransactionsTable />
    </div>
  );
}
