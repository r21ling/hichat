import { useState } from "react";
import {
  Stack,
  Button,
  Input,
  ActionIcon,
  Text,
  Center,
  Group,
  Modal,
} from "@mantine/core";
import { useValidatedState, useDisclosure } from "@mantine/hooks";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";
import { IconPlus, IconSend } from "@tabler/icons-react";
import { useEvent } from "react-use-event-hook";

import { useChannelStore, type Channel } from "@/libs/stores/channel";
import ChannelItem from "./ChannelItem";
import {
  useListenChannel,
  useGetChannel,
  useCreateChannel,
  useDeleteChannel,
} from "./hooks";

const defaultChannelName = "New Channel";

const Channel = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { channels, activeChannel, setActiveChannel } = useChannelStore(
    (state) => ({
      channels: state.channels,
      activeChannel: state.activeChannel,
      setActiveChannel: state.setActiveChannel,
    }),
    shallow
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [channelToDelete, setChannelToDelete] = useState<
    Channel["id"] | undefined
  >();

  useListenChannel();
  const { refetch } = useGetChannel();
  const { mutateAsync: createChannel } = useCreateChannel();
  const { mutateAsync: deleteChannel } = useDeleteChannel();

  const [{ value: newChannelName, lastValidValue, valid }, setNewChannelName] =
    useValidatedState(defaultChannelName, (val) => !!val, true);
  const [editing, setEditing] = useState(false);

  const handleCreateChannel = useEvent(() => {
    if (!valid) return;

    createChannel({
      name: lastValidValue,
    })?.then(() => {
      setEditing(false);
      setNewChannelName(defaultChannelName);
      refetch();
    });
  });
  const handleDeleteChannel = useEvent(() => {
    if (!channelToDelete) return;

    deleteChannel(channelToDelete).then(() => {
      setChannelToDelete(undefined);
      close();
    });
  });

  if (!isSignedIn) {
    return (
      <Button
        fullWidth
        variant="outline"
        onClick={() => router.push("/sign-in")}
      >
        Log in to create a channel
      </Button>
    );
  }

  return (
    <>
      <Stack>
        {channels?.map?.((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            active={activeChannel?.id === channel.id}
            onClick={() => setActiveChannel(channel)}
            onDelete={() => {
              setChannelToDelete(channel.id);
              open();
            }}
          />
        ))}
        {(channels?.length ?? 0) < 5 && (
          <>
            {editing ? (
              <Input
                autoFocus
                error={!valid}
                placeholder="Channel Name"
                rightSectionPointerEvents="all"
                rightSection={
                  <ActionIcon
                    disabled={!valid}
                    variant="light"
                    aria-label="Send"
                  >
                    <IconSend size={20} onClick={() => handleCreateChannel()} />
                  </ActionIcon>
                }
                value={newChannelName}
                onChange={(event) =>
                  setNewChannelName(event.currentTarget.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCreateChannel();
                  }
                }}
              />
            ) : (
              <Button
                fullWidth
                variant="outline"
                leftSection={<IconPlus size={20} />}
                onClick={() => setEditing(true)}
              >
                Create Channel
              </Button>
            )}
          </>
        )}
      </Stack>

      <Modal centered opened={opened} onClose={close}>
        <Center>
          <Stack gap="xl">
            <Text>Are you sure you want to delete it?</Text>
            <Group justify="space-between">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button color="red" onClick={() => handleDeleteChannel()}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Center>
      </Modal>
    </>
  );
};

export default Channel;
