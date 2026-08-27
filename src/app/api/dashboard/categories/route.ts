import { NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { getCategoryBreakdown } from '@/services/finance/categories';

export const runtime = 'nodejs';

/** GET /api/dashboard/categories -> CategoryBreakdownItem[] */
export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await getCategoryBreakdown(userId);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/dashboard/categories failed:', err);
    return NextResponse.json({ error: 'Failed to load category breakdown.' }, { status: 500 });
  }
}
