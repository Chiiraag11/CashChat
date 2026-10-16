'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, BarChart3, Code2, Loader2, Lock, MessageSquare, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const FEATURES = [
  { icon: MessageSquare, tone: 'emerald', title: 'Natural language finance queries', body: 'Type a question the way you’d ask a person — get a real answer back.' },
  { icon: BarChart3, tone: 'violet', title: 'Smart analytics', body: 'Spending patterns, categories and top merchants surfaced automatically.' },
  { icon: ShieldCheck, tone: 'emerald', title: 'Secure & private', body: 'OAuth sign-in with no passwords stored, and read-only email access.' },
] as const;

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: 'That email is already linked to a different sign-in method. Try the provider you used originally.',
  AccessDenied: 'Access was denied. Please try again.',
  Callback: 'We couldn’t complete sign-in. Please try again.',
  OAuthCallback: 'We couldn’t complete sign-in. Please try again.',
  OAuthSignin: 'We couldn’t start sign-in. Please try again.',
  Configuration: 'Sign-in isn’t configured correctly right now.',
};

function ErrorBanner() {
  const params = useSearchParams();
  const code = params?.get('error');
  if (!code) return null;
  return (
    <div
      role="alert"
      style={{
        display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', marginBottom: 16, borderRadius: 12,
        background: 'var(--red-dim)', border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)', color: 'var(--text-1)', fontSize: 12, lineHeight: 1.5,
      }}
    >
      <ShieldAlert size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 1 }} />
      <span>{AUTH_ERRORS[code] ?? 'Something went wrong while signing in. Please try again.'}</span>
    </div>
  );
}

export default function LoginPage() {
  const [pending, setPending] = useState<'google' | 'github' | null>(null);

  const start = (provider: 'google' | 'github') => {
    setPending(provider);
    void signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden lg:flex-row" style={{ background: 'var(--bg)' }}>
      <div className="aurora" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={15} /> Home
        </Link>
        <ThemeToggle />
      </div>

      {/* LEFT: brand / product story */}
      <section className="relative z-10 hidden flex-1 flex-col justify-center px-10 py-20 lg:flex xl:px-20">
        <div className="w-full max-w-xl">
          <Logo size={36} text={18} />

          <h1 className="mt-10 text-5xl font-bold leading-[1.06] text-foreground" style={{ letterSpacing: '-0.035em' }}>
            Ask your money
            <br />
            <span className="gradient-text">anything.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            CashChat reads your spending, income, and accounts, then answers in plain English — no spreadsheets, no dashboards to learn, no formulas to remember.
          </p>

          <ul className="mt-9 space-y-5">
            {FEATURES.map(({ icon: Icon, tone, title, body }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: tone === 'emerald' ? 'var(--emerald-dim)' : 'var(--violet-dim)',
                    color: tone === 'emerald' ? 'var(--emerald)' : 'var(--violet-text)',
                  }}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Preview */}
          <div className="mt-10 max-w-md rounded-2xl border border-border p-4" style={{ background: 'var(--glass)', backdropFilter: 'blur(14px)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
              <span className="ml-2 text-xs text-muted-foreground">sample conversation</span>
            </div>
            <div className="space-y-3 border-t border-border pt-3">
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm px-3.5 py-2 text-sm text-foreground" style={{ background: 'var(--surface-3)' }}>
                  What’s my biggest expense category?
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                  <Zap size={12} color="#fff" strokeWidth={2.5} />
                </span>
                <div className="rounded-xl rounded-tl-sm border border-border px-3.5 py-2.5" style={{ background: 'var(--surface)' }}>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold" style={{ color: 'var(--emerald)' }}>Shopping</span> leads at 31% of spend this year.
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Code2 size={12} /> View generated SQL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: sign-in card */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-24 sm:px-10">
        <div
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border p-8 sm:p-10"
          style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, var(--emerald), var(--violet))' }} />

          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center lg:hidden">
              <Logo size={34} text={17} />
            </div>
            <span className="badge badge-emerald">Welcome back</span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.025em' }}>
              Sign in to CashChat
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Ask your money anything, anytime.</p>
          </div>

          <Suspense fallback={null}>
            <ErrorBanner />
          </Suspense>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => start('google')}
              disabled={pending !== null}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-strong)] px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: '#ffffff', color: '#1f2937' }}
            >
              {pending === 'google' ? (
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
                  <path fill="#4285F4" d="M23.04 12.27c0-.8-.07-1.57-.2-2.32H12v4.39h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.71c2.18-2 3.43-4.96 3.43-8.45z" />
                  <path fill="#34A853" d="M12 23c2.93 0 5.39-.97 7.18-2.62l-3.7-2.9c-1.03.7-2.36 1.1-3.48 1.1-2.67 0-4.93-1.8-5.74-4.23H2.43v2.98A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M6.26 14.35a6.6 6.6 0 0 1 0-4.7V6.67H2.43a11 11 0 0 0 0 9.66z" />
                  <path fill="#EA4335" d="M12 5.38c1.6 0 2.8.55 3.66 1.39l3.27-3.27C16.79 1.7 14.6.7 12 .7 7.7.7 4.02 3.13 2.43 6.67l3.83 2.98C7.07 7.18 9.33 5.38 12 5.38z" />
                </svg>
              )}
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => start('github')}
              disabled={pending !== null}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-strong)] bg-muted px-4 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending === 'github' ? (
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.41-1.26.74-1.55-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.42.36.78 1.07.78 2.17v3.22c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              )}
              Continue with GitHub
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock size={12} />
            <span>Encrypted sign-in, no passwords stored</span>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing you agree this is a demo app — don&apos;t connect real financial accounts.
          </p>
        </div>
      </section>
    </main>
  );
}
