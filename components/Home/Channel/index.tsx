import { NavLink, Stack } from "@mantine/core";
import { shallow } from "zustand/shallow";

import { useChannelStore, type Channel } from "@/libs/stores/channel";
import { useSuapbaseWithCallback } from "@/libs/hooks/use-supabase";

const Channel = () => {
  const { channels, setChannels, activeChannel, setActiveChannel } =
    useChannelStore(
      (state) => ({
        channels: state.channels,
        setChannels: state.setChannels,
        activeChannel: state.activeChannel,
        setActiveChannel: state.setActiveChannel,
      }),
      shallow
    );

  useSuapbaseWithCallback((supabase) =>
    supabase
      .from("channels")
      .select()
      .then(({ data }) => {
        setChannels(data as Channel[]);
      })
  );

  return (
    <Stack>
      {channels?.map?.((channel) => (
        <NavLink
          key={channel.id}
          label={channel.name}
          active={activeChannel?.id === channel.id}
          onClick={() => setActiveChannel(channel)}
        />
      ))}
    </Stack>
  );
};

export default Channel;
