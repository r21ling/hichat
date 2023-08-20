import { useMemo, memo } from "react";
import { Paper, Grid, Text, Avatar } from "@mantine/core";

import type { Message as MessageDef } from "@/libs/stores/chat";

type MessageProps = MessageDef & {
  role?: "sender" | "receiver";
};

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
