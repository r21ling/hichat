import { Center } from "@mantine/core";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <Center className="h-full">
      <SignUp />
    </Center>
  );
}
