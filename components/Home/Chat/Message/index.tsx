import { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Paper, Grid, Avatar, Flex } from "@mantine/core";
import { useUser } from "@clerk/nextjs";

import { useMediaMobile } from "@/libs/hooks/use-media-mobile";
import type { IMessage } from "@/libs/stores/message";

const MessageText = dynamic(() => import("../MessageText"));
const MessageImage = dynamic(() => import("../MessageImage"));
const MessageChart = dynamic(() => import("../MessageChart"));

type MessageProps = IMessage;

const MessageView = {
  text: MessageText,
  image: MessageImage,
  chart: MessageChart,
};

const MessageContainer = ({ type, ...rest }: MessageProps) => {
  const { user } = useUser();
  const isMobile = useMediaMobile();
  const isSender = useMemo(() => rest?.sender_id === user?.id, [rest, user]);

  const MessageComponent = useMemo(() => MessageView[type], [type]);

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
            <Avatar radius="xl" src={isSender ? user?.imageUrl : undefined} />
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={isMobile ? 12 : "auto"}
          order={isSender ? 1 : 2}
          className="overflow-hidden"
        >
          {MessageComponent && <MessageComponent {...rest} />}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default memo(MessageContainer);
