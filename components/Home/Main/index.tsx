import {
  ScrollArea,
  Group,
  Text,
  Stack,
  Flex,
  useMantineColorScheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("../Chat"));
const KeyboardInput = dynamic(() => import("./KeyboardInput"));

export default function Main() {
  const { status } = useSession();

  const { colorScheme } = useMantineColorScheme();

  return (
    <Flex gap="md" direction="column" wrap="nowrap" className="h-full">
      <ScrollArea
        className="h-full relative"
        style={{
          backgroundColor:
            colorScheme === "light"
              ? "var(--mantine-color-gray-1)"
              : "var(--mantine-color-black)",
        }}
        px="md"
      >
        <Stack my="md">
          <Group>
            <Text>Login Status:</Text>
            <Text>{status}</Text>
          </Group>

          <Chat />
        </Stack>
      </ScrollArea>

      <KeyboardInput />
    </Flex>
  );
}
