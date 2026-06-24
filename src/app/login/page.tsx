'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#05070A] text-white lg:flex-row">
      {/* Aurora glow background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-emerald-500/20 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[-10rem] top-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-3xl animate-[pulse_11s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl animate-[pulse_13s_ease-in-out_infinite]" />

      {/* Subtle dot/grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]" />

      {/* LEFT: brand / product story */}
      <section className="relative z-10 flex w-full flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-violet-500 shadow-[0_0_20px_-2px_rgba(0,200,150,0.6)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                <path
                  d="M12 2.5l1.8 5.6 5.7 1.9-5.7 1.9L12 17.5l-1.8-5.6-5.7-1.9 5.7-1.9L12 2.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">CashChat</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Ask your money
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
              anything.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
            CashChat reads your spending, income, and accounts, then answers in
            plain English — no spreadsheets, no dashboards to learn, no
            formulas to remember.
          </p>

          {/* Feature highlights */}
          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-white">
                  Natural language finance queries
                </p>
                <p className="mt-0.5 text-sm text-white/50">
                  Type a question the way you&apos;d ask a person — get a real answer back.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <path
                    d="M4 19V5M4 19h16M9 19v-6M14 19V9M19 19v-9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-white">Smart analytics</p>
                <p className="mt-0.5 text-sm text-white/50">
                  Spending patterns, forecasts, and anomalies surfaced automatically.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <path
                    d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-white">Secure &amp; private</p>
                <p className="mt-0.5 text-sm text-white/50">
                  Bank-grade encryption. Nothing is shared, nothing is sold.
                </p>
              </div>
            </li>
          </ul>

          {/* Dashboard preview mockup */}
          <div className="mt-12 hidden max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:block">
            <div className="flex items-center gap-1.5 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-2 text-xs text-white/30">finchat.ai/dashboard</span>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-3">
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm bg-white/10 px-3.5 py-2 text-sm text-white/90">
                  What&apos;s my runway this quarter?
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-[10px] font-bold">
                  AI
                </span>
                <div className="max-w-[80%] rounded-xl rounded-tl-sm border border-white/5 bg-white/[0.04] px-3.5 py-2.5">
                  <p className="text-sm text-white/80">
                    You have <span className="font-medium text-emerald-300">7.4 months</span> of
                    runway. Spend dropped 12% in May.
                  </p>
                  <svg viewBox="0 0 160 36" className="mt-2 h-9 w-full text-emerald-400">
                    <polyline
                      points="0,28 20,24 40,26 60,16 80,18 100,10 120,12 140,4 160,6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-2 inline-flex items-center rounded-full bg-violet-400/15 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                    +12% saved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: login card */}
      <section className="relative z-10 flex w-full flex-1 items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-violet-400/70" />

          <div className="mb-8 text-center">
            <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Welcome back
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              Sign in to CashChat
            </h2>
            <p className="mt-1.5 text-sm text-white/50">
              Ask your money anything, anytime.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                <path
                  fill="#4285F4"
                  d="M23.04 12.27c0-.8-.07-1.57-.2-2.32H12v4.39h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.71c2.18-2 3.43-4.96 3.43-8.45z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.93 0 5.39-.97 7.18-2.62l-3.7-2.9c-1.03.7-2.36 1.1-3.48 1.1-2.67 0-4.93-1.8-5.74-4.23H2.43v2.98A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.26 14.35a6.6 6.6 0 0 1 0-4.7V6.67H2.43a11 11 0 0 0 0 9.66z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.6 0 2.8.55 3.66 1.39l3.27-3.27C16.79 1.7 14.6.7 12 .7 7.7.7 4.02 3.13 2.43 6.67l3.83 2.98C7.07 7.18 9.33 5.38 12 5.38z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-white">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.41-1.26.74-1.55-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.42.36.78 1.07.78 2.17v3.22c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-white/35">
            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
              <path
                d="M6 10V7a6 6 0 1 1 12 0v3M5 10h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Encrypted sign-in, no passwords stored</span>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-white/35">
            By continuing you agree this is a demo app — don&apos;t connect real
            financial accounts.
          </p>
        </div>
      </section>
    </main>
  );
}