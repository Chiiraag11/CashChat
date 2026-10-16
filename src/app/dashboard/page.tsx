import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { Greeting } from '@/components/dashboard/Greeting';
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
        maxWidth: 1400,
        margin: '0 auto',
        boxSizing: 'border-box',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Page header */}
      <Greeting />

      {/* Demo data and AI notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 16px',
          border: '1px solid color-mix(in srgb, var(--violet) 28%, transparent)',
          borderRadius: '14px',
          background:
            'linear-gradient(100deg, var(--violet-dim), color-mix(in srgb, var(--emerald) 7%, transparent))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <span
            style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--violet-dim)', color: 'var(--violet-text)',
            }}
          >
            <Sparkles size={17} />
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>
              Demo Data · AI-Powered CashChat
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: '3px 0 0', lineHeight: 1.5 }}>
              These are sample financial figures. Ask CashChat AI questions about spending, trends, and merchants.
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          className="bg-brand"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '10px',
            fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-emerald)',
          }}
        >
          Ask CashChat
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI strip */}
      <SummaryCards />

      {/* Charts row */}
      <div className="chart-grid">
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
