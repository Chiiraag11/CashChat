import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { TopMerchantsTable } from '@/components/charts/TopMerchantsTable';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your spending at a glance.</p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryPieChart />
        <MonthlyTrendChart />
      </div>

      <TopMerchantsTable />
      <RecentTransactionsTable />
    </div>
  );
}
