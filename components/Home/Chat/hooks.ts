import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useAuth } from "@clerk/nextjs";

import { useChannelStore } from "@/libs/stores/channel";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { type IMessage } from "@/libs/stores/message";

export function useMessageByActiveChannel() {
  const { userId } = useAuth();
  const supabase = useSupabase();
  const { activeChannel } = useChannelStore(
    (state) => ({
      activeChannel: state.activeChannel,
    }),
    shallow
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (activeChannel?.id) {
      setLoading(true);
      supabase
        ?.from("messages")
        .select("*")
        .match({ channel_id: activeChannel?.id })
        .then(({ data }) => {
          const messages = data?.map((message) => ({
            ...message,
            role: message.user_id === userId ? "sender" : "receiver",
          })) as IMessage[];
          setMessages(messages);
          setLoading(false);
        });
    }
  }, [supabase, activeChannel?.id, userId]);

  return { messages, loading };
}
