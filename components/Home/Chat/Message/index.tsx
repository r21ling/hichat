import { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Paper, Grid, Avatar } from "@mantine/core";

import type { IMessage } from "@/libs/stores/message";

const MessageText = dynamic(() => import("../MessageText"));
const MessageImage = dynamic(() => import("../MessageImage"));

type MessageProps = IMessage;

const MessageContainer = ({ role, type, ...rest }: MessageProps) => {
  const isSender = useMemo(() => role === "sender", [role]);

  const MessageComponent = useMemo(() => {
    switch (type) {
      case "text":
        return MessageText;
      case "image":
        return MessageImage;
      default:
        return null;
    }
  }, [type]);

  return (
    <Paper p="md" radius="md">
      <Grid align="center">
        <Grid.Col span="content" order={isSender ? 2 : 1}>
          <Avatar radius="sm" />
        </Grid.Col>
        <Grid.Col span="auto" order={isSender ? 1 : 2}>
          {MessageComponent && <MessageComponent role={role} {...rest} />}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default memo(MessageContainer);
