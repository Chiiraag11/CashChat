import { prisma } from '@/lib/prisma';
import {
  AccountType,
  TransactionCategory,
  TransactionType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

type Category =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Shopping'
  | 'Health';

const MERCHANTS_BY_CATEGORY: Record<Category, string[]> = {
  Food: ['Swiggy', 'Zomato', 'Starbucks', "Domino's Pizza", 'Cafe Coffee Day'],
  Transport: [
    'Uber',
    'Ola',
    'Rapido',
    'Indian Oil Petrol Pump',
    'Metro Card Recharge',
  ],
  Entertainment: [
    'Netflix',
    'Spotify',
    'PVR Cinemas',
    'Amazon Prime Video',
    'BookMyShow',
  ],
  Utilities: [
    'Airtel',
    'Jio',
    'Tata Power',
    'Mahanagar Gas',
    'BSES Electricity',
  ],
  Shopping: ['Amazon', 'Flipkart', 'Myntra', 'Decathlon', 'IKEA'],
  Health: [
    'Apollo Pharmacy',
    'PharmEasy',
    'Practo',
    'Cult.fit',
    'Fortis Hospital',
  ],
};

const AMOUNT_RANGE_BY_CATEGORY: Record<Category, [number, number]> = {
  Food: [150, 2500],
  Transport: [80, 1200],
  Entertainment: [199, 1500],
  Utilities: [300, 3500],
  Shopping: [500, 12000],
  Health: [200, 6000],
};

const CATEGORIES = Object.keys(
  MERCHANTS_BY_CATEGORY,
) as Category[];

function randomDateWithinLastMonths(months: number): Date {
  const now = new Date();
  const past = new Date();

  past.setMonth(now.getMonth() - months);

  return faker.date.between({
    from: past,
    to: now,
  });
}

export async function createDemoData(userId: string) {
  const existingAccounts = await prisma.financeAccount.count({
    where: { userId },
  });

  // Prevent duplicate data
  if (existingAccounts > 0) return;

  const checking = await prisma.financeAccount.create({
    data: {
      userId,
      name: 'Primary Checking',
      type: AccountType.checking,
      balance: 0,
    },
  });

  const savings = await prisma.financeAccount.create({
    data: {
      userId,
      name: 'High-Yield Savings',
      type: AccountType.savings,
      balance: 0,
    },
  });

  const accounts = [checking, savings];

  const incomeRows: Array<{
    accountId: string;
    amount: number;
    category: TransactionCategory;
    merchant: string;
    transactionDate: Date;
    type: TransactionType;
  }> = [];

  for (let m = 0; m < 6; m++) {
    const date = new Date();

    date.setMonth(date.getMonth() - m);
    date.setDate(1);

    incomeRows.push({
      accountId: checking.id,
      amount: faker.number.int({
        min: 65000,
        max: 95000,
      }),
      category: TransactionCategory.Income,
      merchant: 'Employer Payroll',
      transactionDate: date,
      type: TransactionType.credit,
    });
  }

  const expenseRows: Array<{
    accountId: string;
    amount: number;
    category: TransactionCategory;
    merchant: string;
    transactionDate: Date;
    type: TransactionType;
  }> = [];

  const TOTAL_EXPENSE_TXNS = 520;

  for (let i = 0; i < TOTAL_EXPENSE_TXNS; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES);

    const merchant = faker.helpers.arrayElement(
      MERCHANTS_BY_CATEGORY[category],
    );

    const [min, max] =
      AMOUNT_RANGE_BY_CATEGORY[category];

    const account = faker.helpers.arrayElement(accounts);

    expenseRows.push({
      accountId: account.id,
      amount: faker.number.float({
        min,
        max,
        fractionDigits: 2,
      }),
      category: TransactionCategory[category],
      merchant,
      transactionDate: randomDateWithinLastMonths(6),
      type: TransactionType.debit,
    });
  }

  const allRows = [...incomeRows, ...expenseRows];

  await prisma.transaction.createMany({
    data: allRows,
  });

  for (const account of accounts) {
    const txns = allRows.filter(
      (t) => t.accountId === account.id,
    );

    const balance = txns.reduce(
      (sum, t) =>
        sum +
        (t.type === TransactionType.credit
          ? t.amount
          : -t.amount),
      0,
    );

    await prisma.financeAccount.update({
      where: {
        id: account.id,
      },
      data: {
        balance,
      },
    });
  }

  console.log(
    `Created demo data for user ${userId}`,
  );
}