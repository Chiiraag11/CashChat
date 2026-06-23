import { NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { getSummary } from '@/services/finance/summary';

export const runtime = 'nodejs';

/** GET /api/dashboard/summary -> SummaryCardsData */
export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await getSummary(userId);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/dashboard/summary failed:', err);
    return NextResponse.json({ error: 'Failed to load summary.' }, { status: 500 });
  }
}
