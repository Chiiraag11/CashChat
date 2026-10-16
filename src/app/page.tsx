import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Code2,
  Mail,
  MessageSquare,
  Moon,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

/** Landing route: signed-in users go to the dashboard, everyone else sees the product page. */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden', background: 'var(--bg)' }}>
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Trust />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function LandingNav() {
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg) 78%, transparent)', backdropFilter: 'blur(14px)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" style={{ textDecoration: 'none' }} aria-label="CashChat home">
          <Logo size={32} text={16} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {[
            ['Features', '#features'],
            ['How it works', '#how'],
            ['Security', '#security'],
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground" style={{ textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted sm:inline-flex"
            style={{ textDecoration: 'none' }}
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{ textDecoration: 'none', boxShadow: 'var(--shadow-emerald)' }}
          >
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ position: 'relative' }}>
      <div className="aurora" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <div>
          <span
            className="reveal reveal-1 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
            style={{ border: '1px solid color-mix(in srgb, var(--emerald) 30%, transparent)', background: 'var(--emerald-dim)', color: 'var(--emerald)' }}
          >
            <Sparkles size={13} /> AI-powered personal finance
          </span>

          <h1 className="reveal reveal-2 mt-6 text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl" style={{ letterSpacing: '-0.035em' }}>
            Ask your money
            <br />
            <span className="gradient-text">anything.</span>
          </h1>

          <p className="reveal reveal-3 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            CashChat turns your transactions into answers. Type a question in plain English and get a real number back — with
            the chart, the table, and the exact SQL behind it. No spreadsheets, no formulas.
          </p>

          <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="bg-brand inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition hover:opacity-90"
              style={{ textDecoration: 'none', boxShadow: 'var(--shadow-emerald)' }}
            >
              Start asking <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-[var(--border-strong)]"
              style={{ textDecoration: 'none' }}
            >
              See how it works
            </a>
          </div>

          <ul className="reveal reveal-4 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['Sign in with Google or GitHub', 'No passwords stored', 'Comes with sample data'].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

/** Illustrative product preview. Figures are sample values, labelled as such. */
function ProductPreview() {
  const bars = [38, 52, 44, 66, 58, 80, 72];
  return (
    <div className="reveal reveal-3 relative mx-auto w-full max-w-[520px]">
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: '-8% -6%', borderRadius: 40, background: 'radial-gradient(60% 60% at 50% 40%, var(--aurora-a), transparent 70%)', filter: 'blur(20px)' }}
      />
      <div
        className="animate-float relative overflow-hidden rounded-2xl border border-border"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" style={{ background: 'var(--surface-2)' }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--surface-3)' }} />
          <span className="ml-3 text-xs text-muted-foreground">cashchat · Ask</span>
          <span className="badge badge-violet ml-auto">Sample</span>
        </div>

        <div className="space-y-4 p-5">
          {/* user question */}
          <div className="flex justify-end">
            <div className="bg-brand max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm font-medium">
              How much did I spend on food last month?
            </div>
          </div>

          {/* answer */}
          <div className="flex items-start gap-3">
            <span className="bg-brand mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              <Zap size={14} color="#fff" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border p-4" style={{ background: 'var(--bg-subtle)' }}>
              <p className="text-sm leading-relaxed text-foreground">
                You spent <span className="fig font-bold" style={{ color: 'var(--emerald)' }}>₹12,480</span> on food — about 8% less than the month before.
              </p>

              {/* mini chart */}
              <div className="mt-4 flex h-24 items-end gap-2 rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: i === bars.length - 1 ? 'linear-gradient(180deg, var(--brand-from), var(--brand-to))' : 'var(--surface-3)',
                    }}
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Code2 size={13} /> View generated SQL
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { l: 'Income', v: '₹84,000', c: 'var(--emerald)' },
              { l: 'Expenses', v: '₹52,310', c: 'var(--red)' },
              { l: 'Saved', v: '₹31,690', c: 'var(--violet-text)' },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-border p-3" style={{ background: 'var(--surface)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k.l}</p>
                <p className="fig mt-1 text-sm font-bold" style={{ color: k.c }}>{k.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: MessageSquare, tone: 'emerald', title: 'Ask in plain English', body: 'Ask “What’s my biggest expense category this year?” and get a computed answer from your own transactions — not a guess.' },
  { icon: BarChart3, tone: 'violet', title: 'A dashboard that explains itself', body: 'Income, expenses, net savings, spending by category, monthly trends, top merchants and recent transactions in one view.' },
  { icon: Code2, tone: 'cyan', title: 'See the SQL behind every answer', body: 'Every response includes the query that produced it, so you can verify the number instead of just trusting it.' },
  { icon: Building2, tone: 'emerald', title: 'Banks found in your inbox', body: 'Connect Gmail read-only and CashChat spots which banks are sending you notifications and statements.' },
  { icon: Mail, tone: 'violet', title: 'UPI mandate finder', body: 'Surface AutoPay and recurring-payment emails so forgotten subscriptions stop slipping by.' },
  { icon: Moon, tone: 'cyan', title: 'Light and dark, your call', body: 'A carefully tuned theme for day and night. Follow your system or switch any time from the top bar.' },
] as const;

