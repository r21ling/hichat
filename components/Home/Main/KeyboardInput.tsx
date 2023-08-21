import { Container, Textarea, ActionIcon, Grid, Box } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

export default function KeyboardInput() {
  return (
    <Box>
      <Container pt={0} pb="md" py="md">
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
            <ActionIcon
              variant="filled"
              color="gray"
              className="w-20"
              size="xl"
            >
              <IconSend />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
