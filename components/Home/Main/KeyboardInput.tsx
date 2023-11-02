import { useState } from "react";
import { Container, Textarea, ActionIcon, Grid, Box } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";

import { useChannelStore } from "@/libs/stores/channel";
import { useMessage } from "../Chat/hooks";

export default function KeyboardInput({ onSend }: { onSend?: () => void }) {
  const { activeChannel } = useChannelStore(
    (state) => ({
      activeChannel: state.activeChannel,
    }),
    shallow
  );
  const { sendMessage } = useMessage();
  const [text, setText] = useState("");

  const handleSendMessage = useEvent(() => {
    if (!text) return;

    sendMessage({
      type: "text",
      payload: {
        text,
      },
    });
    setText("");
    requestAnimationFrame(() => {
      onSend?.();
    });
  });

  if (!activeChannel) {
    return null;
  }

  return (
    <Box>
      <Container pt={0} pb="md" py="md">
        <Grid>
          <Grid.Col span="auto">
            <Textarea
              value={text}
              onChange={(event) => setText(event.currentTarget.value)}
              autosize
              variant="filled"
              size="md"
              placeholder="Ask a question..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </Grid.Col>

          <Grid.Col span="content">
            <ActionIcon
              variant="filled"
              color="gray"
              className="w-20"
              size="xl"
              onClick={() => handleSendMessage()}
            >
              <IconSend />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
