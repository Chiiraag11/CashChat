import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { paginationQuerySchema } from '@/lib/validators/chat';
import { getPaginatedTransactions } from '@/services/finance/transactions';

export const runtime = 'nodejs';

/** GET /api/dashboard/transactions?page=1&pageSize=20 -> PaginatedTransactions */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const parsed = paginationQuerySchema.safeParse({
      page: req.nextUrl.searchParams.get('page') ?? undefined,
      pageSize: req.nextUrl.searchParams.get('pageSize') ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }
    const data = await getPaginatedTransactions(userId, parsed.data.page, parsed.data.pageSize);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/dashboard/transactions failed:', err);
    return NextResponse.json({ error: 'Failed to load transactions.' }, { status: 500 });
  }
}
