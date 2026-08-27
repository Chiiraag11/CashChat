import { useState, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import type { ChatApiResponse, ChatErrorResponse } from '@/types/chat';

/**
 * Note on "streaming": the NL->SQL pipeline must generate SQL, execute it,
 * and shape chart data before there's anything meaningful to show — there's
 * no useful partial token stream for a query result the way there is for
 * freeform chat text. Instead we surface discrete progress stages
 * (`status`) so the UI never just shows a static spinner. True token-level
 * streaming of the `explanation` field could be added by switching the
 * OpenAI call to `stream: true` and forwarding deltas over SSE, at the cost
 * of needing the full SQL before validation/execution can start anyway.
 */
export type ChatStatus = 'idle' | 'thinking' | 'querying' | 'done' | 'error';

export function useChat() {
  const { messages, addMessage, updateMessage } = useChatStore();
  const [status, setStatus] = useState<ChatStatus>('idle');

  const askQuestion = useCallback(
    async (question: string) => {
      const userMessageId = crypto.randomUUID();
      const assistantMessageId = crypto.randomUUID();

      addMessage({ id: userMessageId, role: 'user', content: question, createdAt: new Date().toISOString() });
      addMessage({ id: assistantMessageId, role: 'assistant', content: '', createdAt: new Date().toISOString() });

      setStatus('thinking');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });

        setStatus('querying');

        if (!res.ok) {
          const errBody = (await res.json()) as ChatErrorResponse;
          updateMessage(assistantMessageId, { error: errBody.error });
          setStatus('error');
          return;
        }

        const result = (await res.json()) as ChatApiResponse;
        updateMessage(assistantMessageId, { content: result.explanation, result });
        setStatus('done');
      } catch (err) {
        updateMessage(assistantMessageId, { error: (err as Error).message || 'Something went wrong.' });
        setStatus('error');
      }
    },
    [addMessage, updateMessage],
  );

  return { messages, askQuestion, status };
}
