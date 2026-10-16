'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

/**
 * Shared authenticated shell: sidebar (drawer on small screens) + top bar +
 * scrollable content area. Every in-app route layout renders through this so
 * the chrome is identical on every page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div style={{ display: 'flex', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="shell-desktop-only">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="shell-mobile-only" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'rgba(5,7,12,0.55)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s ease-out' }}
          />
          <div style={{ position: 'relative', height: '100%', width: 'fit-content', animation: 'slideIn .25s cubic-bezier(0.16,1,0.3,1)', boxShadow: 'var(--shadow-lg)' }}>
            <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onMenu={() => setOpen(true)} />
        <main style={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto', padding: 'clamp(14px, 2.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