const TONES = {
  emerald: { bg: 'var(--emerald-dim)', fg: 'var(--emerald)' },
  violet: { bg: 'var(--violet-dim)', fg: 'var(--violet-text)' },
  cyan: { bg: 'color-mix(in srgb, rgb(var(--cyan-text-rgb)) 14%, transparent)', fg: 'rgb(var(--cyan-text-rgb))' },
} as const;

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--emerald)' }}>{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-20">
      <SectionHead
        eyebrow="Features"
        title="Everything you need to understand your money"
        body="CashChat pairs a clean dashboard with an assistant that actually reads your data."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, tone, title, body }) => (
          <article key={title} className="glass glass-hover p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: TONES[tone].bg, color: TONES[tone].fg }}>
              <Icon size={20} />
            </span>
            <h3 className="mt-5 text-md font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Sign in', body: 'Continue with Google or GitHub. We never see or store a password, and your account arrives with sample data to explore.' },
    { n: '02', title: 'Ask a question', body: 'Type it the way you’d ask a person. Tap a suggestion if you’re not sure where to start.' },
    { n: '03', title: 'Get a real answer', body: 'Receive a plain-English answer with a chart, a table, and the SQL so you can check the work.' },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead eyebrow="How it works" title="From question to answer in seconds" body="Three steps. No setup, no learning curve." />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="glass relative p-6">
              <span className="fig text-4xl font-bold" style={{ color: 'var(--text-3)', opacity: 0.45, letterSpacing: '-0.04em' }}>{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Trust() {
  const points = [
    { title: 'Read-only, tenant-scoped SQL', body: 'Generated queries are validated before they run: a single SELECT, limited to your own data.' },
    { title: 'Gmail is read-only', body: 'Bank and mandate detection only reads notification emails. CashChat never modifies your mailbox or your mandates.' },
    { title: 'Honest about what it knows', body: 'Email detections are labelled unverified — they’re hints, not bank confirmations.' },
    { title: 'No passwords', body: 'Sign-in is handled by Google or GitHub OAuth.' },
  ];
  return (
    <section id="security" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--emerald-dim)', color: 'var(--emerald)' }}>
            <ShieldCheck size={24} />
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
            Built to be trusted with numbers
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            An AI that writes SQL needs guardrails. CashChat validates every query, shows you the work, and keeps its limits clear.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">CashChat is a demo project — please don’t connect real financial accounts.</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.title} className="glass p-5">
              <CheckCircle2 size={18} style={{ color: 'var(--emerald)' }} />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-border px-6 py-14 text-center sm:px-12" style={{ background: 'var(--surface)' }}>
        <div className="aurora" aria-hidden="true" />
        <div className="relative z-10">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
            Ready to ask your money <span className="gradient-text">anything?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">Sign in and your dashboard is waiting, sample data included.</p>
          <Link
            href="/login"
            className="bg-brand mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition hover:opacity-90"
            style={{ textDecoration: 'none', boxShadow: 'var(--shadow-emerald)' }}
          >
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <Logo size={24} text={13} />
        <p>© {new Date().getFullYear()} CashChat · Demo project — not financial advice.</p>
      </div>
    </footer>
  );
}
