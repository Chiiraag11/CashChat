import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ask CashChat</h1>
        <p className="text-sm text-muted-foreground">Natural language questions, answered from your own data.</p>
      </div>
      <ChatWindow />
    </div>
  );
}
