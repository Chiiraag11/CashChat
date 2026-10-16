import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
          Ask CashChat
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
          Natural language questions, answered from your own data.
        </p>
      </div>
      <ChatWindow />
    </div>
  );
}
