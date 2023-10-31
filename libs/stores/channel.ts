import { createWithEqualityFn } from "zustand/traditional";
import type { IMessage } from "./message";

export type Channel = {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  messages?: IMessage[];
};

type ChannelStore = {
  channels?: Channel[];
  setChannels: (channels: Channel[]) => void;
  activeChannel?: Channel;
  setActiveChannel: (channel: Channel) => void;
};

export const useChannelStore = createWithEqualityFn<ChannelStore>(
  (set) => ({
    channels: undefined,
    setChannels: (channels) => set({ channels }),
    activeChannel: undefined,
    setActiveChannel: (channel) => set({ activeChannel: channel }),
  }),
  Object.is
);
