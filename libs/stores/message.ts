import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from "nanoid";

export type MessageType = "text" | "image";
export interface IMessage {
  id: string;
  timestamp?: number;
  role?: "sender" | "receiver";
  type: MessageType;
}

export interface IMessageText extends IMessage {
  text?: string;
  type: "text";
}

export interface IMessageImage extends IMessage {
  image?: string;
  type: "image";
  state?: "loading" | "loaded" | "error";
}

type MessageStore = {
  messages: IMessage[];
  createMessage: <
    T extends Omit<IMessageText, "id"> | Omit<IMessageImage, "id">
  >(
    message: T
  ) => void;
  clearMessages: () => void;
};

export const useMessageStore = createWithEqualityFn<MessageStore>(
  (set) => ({
    messages: [
      {
        id: "1",
        text: "Hello",
        type: "text",
      },
      {
        id: "2",
        text: "World",
        type: "text",
        role: "sender",
      },
      {
        id: "3",
        text: "!",
        type: "text",
      },
      {
        id: "4",
        text: "!",
        type: "text",
      },
      {
        id: "5",
        text: "!",
        type: "text",
      },
      {
        id: "6",
        text: "!",
        type: "text",
      },
      {
        id: "7",
        text: "!",
        type: "text",
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
