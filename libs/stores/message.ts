import { createWithEqualityFn } from "zustand/traditional";
// import cityTemperature from "@visx/mock-data/lib/mocks/cityTemperature";

// import { transferChartMessage } from "@/libs/utils/transferChartMessage";

const uniqBy = <T extends { id: string }>(array: T[]) => {
  const map = new Map<string, T>();
  for (const item of array) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
};

export type MessageType = "text" | "image" | "chart";
export interface IMessage {
  id: string;
  timestamp?: number;
  sender_id?: string;
  type: MessageType;
  payload?: Record<string, any>;
}

export interface IMessageChart extends IMessage {
  type: "chart";
  payload?: {
    data?: {
      [x: string]: {
        x: string;
        y: string;
      }[];
    }[];
  };
}

type MessageStore = {
  channelMessageMap: Map<string, IMessage[]>;
  setMessagesByChannelId: (channelId: string, messages: IMessage[]) => void;
};

export const useMessageStore = createWithEqualityFn<MessageStore>(
  (set) => ({
    messages: [
      // {
      //   id: "1",
      //   text: "Hello",
      //   type: "text",
      // },
      // {
      //   id: "2",
      //   text: "World",
      //   type: "text",
      //   role: "sender",
      // },
      // {
      //   id: "3",
      //   text: "!",
      //   type: "text",
      // },
      // {
      //   id: "4",
      //   type: "image",
      //   image: "https://picsum.photos/200/300",
      // },
      // {
      //   id: "5",
      //   text: "!",
      //   type: "text",
      // },
      // {
      //   id: "6",
      //   text: "!",
      //   type: "text",
      // },
      // {
      //   id: "7",
      //   type: "chart",
      //   payload: {
      //     data: transferChartMessage(cityTemperature.slice(0, 10)),
      //   },
      // },
    ],
    channelMessageMap: new Map(),
    setMessagesByChannelId: (channelId, messages) => {
      set((state) => {
        const channelMessageMap = new Map(state.channelMessageMap);
        const mergeMessages = uniqBy<IMessage>([
          ...(channelMessageMap.get(channelId) ?? []),
          ...messages,
        ]);
        channelMessageMap.set(channelId, mergeMessages);
        return { channelMessageMap };
      });
    },
  }),
  Object.is
);
