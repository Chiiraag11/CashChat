import { TrendingUp, LineChart, CalendarRange, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

const PLANNED = [
  { icon: LineChart, title: 'Spending trends', body: 'See how every category moves month over month.' },
  { icon: CalendarRange, title: 'Forecasting', body: 'Project next month’s spend from your own history.' },
  { icon: Target, title: 'Budget tracking', body: 'Set targets and watch your progress as you go.' },
];

export default function TrendsPage() {
  return (
    <div style={{ maxWidth: 880, width: '100%', margin: '0 auto', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      <section
        className="glass"
        style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}
      >
        <div className="aurora" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="bg-brand"
            style={{ width: 56, height: 56, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-emerald)' }}
          >
            <TrendingUp size={26} color="#fff" />
          </span>
          <div style={{ marginTop: 18 }}>
            <span className="badge badge-violet">In development</span>
          </div>
          <h1 style={{ marginTop: 12, fontSize: 30, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            Trends &amp; forecasting are coming soon
          </h1>
          <p style={{ margin: '10px auto 0', maxWidth: 480, fontSize: 14, color: 'var(--text-2)' }}>
            Advanced spending trends and forecasting are currently in development. Until then, you can already ask CashChat for month-over-month comparisons.
          </p>
          <Link
            href="/chat"
            className="bg-brand"
            style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-emerald)' }}
          >
            <Sparkles size={15} /> Ask about your trends
          </Link>
        </div>
      </section>

      <div style={{ display: 'grid', gap: 12, marginTop: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {PLANNED.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass glass-hover" style={{ padding: 18 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--emerald-dim)', color: 'var(--emerald)' }}>
              <Icon size={17} />
            </span>
            <h3 style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{title}</h3>
            <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.55, color: 'var(--text-2)' }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
