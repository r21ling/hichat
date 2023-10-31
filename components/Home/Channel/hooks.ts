import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";

import { useChannelStore, type Channel } from "@/libs/stores/channel";

export function useChannel() {
  const { isSignedIn, userId } = useAuth();
  const supabase = useSupabase();
  const { setChannels } = useChannelStore(
    (state) => ({
      setChannels: state.setChannels,
    }),
    shallow
  );

  const getUserChannels = useEvent(() =>
    supabase
      ?.from("channels")
      .select()
      .then(({ data }) => {
        setChannels(data as Channel[]);
      })
  );

  const createChannel = useEvent((channel: Channel) =>
    supabase
      ?.from("channels")
      .insert([{ name: channel?.name, user_id: userId }])
  );

  const deleteChannel = useEvent(async (id: string) =>
    supabase?.from("channels").delete().eq("id", id)
  );

  useEffect(() => {
    if (isSignedIn && supabase) {
      getUserChannels();
    }
  }, [getUserChannels, isSignedIn, supabase]);

  return { refresh: getUserChannels, createChannel, deleteChannel };
}
