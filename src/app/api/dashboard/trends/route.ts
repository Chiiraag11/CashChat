import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { getMonthlyTrend } from '@/services/finance/trends';

export const runtime = 'nodejs';

/** GET /api/dashboard/trends?months=6 -> MonthlyTrendItem[] */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const months = Number(req.nextUrl.searchParams.get('months')) || 6;
    const data = await getMonthlyTrend(userId, Math.min(Math.max(months, 1), 24));
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/dashboard/trends failed:', err);
    return NextResponse.json({ error: 'Failed to load monthly trend.' }, { status: 500 });
  }
}
