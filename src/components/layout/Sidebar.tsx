'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview',   icon: LayoutDashboard },
  { href: '/chat',      label: 'Ask FinChat', icon: MessageSquare },
  { href: '/trends',    label: 'Trends',      icon: TrendingUp },
  { href: '/accounts',  label: 'Accounts',    icon: CreditCard },
];

const NAV_BOTTOM = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help',     label: 'Help',     icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        background: 'var(--bg-subtle)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--emerald), #00A87A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0,200,150,0.3)',
            flexShrink: 0,
          }}
        >
          <Zap size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: 'var(--text-1)',
            letterSpacing: '-0.02em',
          }}
        >
          FinChat
        </span>
      </div>

      {/* Label */}
      <div style={{ padding: '16px 20px 6px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: 'var(--text-3)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Menu
        </span>
      </div>

      {/* Primary nav */}
      <nav style={{ padding: '0 10px', flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '13px',
                fontWeight: active ? '600' : '450',
                color: active ? 'var(--text-1)' : 'var(--text-2)',
                background: active ? 'var(--surface-3)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '16px',
                    background: 'var(--emerald)',
                    borderRadius: '0 3px 3px 0',
                    boxShadow: '0 0 8px var(--emerald)',
                  }}
                />
              )}
              <Icon
                size={15}
                strokeWidth={active ? 2.2 : 1.8}
                color={active ? 'var(--emerald)' : 'currentColor'}
              />
              {label}
              {label === 'Ask FinChat' && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '9px',
                    fontWeight: '600',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: 'var(--violet-dim, rgba(139,92,246,0.12))',
                    color: 'var(--violet)',
                    letterSpacing: '0.04em',
                  }}
                >
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '0 10px' }}>
        <div
          style={{
            height: '1px',
            background: 'var(--border)',
            margin: '8px 4px 8px',
          }}
        />
        {NAV_BOTTOM.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              marginBottom: '2px',
              fontSize: '13px',
              fontWeight: '450',
              color: 'var(--text-2)',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
            }}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </div>

      {/* User pill */}
      <div
        style={{
          padding: '12px 10px 16px',
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--emerald), var(--violet))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '700',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            CP
          </div>
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-1)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Chirag Prasad
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-3)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Pro plan
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
