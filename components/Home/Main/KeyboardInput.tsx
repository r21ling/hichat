import { Container, Textarea, ActionIcon, Grid } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

export default function KeyboardInput() {
  return (
    <Container className="absolute left-0 right-0 bottom-0">
      <Grid>
        <Grid.Col span="auto">
          <Textarea
            autosize
            variant="filled"
            size="md"
            placeholder="Ask a question..."
          />
        </Grid.Col>

        <Grid.Col span="content">
          <ActionIcon variant="filled" color="gray" className="w-14" size="xl">
            <IconSend />
          </ActionIcon>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
