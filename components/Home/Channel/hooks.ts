import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/libs/hooks/use-supabase";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useChannelStore, type Channel } from "@/libs/stores/channel";

export function useListenChannel() {
  const { isSignedIn, userId } = useAuth();
  const supabase = useSupabase();

  const { refetch } = useStoreChannel();

  useEffect(() => {
    if (isSignedIn && supabase) {
      supabase
        .channel("channels")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "channel_members",
            filter: `user_id=eq.${userId}`,
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
  }, [refetch, isSignedIn, supabase, userId]);
}

export function useStoreChannel() {
  const { isSignedIn, userId } = useAuth();
  const supabase = useSupabase();
  const { setChannels } = useChannelStore(
    (state) => ({
      setChannels: state.setChannels,
    }),
    shallow
  );

  const getUserChannels = useEvent(async () => {
    const { data: channelMembers } = await supabase
      ?.from("channel_members")
      .select("channel_id")
      .eq("user_id", userId)!;

    const channelIds = channelMembers?.map(
      (member) => member.channel_id
    ) as string[];

    return await supabase
      ?.from("channels")
      .select()
      .in("id", channelIds)
      .then(({ data }) => {
        setChannels(data as Channel[]);
        return data;
      });
  });

  return useQuery({
    enabled: !!(isSignedIn && supabase),
    queryKey: ["getChannels"],
    queryFn: getUserChannels,
  });
}

export function useCreateChannel() {
  const { userId } = useAuth();
  const supabase = useSupabase();

  const createChannel = useEvent(async (newChannel: Channel) => {
    let channel;
    try {
      const { data, error } = await supabase
        ?.from("channels")
        .insert([{ name: newChannel?.name, user_id: userId }])
        .select()
        .single()!;

      if (error) throw new Error(error.message);

      channel = data;

      const memberResult = await supabase
        ?.from("channel_members")
        .insert([{ channel_id: data?.id, user_id: userId }])!;

      if (memberResult.error) throw new Error(memberResult.error.message);
    } catch (error) {
      console.error("Error creating channel and channel member: ", error);

      // If the channel was created, delete it
      if (channel) {
        await supabase?.from("channels").delete().match({ id: channel?.id });
      }
    }
  });

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
