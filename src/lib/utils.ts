import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createHash } from 'crypto';

/** Merge Tailwind class names safely (used by shadcn-style UI primitives). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic cache key for a (userId, question) pair used by the Redis layer. */
export function hashQuestion(userId: string, question: string): string {
  const normalized = question.trim().toLowerCase().replace(/\s+/g, ' ');
  return `chat:${createHash('sha256').update(`${userId}::${normalized}`).digest('hex')}`;
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
