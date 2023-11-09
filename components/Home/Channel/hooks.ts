import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useChannelStore, type Channel } from "@/libs/stores/channel";

export function useListenChannel() {
  const { isSignedIn } = useAuth();
  const supabase = useSupabase();

  const { refetch } = useGetChannel();

  useEffect(() => {
    if (isSignedIn && supabase) {
      supabase
        .channel("channels")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "channels",
          },
          () => {
            console.log("channel changed");
            refetch();
          }
        )
        .subscribe();

      return () => {
        supabase.channel("channels").unsubscribe();
      };
    }
  }, [refetch, isSignedIn, supabase]);
}

export function useGetChannel() {
  const { isSignedIn } = useAuth();
  const supabase = useSupabase();
  const { setChannels } = useChannelStore(
    (state) => ({
      setChannels: state.setChannels,
    }),
    shallow
  );

  const getUserChannels = useEvent(async () =>
    supabase
      ?.from("channels")
      .select()
      .then(({ data }) => {
        setChannels(data as Channel[]);
        return data;
      })
  );

  return useQuery({
    enabled: !!(isSignedIn && supabase),
    queryKey: ["getChannels"],
    queryFn: getUserChannels,
  });
}

export function useCreateChannel() {
  const { userId } = useAuth();
  const supabase = useSupabase();

  const createChannel = useEvent(async (channel: Channel) =>
    supabase
      ?.from("channels")
      .insert([{ name: channel?.name, user_id: userId }])
  );

  return useMutation({
    mutationKey: ["createChannel"],
    mutationFn: createChannel,
  });
}

export function useDeleteChannel() {
  const supabase = useSupabase();

  const deleteChannel = useEvent(async (id: string) =>
    supabase?.from("channels").delete().eq("id", id)
  );

  return useMutation({
    mutationKey: ["deleteChannel"],
    mutationFn: deleteChannel,
  });
}
