import { Center } from "@mantine/core";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Center className="h-full">
      <SignIn />
    </Center>
  );
}
