import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { TopMerchantsTable } from '@/components/charts/TopMerchantsTable';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';

export default function DashboardPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1280px',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
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
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>
          Here&apos;s what&apos;s happening with your money.
        </p>
      </div>

      {/* KPI strip */}
      <SummaryCards />

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
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
