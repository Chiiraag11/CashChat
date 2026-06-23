import { cn } from '@/lib/utils';
import { ResultRenderer } from './ResultRenderer';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-2xl rounded-lg px-4 py-3 text-sm', isUser ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
        {message.error ? (
          <p className="text-destructive">{message.error}</p>
        ) : message.content ? (
          <p>{message.content}</p>
        ) : (
          <span className="inline-flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
          </span>
        )}

        {message.result && <ResultRenderer result={message.result} />}
      </div>
    </div>
  );
}
