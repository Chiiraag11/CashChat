export * from './chat';

export interface SummaryCardsData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  transactionCount: number;
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
}

export interface MonthlyTrendItem {
  month: string; // 'YYYY-MM'
  income: number;
  expenses: number;
}

export interface TopMerchantItem {
  merchant: string;
  totalSpent: number;
  transactionCount: number;
}

export interface PaginatedTransactions {
  items: Array<{
    id: string;
    amount: number;
    category: string;
    merchant: string;
    transactionDate: string;
    type: 'debit' | 'credit';
    accountName: string;
  }>;
  page: number;
  pageSize: number;
  totalCount: number;
}
