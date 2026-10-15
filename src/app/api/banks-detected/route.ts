
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GMAIL_SCOPE =
  'https://www.googleapis.com/auth/gmail.readonly';

type GmailHeader = {
  name: string;
  value: string;
};

type GmailMessage = {
  id: string;
  snippet?: string;
  payload?: {
    headers?: GmailHeader[];
  };
};

type DetectedBank = {
  name: string;
  emailCount: number;
  lastSeen: string;
  samples: {
    subject: string;
    from: string;
    date: string;
  }[];
};

const BANKS: { name: string; pattern: RegExp }[] = [
  { name: 'SBI Card', pattern: /\bsbi\s*card\b|sbicard\.com/i },
  { name: 'State Bank of India', pattern: /\bstate bank of india\b|\bsbi\b/i },
  { name: 'HDFC Bank', pattern: /\bhdfc\b/i },
  { name: 'ICICI Bank', pattern: /\bicici\b/i },
  { name: 'Axis Bank', pattern: /\baxis bank\b/i },
  { name: 'Kotak Mahindra Bank', pattern: /\bkotak\b/i },
  { name: 'Punjab National Bank', pattern: /\bpnb\b|punjab national bank/i },
  { name: 'Bank of Baroda', pattern: /\bbank of baroda\b|\bbob\b/i },
  { name: 'Canara Bank', pattern: /\bcanara bank\b/i },
  { name: 'Union Bank of India', pattern: /\bunion bank of india\b/i },
  { name: 'IDFC FIRST Bank', pattern: /\bidfc\b/i },
  { name: 'IndusInd Bank', pattern: /\bindusind\b/i },
  { name: 'YES BANK', pattern: /\byes bank\b/i },
  { name: 'Federal Bank', pattern: /\bfederal bank\b/i },
  { name: 'AU Small Finance Bank', pattern: /\bau small finance\b|\baubank\b/i },
  { name: 'Bank of India', pattern: /\bbank of india\b/i },
  { name: 'Indian Bank', pattern: /\bindian bank\b/i },
  { name: 'Central Bank of India', pattern: /\bcentral bank of india\b/i },
  { name: 'Indian Overseas Bank', pattern: /\bindian overseas bank\b/i },
  { name: 'HSBC', pattern: /\bhsbc\b/i },
  { name: 'Standard Chartered', pattern: /\bstandard chartered\b/i },
  { name: 'Paytm Payments Bank', pattern: /\bpaytm payments bank\b/i },
  { name: 'Airtel Payments Bank', pattern: /\bairtel payments bank\b/i },
];

function headerValue(
  headers: GmailHeader[] | undefined,
  name: string,
): string {
  return (
    headers?.find(
      (header) => header.name.toLowerCase() === name.toLowerCase(),
    )?.value ?? ''
  );
}

async function refreshGoogleToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    access_token?: string;
  };

  return data.access_token ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Please sign in first.' },
        { status: 401 },
      );
    }

    const scopes = (token.googleScope ?? '').split(/\s+/);

    let accessToken = token.googleAccessToken;

    if (!accessToken || !scopes.includes(GMAIL_SCOPE)) {
      return NextResponse.json(
        {
          error:
            'Gmail is not connected. Use Connect Gmail & Scan to grant read-only access.',
        },
        { status: 409 },
      );
    }

    if (
      token.googleAccessTokenExpiresAt &&
      token.googleAccessTokenExpiresAt <= Date.now() + 60_000
    ) {
      if (!token.googleRefreshToken) {
        return NextResponse.json(
          { error: 'Reconnect Gmail to continue.' },
          { status: 401 },
        );
      }

      const refreshed = await refreshGoogleToken(
        token.googleRefreshToken,
      );

      if (!refreshed) {
        return NextResponse.json(
          { error: 'Gmail access expired. Please reconnect Gmail.' },
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
      '{ "bank statement" "account statement" "transaction alert" "debit alert" "credit alert" "salary credited" "account opened" "bank account" }',
    );
    query.searchParams.set('maxResults', '100');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const listResponse = await fetch(query, {
      headers,
      cache: 'no-store',
    });

    if (!listResponse.ok) {
      return NextResponse.json(
        {
          error:
            'Could not read Gmail. Check your Gmail permission and try reconnecting.',
        },
        { status: listResponse.status === 401 ? 401 : 502 },
      );
    }

    const listData = (await listResponse.json()) as {
      messages?: { id: string }[];
    };

    const messageIds = (listData.messages ?? []).slice(0, 100);

    const messages = await Promise.all(
      messageIds.map(async ({ id }): Promise<GmailMessage | null> => {
        const url = new URL(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}`,
        );

        url.searchParams.set('format', 'metadata');
        url.searchParams.append('metadataHeaders', 'From');
        url.searchParams.append('metadataHeaders', 'Subject');
        url.searchParams.append('metadataHeaders', 'Date');

        const response = await fetch(url, {
          headers,
          cache: 'no-store',
        });

        if (!response.ok) return null;

        return (await response.json()) as GmailMessage;
      }),
    );

    const bankMap = new Map<string, DetectedBank>();

    for (const message of messages) {
      if (!message?.payload) continue;

      const from = headerValue(message.payload.headers, 'From');
      const subject =
        headerValue(message.payload.headers, 'Subject') || '(No subject)';
      const date = headerValue(message.payload.headers, 'Date');

      const searchableText = `${from} ${subject} ${message.snippet ?? ''}`;

      const bank = BANKS.find(({ pattern }) =>
        pattern.test(searchableText),
      );

      if (!bank) continue;

      const existing = bankMap.get(bank.name);

      if (existing) {
        existing.emailCount += 1;

        const existingTime = Date.parse(existing.lastSeen);
        const newTime = Date.parse(date);

        if (
          !Number.isNaN(newTime) &&
          (Number.isNaN(existingTime) || newTime > existingTime)
        ) {
          existing.lastSeen = date;
        }

        if (existing.samples.length < 3) {
          existing.samples.push({ subject, from, date });
        }
      } else {
        bankMap.set(bank.name, {
          name: bank.name,
          emailCount: 1,
          lastSeen: date,
          samples: [{ subject, from, date }],
        });
      }
    }

    const banks = [...bankMap.values()].sort(
      (a, b) => b.emailCount - a.emailCount,
    );

    return NextResponse.json(
      {
        banks,
        emailsScanned: messages.filter(Boolean).length,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to scan bank-related emails right now.' },
      { status: 500 },
    );
  }
}
