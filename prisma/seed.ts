/**
 * FinChat seed script
 * ---------------------------------------------------------------------------
 * Creates a demo user, two accounts (checking + savings), and 500+ realistic
 * transactions spread across the last 6 months using @faker-js/faker.
 *
 * Run with: npm run db:seed   (wraps `tsx prisma/seed.ts`)
 */
import { PrismaClient, AccountType, TransactionCategory, TransactionType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Shopping' | 'Health';

// Merchant pools per category — used both for seed realism and as the
// canonical vocabulary the NL->SQL prompt is allowed to reference.
const MERCHANTS_BY_CATEGORY: Record<Category, string[]> = {
  Food: ['Swiggy', 'Zomato', 'Starbucks', "Domino's Pizza", 'Cafe Coffee Day'],
  Transport: ['Uber', 'Ola', 'Rapido', 'Indian Oil Petrol Pump', 'Metro Card Recharge'],
  Entertainment: ['Netflix', 'Spotify', 'PVR Cinemas', 'Amazon Prime Video', 'BookMyShow'],
  Utilities: ['Airtel', 'Jio', 'Tata Power', 'Mahanagar Gas', 'BSES Electricity'],
  Shopping: ['Amazon', 'Flipkart', 'Myntra', 'Decathlon', 'IKEA'],
  Health: ['Apollo Pharmacy', 'PharmEasy', 'Practo', 'Cult.fit', 'Fortis Hospital'],
};

// Typical amount ranges (INR) per category, used to keep generated data
// statistically plausible for charts/aggregations rather than pure noise.
const AMOUNT_RANGE_BY_CATEGORY: Record<Category, [number, number]> = {
  Food: [150, 2500],
  Transport: [80, 1200],
  Entertainment: [199, 1500],
  Utilities: [300, 3500],
  Shopping: [500, 12000],
  Health: [200, 6000],
};

const CATEGORIES = Object.keys(MERCHANTS_BY_CATEGORY) as Category[];

function randomDateWithinLastMonths(months: number): Date {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);
  return faker.date.between({ from: past, to: now });
}

async function main() {
  console.log('Seeding FinChat database...');

  // Reset in dependency order (children first).
  await prisma.transaction.deleteMany();

await prisma.financeAccount.deleteMany();

await prisma.session.deleteMany();

await prisma.financeAccount.deleteMany();

await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@finchat.app',
      image: faker.image.avatarGitHub(),
    },
  });

  const checking = await prisma.financeAccount.create({
    data: { userId: user.id, name: 'Primary Checking', type: AccountType.checking, balance: 0 },
  });

  const savings = await prisma.financeAccount.create({
    data: { userId: user.id, name: 'High-Yield Savings', type: AccountType.savings, balance: 0 },
  });

  const accounts = [checking, savings];

  // --- Monthly salary credits (income), 6 months, into checking ---
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
      amount: faker.number.int({ min: 65000, max: 95000 }),
      category: TransactionCategory.Income,
      merchant: 'Employer Payroll',
      transactionDate: date,
      type: TransactionType.credit,
    });
  }

  // --- Expense transactions: 500+ across 6 categories, 6 months ---
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
    const merchant = faker.helpers.arrayElement(MERCHANTS_BY_CATEGORY[category]);
    const [min, max] = AMOUNT_RANGE_BY_CATEGORY[category];
    const account = faker.helpers.arrayElement(accounts);

    expenseRows.push({
      accountId: account.id,
      amount: faker.number.float({ min, max, fractionDigits: 2 }),
      category: TransactionCategory[category],
      merchant,
      transactionDate: randomDateWithinLastMonths(6),
      type: TransactionType.debit,
    });
  }

  const allRows = [...incomeRows, ...expenseRows];

  // createMany is a single round trip; far cheaper than 500+ sequential creates.
  await prisma.transaction.createMany({ data: allRows });

  // Backfill account balances = sum(credits) - sum(debits) per account.
  for (const account of accounts) {
    const txns = allRows.filter((r) => r.accountId === account.id);
    const balance = txns.reduce(
      (sum, t) => sum + (t.type === TransactionType.credit ? t.amount : -t.amount),
      0,
    );
    await prisma.financeAccount.update({ where: { id: account.id }, data: { balance } });
  }

  console.log(`Seeded user ${user.email}`);
  console.log(`Seeded ${allRows.length} transactions across ${accounts.length} accounts.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
