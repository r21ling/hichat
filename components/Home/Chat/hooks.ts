import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useAuth } from "@clerk/nextjs";
import { useEvent } from "react-use-event-hook";
import { v4 as uuidv4 } from "uuid";

import { useChannelStore } from "@/libs/stores/channel";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { useMessageStore, type IMessage } from "@/libs/stores/message";

export function useChannelMessage() {
  const supabase = useSupabase();
  const { channels } = useChannelStore(
    (state) => ({
      channels: state.channels,
    }),
    shallow
  );
  const { setMessagesByChannelId, channelMessageMap } = useMessageStore(
    (state) => ({
      setMessagesByChannelId: state.setMessagesByChannelId,
      channelMessageMap: state.channelMessageMap,
    }),
    shallow
  );

  const getMessagesByChannel = useEvent(async (channelId: string) => {
    return await supabase
      ?.from("messages")
      .select("*")
      .match({ channel_id: channelId })
      .then(({ data }) => data);
  });

  useEffect(() => {
    channels?.forEach?.((channel) => {
      if (channel.id) {
        getMessagesByChannel(channel.id).then((messages) => {
          setMessagesByChannelId(channel.id as string, messages ?? []);
        });
      }
    });
  }, [channels, getMessagesByChannel, setMessagesByChannelId]);

  useEffect(() => {
    if (supabase) {
      supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            console.log("messages changed", payload);
          }
        )
        .subscribe();

      return () => {
        supabase.channel("messages").unsubscribe();
      };
    }
  }, [supabase]);
}

export function useMessage() {
  const { userId } = useAuth();
  const supabase = useSupabase();
  const { activeChannel } = useChannelStore(
    (state) => ({
      activeChannel: state.activeChannel,
    }),
    shallow
  );
  const { setMessagesByChannelId } = useMessageStore(
    (state) => ({
      setMessagesByChannelId: state.setMessagesByChannelId,
    }),
    shallow
  );

  const sendMessage = useEvent(
    async (message: Omit<IMessage, "id" | "uuid">) => {
      if (supabase && userId && activeChannel?.id) {
        const channelId = activeChannel?.id;
        const { data, error } = await supabase
          ?.from("messages")
          .insert({
            ...message,
            uuid: uuidv4(),
            sender_id: userId,
            channel_id: channelId,
          })
          .select("*");
        if (error) {
          throw error;
        }
        setMessagesByChannelId(channelId, data);
        return data;
      }
    }
  );

  return {
    sendMessage,
  };
}
