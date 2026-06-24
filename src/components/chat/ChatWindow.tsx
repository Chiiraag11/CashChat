'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Zap, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Food spending in May',       query: 'How much did I spend on food in May?' },
  { label: 'Biggest expense category',   query: 'What is my biggest expense category this year?' },
  { label: 'Month-over-month change',    query: 'Compare spending this month versus last month.' },
  { label: 'Top merchants (90 days)',    query: 'Show my top merchants in the last 90 days.' },
  { label: 'Savings rate',               query: 'What is my savings rate this month?' },
  { label: 'Transport costs',            query: 'How much did I spend on transport this quarter?' },
];

export function ChatWindow() {
  const { messages, askQuestion, status } = useChat();
  const isBusy = status === 'thinking' || status === 'querying';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px - 48px)',
        background: 'var(--bg)',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.length === 0 ? (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '40px 20px',
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--emerald), #00A87A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 32px rgba(0,200,150,0.25)',
              }}
            >
              <Zap size={24} color="#fff" strokeWidth={2.5} />
            </div>

            {/* Headline */}
            <div style={{ textAlign: 'center' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text-1)',
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                Ask your money anything.
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', maxWidth: '360px' }}>
                CashChat turns your transactions into answers. Try a question below, or type your own.
              </p>
            </div>

            {/* Suggestion chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
                maxWidth: '560px',
              }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.query}
                  onClick={() => askQuestion(s.query)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-2)',
                    fontSize: '12px',
                    fontWeight: '450',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--emerald)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--emerald)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,150,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                  }}
                >
                  <Sparkles size={11} style={{ flexShrink: 0 }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {/* Status indicator */}
            {isBusy && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingLeft: '40px',
                  animation: 'fadeIn 0.3s',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--emerald)',
                    animation: 'pulse 1s infinite',
                  }}
                />
                {status === 'thinking' ? 'Thinking…' : 'Running query…'}
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={askQuestion} disabled={isBusy} />
    </div>
  );
}
