"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Text,
  SegmentedControl,
  Center,
  Input,
  Stack,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import dynamic from "next/dynamic";

const Channel = dynamic(() => import("./Channel"));
const NavbarFooter = dynamic(() => import("./NavbarFooter"));
const Main = dynamic(() => import("./Main"), {
  ssr: false,
});

const queryClient = new QueryClient();

export default function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 280,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text>Hi Chat</Text>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section>
            <Stack>
              <Center>
                <SegmentedControl data={["React", "Angular", "Vue"]} />
              </Center>

              <Input
                placeholder="Search"
                leftSection={<IconSearch size={16} />}
              />
            </Stack>
          </AppShell.Section>
          <AppShell.Section grow my="md" component={ScrollArea}>
            <Channel />
          </AppShell.Section>
          <AppShell.Section>
            <NavbarFooter />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main className="h-screen">
          <Main />
        </AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
