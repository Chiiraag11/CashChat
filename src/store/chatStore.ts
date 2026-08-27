import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  clear: () => set({ messages: [] }),
}));
