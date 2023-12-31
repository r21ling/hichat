import { useRef } from "react";
import {
  ScrollArea,
  Group,
  Text,
  Stack,
  Flex,
  useComputedColorScheme,
  Box,
} from "@mantine/core";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useEvent } from "react-use-event-hook";

const Chat = dynamic(() => import("../Chat"));
const KeyboardInput = dynamic(() => import("./KeyboardInput"));

export default function Main() {
  const { isSignedIn, isLoaded } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const scrollToBottom = useEvent(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  });

  return (
    <Flex gap="md" direction="column" wrap="nowrap" className="h-full">
      <ScrollArea
        className="h-full relative"
        style={{
          backgroundColor:
            computedColorScheme === "light"
              ? "var(--mantine-color-gray-1)"
              : "var(--mantine-color-black)",
        }}
        px="md"
      >
        <Stack mt="md">
          <Group>
            <Text>Login Status:</Text>
            {!isLoaded && <Text>Loading...</Text>}
            {isLoaded && (
              <Text>{isSignedIn ? "authenticated" : "unAuthenticated"}</Text>
            )}
          </Group>

          <Chat />

          <Box ref={bottomRef} mb="md" />
        </Stack>
      </ScrollArea>

      <KeyboardInput onSend={() => scrollToBottom()} />
    </Flex>
  );
}
