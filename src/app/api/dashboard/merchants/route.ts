import { NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { getTopMerchants } from '@/services/finance/merchants';

export const runtime = 'nodejs';

/** GET /api/dashboard/merchants -> TopMerchantItem[] */
export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await getTopMerchants(userId);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/dashboard/merchants failed:', err);
    return NextResponse.json({ error: 'Failed to load top merchants.' }, { status: 500 });
  }
}
