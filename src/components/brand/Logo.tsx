import { Zap } from 'lucide-react';

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="bg-brand"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-emerald)',
        flexShrink: 0,
      }}
    >
      <Zap size={Math.round(size * 0.53)} color="#fff" strokeWidth={2.5} />
    </span>
  );
}

export function Logo({ size = 30, text = 15 }: { size?: number; text?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ fontSize: text, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
        CashChat
      </span>
    </span>
  );
}
