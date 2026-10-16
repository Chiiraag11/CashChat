'use client';

import { useSession } from 'next-auth/react';
import { Zap } from 'lucide-react';
import { ResultRenderer } from './ResultRenderer';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user';
  const { data: session } = useSession();
  const source = (session?.user?.name ?? session?.user?.email ?? '').trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const userInitials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U';

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--brand-from), var(--brand-to))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            boxShadow: 'var(--shadow-emerald)',
          }}
        >
          <Zap size={13} color="#fff" strokeWidth={2.5} />
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: '72%',
          width: message.result ? 'min(100%, 640px)' : undefined,
          minWidth: 0,
          borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
          padding: '12px 16px',
          background: isUser
            ? 'linear-gradient(135deg, var(--brand-from), var(--brand-to))'
            : 'var(--surface)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '13px',
          lineHeight: '1.6',
          color: isUser ? '#fff' : 'var(--text-1)',
          boxShadow: isUser
            ? '0 2px 12px var(--emerald-glow)'
            : 'var(--shadow-sm)',
        }}
      >
        {message.error ? (
          <p style={{ color: 'var(--danger)' }}>{message.error}</p>
        ) : message.content ? (
          <p style={{ margin: 0 }}>{message.content}</p>
        ) : (
          /* Thinking dots */
          <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--text-3)',
                  animation: `bounce 1.2s infinite ${i * 150}ms`,
                }}
              />
            ))}
          </span>
        )}

        {message.result && <ResultRenderer result={message.result} />}
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--violet), #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            fontSize: '10px',
            fontWeight: '700',
            color: '#fff',
          }}
        >
          {userInitials}
        </div>
      )}
    </div>
  );
}
