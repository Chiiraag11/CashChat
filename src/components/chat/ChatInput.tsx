'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function ChatInput({ onSend, disabled }: { onSend: (question: string) => void; disabled: boolean }) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-card p-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about your spending, e.g. 'How much did I spend on food last month?'"
        disabled={disabled}
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      <Button type="submit" disabled={disabled || !value.trim()} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
