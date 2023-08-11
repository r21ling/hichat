import { ScrollArea, Group, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const KeyboardInput = dynamic(() => import("./KeyboardInput"));

export default function Main() {
  const { status } = useSession();

  return (
    <ScrollArea className="h-full relative">
      <Group className="h-[1200px]">
        <Text>Login Status:</Text>
        <Text>{status}</Text>
      </Group>

      <KeyboardInput />
    </ScrollArea>
  );
}
