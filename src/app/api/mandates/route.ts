
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type GmailHeader = {
  name: string;
  value: string;
};

type GmailPart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
  headers?: GmailHeader[];
};

type GmailMessage = {
  id: string;
  snippet?: string;
  payload?: GmailPart;
};

type MandateResult = {
  id: string;
  subject: string;
  from: string;
  date: string;
  amount: string | null;
  frequency: string | null;
};

function getHeader(
  payload: GmailPart | undefined,
  name: string,
): string {
  return (
    payload?.headers?.find(
      (header) => header.name.toLowerCase() === name.toLowerCase(),
    )?.value ?? ''
  );
}

function readBody(
  part: GmailPart | undefined,
  mimeType: 'text/plain' | 'text/html',
): string {
  if (!part) return '';

  if (part.mimeType === mimeType && part.body?.data) {
    const decoded = Buffer.from(part.body.data, 'base64url').toString('utf8');

    return mimeType === 'text/html'
      ? decoded
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<[^>]*>/g, ' ')
          .replace(/&nbsp;/gi, ' ')
      : decoded;
  }

  for (const child of part.parts ?? []) {
    const result = readBody(child, mimeType);
    if (result) return result;
  }

  return '';
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: 'Please sign in before checking mandates.' },
      { status: 401 },
    );
  }

  let accessToken = token.googleAccessToken;

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          'Gmail is not connected yet. Select "Connect Gmail & Scan" to grant read-only access.',
      },
      { status: 409 },
    );
  }

  const expiresAt = token.googleAccessTokenExpiresAt;

  if (expiresAt && expiresAt <= Date.now() + 60_000) {
    if (!token.googleRefreshToken) {
      return NextResponse.json(
        { error: 'Gmail access expired. Connect Gmail again to continue.' },
        { status: 401 },
      );
    }

    const refreshed = await refreshAccessToken(token.googleRefreshToken);

    if (!refreshed) {
      return NextResponse.json(
        { error: 'Could not refresh Gmail access. Please connect Gmail again.' },
        { status: 401 },
      );
    }

    accessToken = refreshed;
  }

  const query = new URL(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages',
  );
  query.searchParams.set(
    'q',
    '{ "UPI mandate" "UPI AutoPay" autopay "mandate created" "mandate registered" "e-mandate" "recurring payment" }',
  );
  query.searchParams.set('maxResults', '30');

  const headers = { Authorization: `Bearer ${accessToken}` };

  const listResponse = await fetch(query, {
    headers,
    cache: 'no-store',
  });

  if (!listResponse.ok) {
    return NextResponse.json(
      {
        error:
          listResponse.status === 401 || listResponse.status === 403
            ? 'Gmail permission is missing or expired. Select "Connect Gmail & Scan" and grant read-only access.'
            : 'Gmail could not be searched. Please try again.',
      },
      { status: listResponse.status === 401 ? 401 : 502 },
    );
  }

  const listData = (await listResponse.json()) as {
    messages?: Array<{ id: string }>;
  };

  const messages = (listData.messages ?? []).slice(0, 30);

  const scanned = await Promise.all(
    messages.map(async ({ id }): Promise<MandateResult | null> => {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}?format=full`,
        { headers, cache: 'no-store' },
      );

      if (!response.ok) return null;

      const message = (await response.json()) as GmailMessage;
      const payload = message.payload;

      const subject = getHeader(payload, 'Subject') || '(No subject)';
      const from = getHeader(payload, 'From') || 'Unknown sender';
      const date = getHeader(payload, 'Date');
      const body =
        readBody(payload, 'text/plain') ||
        readBody(payload, 'text/html');

      const text = `${subject}\n${message.snippet ?? ''}\n${body}`
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ');

      if (
        !/(mandate|autopay|auto[\s-]?pay|e-mandate|recurring payment|standing instruction)/i.test(
          text,
        )
      ) {
        return null;
      }

      const amountMatch = text.match(
        /(?:₹\s*|INR\s*|Rs\.?\s*)([\d,]+(?:\.\d{1,2})?)/i,
      );
      const frequencyMatch = text.match(
        /\b(daily|weekly|monthly|quarterly|half-yearly|yearly|annually|every\s+(?:day|week|month|quarter|year))\b/i,
      );

      return {
        id,
        subject,
        from,
        date,
        amount: amountMatch ? `₹${amountMatch[1]}` : null,
        frequency: frequencyMatch?.[1] ?? null,
      };
    }),
  );

  return NextResponse.json(
    {
      mandates: scanned.filter(
        (item): item is MandateResult => item !== null,
      ),
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
