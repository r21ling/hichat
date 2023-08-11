import { useMemo, useEffect, forwardRef } from "react";
import {
  SimpleGrid,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconLogin,
  IconLogout,
  IconSun,
  IconMoon,
  IconSettings,
} from "@tabler/icons-react";
import type { ActionIconProps } from "@mantine/core";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import useEvent from "react-use-event-hook";
import dynamic from "next/dynamic";
import { useDisclosure } from "@mantine/hooks";

const AuthModal = dynamic(() => import("@/components/AuthModal"));

const ButtonWithIcon = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ActionIconProps & React.DOMAttributes<any>>
>(function Button({ children, ...rest }, ref) {
  return (
    <ActionIcon
      variant="subtle"
      size="xl"
      color="gray"
      ref={ref}
      {...rest}
      className="w-full"
    >
      {children}
    </ActionIcon>
  );
});

export default function Footer() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { status } = useSession();
  const isLoggedIn = useMemo(() => status === "authenticated", [status]);

  const [signInOpened, { open, close }] = useDisclosure();

  const handleLogin = useEvent(() => {
    if (isLoggedIn) {
      signOut();
    } else {
      open();
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      close();
    }
  }, [close, isLoggedIn]);

  return (
    <>
      <SimpleGrid cols={3} spacing={0}>
        <Tooltip label={isLoggedIn ? "Log Out" : "Log In"}>
          <ButtonWithIcon onClick={() => handleLogin()}>
            {isLoggedIn ? <IconLogout size={24} /> : <IconLogin size={24} />}
          </ButtonWithIcon>
        </Tooltip>
        <Tooltip
          label={computedColorScheme === "light" ? "Dark Mode" : "Light Mode"}
        >
          <ButtonWithIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
          >
            {computedColorScheme === "light" ? (
              <IconSun size={24} />
            ) : (
              <IconMoon size={24} />
            )}
          </ButtonWithIcon>
        </Tooltip>
        <Tooltip label="Settings">
          <ButtonWithIcon aria-label="Settings">
            <IconSettings size={24} />
          </ButtonWithIcon>
        </Tooltip>
      </SimpleGrid>

      <AuthModal opened={signInOpened} onClose={close} />
    </>
  );
}
