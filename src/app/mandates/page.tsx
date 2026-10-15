
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { signIn , useSession } from 'next-auth/react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';

type Mandate = {
  id: string;
  subject: string;
  from: string;
  date: string;
  amount: string | null;
  frequency: string | null;
};

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

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

function getMerchant(subject: string) {
  return subject
    .replace(/^(registration success|pre-debit alert|recurring|e-mandate)\s*[:\-]?\s*/i, '')
    .slice(0, 72);
}

export default function MandatesPage() {
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const { data: session, status } = useSession();

const cacheKey = session?.user?.email
  ? `cashchat:mandates:${session.user.email}`
  : null;

useEffect(() => {
  if (!cacheKey) return;

  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return;

  try {
    const data = JSON.parse(cached);

    setMandates(data.mandates ?? []);
    setScanned(true);
  } catch {
    sessionStorage.removeItem(cacheKey);
  }
}, [cacheKey]);

  const scanGmail = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mandates', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Could not scan Gmail.');
      }

      const results = data.mandates ?? [];

setMandates(results);
setScanned(true);

if (cacheKey) {
  sessionStorage.setItem(
    cacheKey,
    JSON.stringify({ mandates: results }),
  );
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

  if (params.get('scan') === '1') {
    window.history.replaceState({}, '', '/mandates');
    void scanGmail();
    return;
  }

  // Automatically scan only if this user's results aren't cached.
  if (!sessionStorage.getItem(cacheKey)) {
    void scanGmail();
  }
}, [status, cacheKey, scanGmail]);

  const connectGmail = () => {
    void signIn(
      'google',
      { callbackUrl: '/mandates?scan=1' },
      {
        scope: `openid email profile ${GMAIL_SCOPE}`,
        access_type: 'offline',
        prompt: 'consent',
      },
    );
  };

  const filteredMandates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return mandates;

    return mandates.filter((item) =>
      [
        item.subject,
        item.from,
        item.amount ?? '',
        item.frequency ?? '',
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [mandates, search]);

  const amountCount = mandates.filter((item) => item.amount).length;
  const frequencyCount = mandates.filter((item) => item.frequency).length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400">
            <Sparkles className="h-3.5 w-3.5" />
            CASHCHAT INTELLIGENCE
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            UPI Mandates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Find recurring-payment and UPI AutoPay notifications hidden in
            your Gmail, all in one place.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Read-only email scan
        </div>
      </section>

      {/* Informational notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

        <div>
          <p className="text-sm font-semibold">Email detections, not bank verification</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            CashChat identifies possible mandate notifications from email.
            It cannot confirm whether a mandate is currently active, cancelled,
            or due for payment. Verify its status in your UPI app or bank.
          </p>
        </div>
      </section>

      {/* Gmail connection card */}
      <section className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/10 via-[#111116] to-emerald-500/10 shadow-lg shadow-violet-950/10">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <Mail className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">
                  {scanned ? 'Gmail scan complete' : 'Scan your Gmail'}
                </h2>

                {scanned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                )}
              </div>

              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Search your mailbox for mandate registration, recurring debit,
                and AutoPay notifications. CashChat will not modify your emails
                or payment mandates.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Gmail read-only permission is required.
              </p>
            </div>
          </div>

          <button
            onClick={() => void scanGmail()}
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : scanned ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}

            {loading
  ? 'Scanning Gmail…'
  : scanned
    ? 'Scan again'
    : 'Scan Gmail'}
          </button>
        </div>
      </section>

      {/* Loading feedback */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <RefreshCw className="h-5 w-5 animate-spin text-violet-400" />
          <div>
            <p className="text-sm font-medium">Looking for mandate notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Searching matching emails. This may take a few seconds.
            </p>
          </div>
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold">Unable to scan Gmail</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={connectGmail}
              className="mt-3 text-sm font-semibold text-primary underline underline-offset-4"
            >
              Reconnect Gmail
            </button>
          </div>
        </div>
      )}

      {/* Results summary */}
      {scanned && !error && (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Emails detected */}
            <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-[#111116] p-4 shadow-sm shadow-violet-950/10 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Emails detected</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                  <Mail className="h-4 w-4 text-violet-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-violet-400">
                {mandates.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Potentially mandate-related
              </p>
            </div>

            {/* Amounts found */}
            <div className="rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-[#111116] p-4 shadow-sm shadow-emerald-950/10 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Amounts found</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <CircleDollarSign className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-emerald-400">
                {amountCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Emails containing a detectable amount
              </p>
            </div>

            {/* Frequency found */}
            <div className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-[#111116] p-4 shadow-sm shadow-cyan-950/10 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Frequency found</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                  <Clock3 className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-cyan-400">
                {frequencyCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Emails mentioning a payment interval
              </p>
            </div>
          </section>

          {/* Email results */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Detected notifications
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review each email before treating it as a current mandate.
                </p>
              </div>

              <label className="relative block w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search emails or amounts…"
                  className="h-10 w-full rounded-lg border border-violet-500/15 bg-[#111116] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                />
              </label>
            </div>

            {filteredMandates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] px-5 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                  <WalletCards className="h-6 w-6 text-violet-400" />
                </div>

                <h3 className="mt-4 font-semibold">
                  {mandates.length === 0
                    ? 'No matching emails found'
                    : 'No results match your search'}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {mandates.length === 0
                    ? 'This does not mean you have no active UPI mandates. Some banks or merchants may not send email notifications, and wording can vary.'
                    : 'Try another merchant, sender, amount, or search term.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredMandates.map((mandate) => (
                  <article
                    key={mandate.id}
                    className="group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#111116] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-[#15131d] hover:shadow-lg hover:shadow-violet-950/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                        <Mail className="h-5 w-5 text-violet-400" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold leading-6">
                          {getMerchant(mandate.subject)}
                        </h3>
                        <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                          {mandate.subject}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-400">
                        Unverified
                      </span>
                    </div>

                    <div className="my-4 border-t border-white/10" />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="min-w-0 rounded-lg border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-3">
                        <p className="text-xs text-muted-foreground">Detected amount</p>
                        <p className="mt-1 truncate text-lg font-semibold tabular-nums text-emerald-400">
                          {mandate.amount ?? 'Not found'}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-lg border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.07] to-transparent p-3">
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="mt-1 truncate text-sm font-semibold capitalize text-cyan-400">
                          {mandate.frequency ?? 'Not detected'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2">
                      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                      <p className="break-all text-xs leading-5 text-muted-foreground">
                        {mandate.from}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                      Email received: {formatDate(mandate.date)}
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2.5">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-xs leading-5 text-muted-foreground">
                        Email detected. Verify current mandate status with your bank.
                      </p>
                    </div>

                    <a
                      href="https://mail.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
                    >
                      Open Gmail
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Initial state */}
      {!scanned && !loading && !error && (
        <section className="rounded-2xl border border-dashed border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-cyan-500/[0.04] px-5 py-12 text-center md:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 shadow-sm shadow-violet-950/10">
            <Mail className="h-7 w-7 text-violet-400" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Your mandate overview starts here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Connect Gmail to find notifications about UPI AutoPay,
            recurring payments, and mandate registrations.
          </p>
        </section>
      )}

      <footer className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          Your scan uses the Gmail read-only permission.
        </span>
        <span>CashChat does not verify or change bank mandates.</span>
      </footer>
    </div>
  );
}
