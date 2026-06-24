'use client';

import { useState, type FormEvent, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (question: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [value]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
          background: 'var(--surface)',
          border: `1px solid ${value ? 'var(--border-strong)' : 'var(--border)'}`,
          borderRadius: '14px',
          padding: '10px 10px 10px 14px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: value ? '0 0 0 3px rgba(0,200,150,0.06)' : 'none',
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about your spending — e.g. 'How much did I spend on food last month?'"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--text-1)',
            fontFamily: 'inherit',
            caretColor: 'var(--emerald)',
            minHeight: '22px',
            maxHeight: '120px',
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: canSend
              ? 'linear-gradient(135deg, var(--emerald), #00A87A)'
              : 'var(--surface-3)',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: canSend ? '0 2px 8px rgba(0,200,150,0.25)' : 'none',
          }}
        >
          <ArrowUp
            size={15}
            color={canSend ? '#fff' : 'var(--text-3)'}
            strokeWidth={2.5}
          />
        </button>
      </div>
      <p
        style={{
          fontSize: '10px',
          color: 'var(--text-3)',
          textAlign: 'center',
          marginTop: '8px',
        }}
      >
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
