import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from "nanoid";

export type MessageType = "text" | "image" | "chart";
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

export interface IMessageChart extends IMessage {
  type: "chart";
  payload?: {
    data?: { x: string; y: number }[];
  };
}

type MessageStore = {
  messages: IMessage[];
  createMessage: <T extends Omit<IMessageText, "id">>(message: T) => void;
  updateMessage: <T extends IMessage>(
    message: Partial<T> & { id: IMessage["id"] }
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
        type: "image",
        image: "https://picsum.photos/200/300",
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
        type: "chart",
        payload: {
          data: [
            { x: "A", y: 1 },
            { x: "B", y: 2.88 },
            { x: "C", y: 3.8 },
            { x: "D", y: 4.2 },
          ],
        },
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
    updateMessage: async (message) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === message.id ? { ...m, ...message } : m
        ),
      }));
    },
    clearMessages: () => set({ messages: [] }),
  }),
  Object.is
);
