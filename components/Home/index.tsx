"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  ScrollArea,
  Text,
  SegmentedControl,
  Center,
  Input,
  Stack,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const NavbarFooter = dynamic(() => import("./NavbarFooter"));
const Main = dynamic(() => import("./Main"), {
  ssr: false,
});

function NavbarSection() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          <NavbarFooter />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main className="h-screen">
        <Main />
      </AppShell.Main>
    </AppShell>
  );
}

export default function App() {
  return (
    <SessionProvider session={null}>
      <NavbarSection />
    </SessionProvider>
  );
}
