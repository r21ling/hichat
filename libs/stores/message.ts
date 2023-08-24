import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from "nanoid";

export interface IMessage {
  id: string;
  timestamp?: number;
  role?: "sender" | "receiver";
}

export interface IMessageText extends IMessage {
  text?: string;
}

export interface IMessageImage extends IMessage {
  image?: string;
  state?: "loading" | "loaded" | "error";
}

type MessageStore = {
  messages: (IMessageText | IMessageImage)[];
  createMessage: (message: Omit<IMessage, "id" | "timestamp" | "role">) => void;
  clearMessages: () => void;
};

export const useMessageStore = createWithEqualityFn<MessageStore>(
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
    createMessage: async (message) => {
      const timestamp = Date.now();
      const id = nanoid();
      const role = "sender";
      set((state) => ({
        messages: [...state.messages, { ...message, id, timestamp, role }],
      }));
    },
    clearMessages: () => set({ messages: [] }),
  }),
  Object.is
);
