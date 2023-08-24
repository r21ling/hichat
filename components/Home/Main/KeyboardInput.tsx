import { useState } from "react";
import { Container, Textarea, ActionIcon, Grid, Box } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";

import { useMessageStore } from "@/libs/stores/message";

export default function KeyboardInput({ onSend }: { onSend?: () => void }) {
  const { createMessage } = useMessageStore((state) => state, shallow);
  const [text, setText] = useState("");

  const sendMessage = useEvent(async () => {
    if (!text) return;

    await createMessage({
      text,
    });
    setText("");
    onSend?.();
  });

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
                  sendMessage();
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
              onClick={() => sendMessage()}
            >
              <IconSend />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
