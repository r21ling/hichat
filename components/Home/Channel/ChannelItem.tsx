import { NavLink, ActionIcon, Grid, Menu, Text } from "@mantine/core";
import { IconMenu, IconTrash } from "@tabler/icons-react";

import type { Channel } from "@/libs/stores/channel";

const ChannelItem = ({
  channel,
  active,
  onClick,
  onDelete,
}: {
  channel: Channel;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <NavLink
      label={
        <Menu>
          <Grid align="center">
            <Grid.Col span="auto">{channel.name}</Grid.Col>
            <Grid.Col span="content" onClick={(e) => e.stopPropagation()}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" aria-label="Menu">
                  <IconMenu size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => onDelete?.()}
                  leftSection={
                    <ActionIcon
                      variant="transparent"
                      color="red"
                      aria-label="Menu"
                      size="xs"
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  }
                >
                  <Text c="red" size="xs">
                    Delete
                  </Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Grid.Col>
          </Grid>
        </Menu>
      }
      active={active}
      onClick={() => onClick?.()}
    />
  );
};

export default ChannelItem;
