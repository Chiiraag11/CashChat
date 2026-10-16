'use client';

import { useSession } from 'next-auth/react';
import { Laptop, Moon, Sun, UserRound } from 'lucide-react';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';

const OPTIONS: { value: Theme; label: string; hint: string; icon: typeof Sun }[] = [
  { value: 'light',  label: 'Light',  hint: 'Bright and clean',          icon: Sun },
  { value: 'dark',   label: 'Dark',   hint: 'Easy on the eyes at night', icon: Moon },
  { value: 'system', label: 'System', hint: 'Match your device',         icon: Laptop },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <div style={{ width: '100%', maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Make CashChat feel the way you like it.</p>
      </div>

      <section className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Appearance</h3>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>Choose a theme. Your choice is remembered on this device.</p>

        <div role="radiogroup" aria-label="Theme" style={{ display: 'grid', gap: 10, marginTop: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(value)}
                style={{
                  textAlign: 'left', padding: 14, borderRadius: 14, cursor: 'pointer', color: 'var(--text-1)',
                  background: active ? 'var(--emerald-dim)' : 'var(--surface-2)',
                  border: `1.5px solid ${active ? 'var(--emerald)' : 'var(--border)'}`,
                  transition: 'all .15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                  <Icon size={16} style={{ color: active ? 'var(--emerald)' : 'var(--text-2)' }} /> {label}
                </span>
                <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: 'var(--text-2)' }}>{hint}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Account</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" width={48} height={48} referrerPolicy="no-referrer" style={{ borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
              <UserRound size={22} />
            </span>
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{session?.user?.name ?? 'Signed in'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.email ?? ''}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
