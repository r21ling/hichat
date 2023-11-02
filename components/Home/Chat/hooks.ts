import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useAuth } from "@clerk/nextjs";
import { useEvent } from "react-use-event-hook";
import { v4 as uuidv4 } from "uuid";

import { useChannelStore } from "@/libs/stores/channel";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { useMessageStore, type IMessage } from "@/libs/stores/message";

/**
 * @description
 * This hook is used to fetch all the channels from the database
 * and subscribe to the changes in the channels table.
 */
export function useChannelMessage() {
  const supabase = useSupabase();
  const { channels } = useChannelStore(
    (state) => ({
      channels: state.channels,
    }),
    shallow
  );
  const { setMessagesByChannelId } = useMessageStore(
    (state) => ({
      setMessagesByChannelId: state.setMessagesByChannelId,
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
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `channel_id=in.(${channels
              ?.map((channel) => channel.id)
              .join(",")})`,
          },
          (payload) => {
            console.log("messages changed", payload);
            const { new: newMessage } = payload;
            setMessagesByChannelId(newMessage.channel_id, [
              newMessage as IMessage,
            ]);
          }
        )
        .subscribe();

      return () => {
        supabase.channel("messages").unsubscribe();
      };
    }
  }, [channels, setMessagesByChannelId, supabase]);
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

  const sendMessage = useEvent(async (message: Omit<IMessage, "id">) => {
    if (supabase && userId && activeChannel?.id) {
      const channelId = activeChannel?.id;
      const newMessage = {
        ...message,
        id: uuidv4(),
        sender_id: userId,
        channel_id: channelId,
      };
      setMessagesByChannelId(channelId, [newMessage]);

      const { data, error } = await supabase
        ?.from("messages")
        .insert(newMessage)
        .select("*");
      if (error) {
        throw error;
      }
      return data;
    }
  });

  return {
    sendMessage,
  };
}
