'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle({ size = 34 }: { size?: number }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-2)',
        cursor: 'pointer',
        transition: 'color .15s, border-color .15s, background .15s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-1)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-2)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && !isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
