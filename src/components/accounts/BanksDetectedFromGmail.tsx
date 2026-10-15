
'use client';

import { useCallback, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

import { useSession } from 'next-auth/react';

type Bank = {
  name: string;
  emailCount: number;
  lastSeen: string;
  samples: {
    subject: string;
    from: string;
    date: string;
  }[];
};

const colors = [
  {
    border: 'border-emerald-500/20',
    background: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  {
    border: 'border-violet-500/20',
    background: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
  {
    border: 'border-cyan-500/20',
    background: 'bg-cyan-500/10',
    text: 'text-cyan-400',
  },
];

function formatDate(value: string) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function BanksDetectedFromGmail() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [emailsScanned, setEmailsScanned] = useState(0);

  const { data: session, status } = useSession();

const cacheKey = session?.user?.email
  ? `cashchat:banks:${session.user.email}`
  : null;

useEffect(() => {
  if (!cacheKey) return;

  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return;

  try {
    const data = JSON.parse(cached);

    setBanks(data.banks ?? []);
    setEmailsScanned(data.emailsScanned ?? 0);
    setScanned(true);
  } catch {
    sessionStorage.removeItem(cacheKey);
  }
}, [cacheKey]);

  
const scanBanks = useCallback(async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/banks-detected', {
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Could not scan Gmail.');
    }

    const result = {
  banks: data.banks ?? [],
  emailsScanned: data.emailsScanned ?? 0,
};

setBanks(result.banks);
setEmailsScanned(result.emailsScanned);
setScanned(true);

if (cacheKey) {
  sessionStorage.setItem(cacheKey, JSON.stringify(result));
}
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Something went wrong.',
    );
  } finally {
    setLoading(false);
  }
}, [cacheKey]);


useEffect(() => {
  if (status !== 'authenticated' || !cacheKey) return;

  const params = new URLSearchParams(window.location.search);

  if (params.get('scanBanks') === '1') {
    window.history.replaceState({}, '', '/accounts');
    void scanBanks();
    return;
  }

  if (!sessionStorage.getItem(cacheKey)) {
    void scanBanks();
  }
}, [status, cacheKey, scanBanks]);


  function connectGmail() {
    void signIn(
      'google',
      { callbackUrl: '/accounts?scanBanks=1' },
      {
        scope:
          'openid email profile https://www.googleapis.com/auth/gmail.readonly',
        access_type: 'offline',
        prompt: 'consent',
      },
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            <Building2 className="h-3.5 w-3.5" />
            EMAIL INTELLIGENCE
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            Banks detected in Gmail
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Discover banks mentioned in your banking notifications and statements.
          </p>
        </div>

        <button
          onClick={() => void scanBanks()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}

          {loading
            ? 'Scanning emails…'
            : scanned
              ? 'Scan again'
              : 'Detect banks from Gmail'}
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-xs leading-5 text-muted-foreground">
          Detected from email only—not verified bank accounts. A bank may
          appear because it sent a notification; this does not confirm a
          currently open or linked account.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">
            Unable to detect banks
          </p>
          <p className="mt-1 text-muted-foreground">{error}</p>
          <button
            onClick={connectGmail}
            className="mt-2 text-primary underline underline-offset-4"
          >
            Reconnect Gmail
          </button>
        </div>
      )}

      {scanned && !error && (
        <p className="text-xs text-muted-foreground">
          Reviewed up to {emailsScanned} matching email messages.
        </p>
      )}

      {scanned && !loading && !error && banks.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-card/50 px-5 py-10 text-center">
          <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No banks detected yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            No recognized bank names were found in the matching emails.
            This does not mean you do not have bank accounts.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {banks.map((bank, index) => {
          const color = colors[index % colors.length]!;

          return (
            <article
              key={bank.name}
              className={`group relative overflow-hidden rounded-2xl border ${color.border} bg-gradient-to-br from-card via-card to-violet-500/[0.06] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/10`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${color.border} ${color.background}`}
                >
                  <Building2 className={`h-6 w-6 ${color.text}`} />
                </div>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-400">
                  Unverified
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">{bank.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Mentioned in {bank.emailCount}{' '}
                {bank.emailCount === 1 ? 'email' : 'emails'}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                Latest detected email: {formatDate(bank.lastSeen)}
              </div>

              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Recent evidence
                </p>

                {bank.samples.slice(0, 2).map((sample, sampleIndex) => (
                  <div key={`${sample.subject}-${sampleIndex}`} className="mt-3">
                    <p className="break-words text-sm font-medium">
                      {sample.subject}
                    </p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {sample.from}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(sample.date)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Found in Gmail notifications
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
