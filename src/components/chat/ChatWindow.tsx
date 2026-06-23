'use client';

import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

const SUGGESTIONS = [
  'How much did I spend on food in May?',
  'What is my biggest expense category this year?',
  'Compare spending this month versus last month.',
  'Show my top merchants in the last 90 days.',
];

export function ChatWindow() {
  const { messages, askQuestion, status } = useChat();
  const isBusy = status === 'thinking' || status === 'querying';

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border bg-background">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-lg text-center text-sm text-muted-foreground">
            <p className="mb-4">Ask FinChat anything about your spending. Try:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => askQuestion(s)}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs transition hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>

      <ChatInput onSend={askQuestion} disabled={isBusy} />
    </div>
  );
}
