'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Settings,
  HelpCircle,
  Mail,
  X,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview',           icon: LayoutDashboard },
  { href: '/chat',      label: 'Ask CashChat',       icon: MessageSquare },
  { href: '/trends',    label: 'Trends',             icon: TrendingUp },
  { href: '/accounts',  label: 'Accounts',           icon: CreditCard },
  { href: '/mandates',  label: 'Check UPI Mandates', icon: Mail },
];

const NAV_BOTTOM = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help',     label: 'Help',     icon: HelpCircle },
];

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || '').trim();
  if (!source) return 'U';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U';
}

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="shell-sidebar">
      {/* Logo */}
      <div style={{ padding: '18px 16px 6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" onClick={onNavigate} style={{ textDecoration: 'none' }} aria-label="CashChat home">
          <Logo />
        </Link>
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px 6px' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Menu
        </span>
      </div>

      {/* Primary nav */}
      <nav style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }} aria-label="Primary">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = !!pathname?.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate} className="nav-link" data-active={active} aria-current={active ? 'page' : undefined}>
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {label === 'Ask CashChat' && (
                <span
                  style={{
                    marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                    background: 'var(--violet-dim)', color: 'var(--violet-text)', letterSpacing: '0.04em',
                  }}
                >
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div style={{ padding: '0 10px' }}>
        <div style={{ height: 1, background: 'var(--border)', margin: '8px 4px' }} />
        {NAV_BOTTOM.map(({ href, label, icon: Icon }) => {
          const active = !!pathname?.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate} className="nav-link" data-active={active}>
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Signed-in user */}
      <div style={{ padding: '10px 10px 14px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12,
            background: 'var(--surface)', border: '1px solid var(--border)',
          }}
        >
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" width={28} height={28} referrerPolicy="no-referrer" style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div
              style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--brand-from), var(--violet))', color: '#fff', fontSize: 10, fontWeight: 700,
              }}
            >
              {initials(user?.name, user?.email)}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name ?? user?.email ?? 'Signed in'}
            </div>
            {user?.name && user?.email && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
