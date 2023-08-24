import { useMemo, memo } from "react";
import { Paper, Grid, Text, Avatar } from "@mantine/core";

import type { IMessageText } from "@/libs/stores/message";

type MessageProps = IMessageText;

const Message = ({ text, role }: MessageProps) => {
  const isSender = useMemo(() => role === "sender", [role]);

  return (
    <Paper p="md" radius="md">
      <Grid align="center">
        <Grid.Col span="content" order={isSender ? 2 : 1}>
          <Avatar radius="sm" />
        </Grid.Col>
        <Grid.Col span="auto" order={isSender ? 1 : 2}>
          <Text size="sm">{text}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default memo(Message);
