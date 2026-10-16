'use client';

import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview',      subtitle: 'Your financial snapshot' },
  '/chat':      { title: 'Ask CashChat',  subtitle: 'Natural language queries on your spending' },
  '/trends':    { title: 'Trends',        subtitle: 'Spending patterns over time' },
  '/accounts':  { title: 'Accounts',      subtitle: 'Connected accounts & balances' },
  '/mandates':  { title: 'UPI Mandates',  subtitle: 'Recurring payments found in your email' },
  '/settings':  { title: 'Settings',      subtitle: 'Appearance and account' },
  '/help':      { title: 'Help',          subtitle: 'Get the most out of CashChat' },
};

export function Navbar({ onMenu }: { onMenu?: () => void }) {
  const pathname = usePathname() ?? '/dashboard';
  const match = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path));
  const { title, subtitle } = match?.[1] ?? { title: 'CashChat', subtitle: '' };

  const { data: session } = useSession();

  const handleSignOut = () => {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith('cashchat:'))
      .forEach((key) => sessionStorage.removeItem(key));

    void signOut({ callbackUrl: '/login' });
  };

  return (
    <header
      style={{
        height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '0 20px', borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg-subtle) 88%, transparent)', backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 20,
      }}
    >
      {/* Left: menu + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <button type="button" className="icon-btn shell-mobile-only" onClick={onMenu} aria-label="Open menu">
          <Menu size={16} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{title}</h1>
          {subtitle && (
            <p className="shell-hide-sm" style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.2 }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          className="shell-hide-sm"
          style={{
            height: 34, padding: '0 12px', alignItems: 'center', borderRadius: 10, background: 'var(--surface)',
            border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums',
          }}
        >
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        <ThemeToggle />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              title={session?.user?.email ?? ''}
              aria-label="Account menu"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 8px 0 4px', borderRadius: 10,
                background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer', maxWidth: 220, minWidth: 0,
              }}
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Profile" width={26} height={26} referrerPolicy="no-referrer" style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-2)' }}>
                  <UserRound size={14} />
                </span>
              )}
              <span className="shell-hide-sm" style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                {session?.user?.name ?? session?.user?.email ?? 'Signed in'}
              </span>
              <ChevronDown size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="menu-content" align="end" sideOffset={8}>
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                <p style={{ fontSize: 10, color: 'var(--text-3)' }}>Signed in as</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                  {session?.user?.email ?? session?.user?.name ?? 'Signed in'}
                </p>
              </div>
              <DropdownMenu.Item asChild>
                <Link href="/settings" className="menu-item" style={{ textDecoration: 'none' }}>
                  <Settings size={14} /> Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="menu-item" onSelect={handleSignOut} style={{ color: 'var(--red)' }}>
                <LogOut size={14} /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
