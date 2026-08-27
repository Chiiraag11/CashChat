import { useQuery } from '@tanstack/react-query';
import type { SummaryCardsData, CategoryBreakdownItem, MonthlyTrendItem, TopMerchantItem, PaginatedTransactions } from '@/types';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} failed (${res.status})`);
  return res.json();
}

export function useDashboardSummary() {
  return useQuery<SummaryCardsData>({ queryKey: ['dashboard', 'summary'], queryFn: () => fetchJson('/api/dashboard/summary') });
}

export function useCategoryBreakdown() {
  return useQuery<CategoryBreakdownItem[]>({ queryKey: ['dashboard', 'categories'], queryFn: () => fetchJson('/api/dashboard/categories') });
}

export function useMonthlyTrend(months = 6) {
  return useQuery<MonthlyTrendItem[]>({
    queryKey: ['dashboard', 'trends', months],
    queryFn: () => fetchJson(`/api/dashboard/trends?months=${months}`),
  });
}

export function useTopMerchants() {
  return useQuery<TopMerchantItem[]>({ queryKey: ['dashboard', 'merchants'], queryFn: () => fetchJson('/api/dashboard/merchants') });
}

export function useTransactions(page: number, pageSize = 10) {
  return useQuery<PaginatedTransactions>({
    queryKey: ['dashboard', 'transactions', page, pageSize],
    queryFn: () => fetchJson(`/api/dashboard/transactions?page=${page}&pageSize=${pageSize}`),
  });
}
