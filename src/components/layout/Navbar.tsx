'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserRound } from 'lucide-react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview',     subtitle: 'Your financial snapshot' },
  '/chat':      { title: 'Ask CashChat',  subtitle: 'Natural language queries on your spending' },
  '/trends':    { title: 'Trends',       subtitle: 'Spending patterns over time' },
  '/accounts':  { title: 'Accounts',     subtitle: 'Connected accounts & balances' },
};

export function Navbar() {
  const pathname = usePathname() ?? '/dashboard';
  const match = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname.startsWith(path)
  );
  const { title, subtitle } = match?.[1] ?? {
    title: 'CashChat',
    subtitle: '',
  };

  const { data: session } = useSession();

  return (
    <header
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <h1
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-1)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.2 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Search */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '32px',
            padding: '0 10px',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-3)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
          }}
        >
          <Search size={13} />
          <span>Search</span>
          <kbd
            style={{
              padding: '1px 4px',
              borderRadius: '3px',
              background: 'var(--surface-3)',
              border: '1px solid var(--border)',
              fontSize: '10px',
              fontFamily: 'inherit',
              marginLeft: '4px',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-2)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
          }}
        >
          <Bell size={14} />
          {/* Unread dot */}
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--emerald)',
              border: '1.5px solid var(--bg-subtle)',
            }}
          />
        </button>

        {/* PASTE SIGNED-IN ACCOUNT BLOCK HERE */}
        <div
          title={session?.user?.email ?? ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            maxWidth: '240px',
            minWidth: 0,
          }}
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          ) : (
            <UserRound size={18} style={{ flexShrink: 0 }} />
          )}

          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '10px', color: 'var(--text-3)', margin: 0 }}>
              Signed in as
            </p>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0,
              }}
            >
              {session?.user?.email ?? session?.user?.name ?? 'Signed in'}
            </p>
          </div>
        </div>


        {/* Date badge */}
        <div
  style={{
    height: '32px',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    fontSize: '11px',
    color: 'var(--text-2)',
    fontVariantNumeric: 'tabular-nums',
  }}
>
  {new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}
</div>

<button
  onClick={() => {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith('cashchat:'))
    .forEach((key) => sessionStorage.removeItem(key));

  void signOut({ callbackUrl: '/login' });
}}
  style={{
    height: '32px',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '8px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)',
    cursor: 'pointer',
    fontSize: '12px',
  }}
>
  <LogOut size={14} />
  <span>Sign Out</span>
</button>
      </div>
    </header>
  );
}
