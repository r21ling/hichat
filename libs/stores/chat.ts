import { createWithEqualityFn } from "zustand/traditional";

export type Message = {
  id: string;
  text?: string;
  role?: "sender" | "receiver";
};

type Chat = {
  messages: Message[];
  clearMessages: () => void;
};

export const useChatStore = createWithEqualityFn<Chat>(
  (set) => ({
    messages: [
      {
        id: "1",
        text: "Hello",
      },
      {
        id: "2",
        text: "World",
        role: "sender",
      },
      {
        id: "3",
        text: "!",
      },
      {
        id: "4",
        text: "!",
      },
      {
        id: "5",
        text: "!",
      },
      {
        id: "6",
        text: "!",
      },
      {
        id: "7",
        text: "!",
      },
    ],
    clearMessages: () => set({ messages: [] }),
  }),
  Object.is
);
