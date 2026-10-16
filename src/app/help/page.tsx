import Link from 'next/link';
import { MessageSquare, Mail, Building2, ShieldCheck, Sparkles } from 'lucide-react';

const EXAMPLES = [
  'How much did I spend on food in May?',
  'What is my biggest expense category this year?',
  'Compare spending this month versus last month.',
  'Show my top merchants in the last 90 days.',
  'What is my savings rate this month?',
];

const FAQ = [
  { q: 'Where does the data come from?', a: 'Your dashboard starts with sample data so you can explore right away. Answers are computed from the transactions stored for your account.' },
  { q: 'Can I trust the numbers?', a: 'Every chat answer includes the generated SQL under “View generated SQL”, so you can see exactly how a figure was calculated.' },
  { q: 'What does the Gmail access do?', a: 'Accounts and UPI Mandates scan notification emails with read-only permission to suggest banks and recurring payments. They are hints, not bank confirmations — verify in your bank or UPI app.' },
  { q: 'Is it safe to connect real accounts?', a: 'CashChat is a demo project. Please don’t connect real financial accounts.' },
];

export default function HelpPage() {
  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>Help</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Quick answers and ideas for getting the most out of CashChat.</p>
      </div>

      <section className="glass" style={{ padding: 22 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
          <MessageSquare size={16} style={{ color: 'var(--emerald)' }} /> Questions to try
        </h3>
        <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXAMPLES.map((e) => (
            <li key={e} style={{ padding: '7px 12px', borderRadius: 10, fontSize: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
              {e}
            </li>
          ))}
        </ul>
        <Link href="/chat" className="bg-brand" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          <Sparkles size={14} /> Open Ask CashChat
        </Link>
      </section>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {[
          { icon: Building2, title: 'Accounts', body: 'Detect banks mentioned in your Gmail notifications.' },
          { icon: Mail, title: 'UPI Mandates', body: 'Find AutoPay and recurring-payment emails.' },
          { icon: ShieldCheck, title: 'Read-only', body: 'CashChat never changes your emails or mandates.' },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass" style={{ padding: 18 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--violet-dim)', color: 'var(--violet-text)' }}>
              <Icon size={16} />
            </span>
            <h4 style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{title}</h4>
            <p style={{ marginTop: 3, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>{body}</p>
          </div>
        ))}
      </div>

      <section className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>Frequently asked</h3>
        {FAQ.map(({ q, a }, i) => (
          <details key={q} style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{q}</summary>
            <p style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-2)' }}>{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
