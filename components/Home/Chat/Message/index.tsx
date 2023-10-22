import { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Paper, Grid, Avatar, Flex } from "@mantine/core";

import { useMediaMobile } from "@/libs/hooks/use-media-mobile";
import type { IMessage } from "@/libs/stores/message";

const MessageText = dynamic(() => import("../MessageText"));
const MessageImage = dynamic(() => import("../MessageImage"));
const MessageChart = dynamic(() => import("../MessageChart"));

type MessageProps = IMessage;

const MessageContainer = ({ role, type, ...rest }: MessageProps) => {
  const isMobile = useMediaMobile();
  const isSender = useMemo(() => role === "sender", [role]);

  const MessageComponent = useMemo(() => {
    switch (type) {
      case "text":
        return MessageText;
      case "image":
        return MessageImage;
      case "chart":
        return MessageChart;
      default:
        return null;
    }
  }, [type]);

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: isSender ? undefined : "var(--mantine-color-default)",
      }}
    >
      <Grid align="center">
        <Grid.Col
          span={isMobile ? 12 : "content"}
          order={!isMobile && isSender ? 2 : 1}
        >
          <Flex justify={isMobile && isSender ? "flex-end" : "start"}>
            <Avatar radius="sm" />
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={isMobile ? 12 : "auto"}
          order={isSender ? 1 : 2}
          className="overflow-hidden"
        >
          {MessageComponent && <MessageComponent role={role} {...rest} />}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default memo(MessageContainer);
