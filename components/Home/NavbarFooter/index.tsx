import { useMemo, forwardRef } from "react";
import { useRouter } from "next/navigation";
import {
  SimpleGrid,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  useComputedColorScheme,
  type ActionIconProps,
} from "@mantine/core";
import {
  IconLogin,
  IconLogout,
  IconSun,
  IconMoon,
  IconSettings,
} from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import useEvent from "react-use-event-hook";

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
  const router = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { isSignedIn, signOut } = useAuth();
  const isLoggedIn = useMemo(() => isSignedIn, [isSignedIn]);

  const handleLogin = useEvent(() => {
    if (isLoggedIn) {
      signOut();
    } else {
      router.push("/sign-in");
    }
  });

  return (
    <>
      <SimpleGrid cols={3} spacing={0}>
        <Tooltip label={isLoggedIn ? "Log Out" : "Log In"}>
          <ButtonWithIcon
            onClick={() => handleLogin()}
            style={{ width: "100%" }}
          >
            {isLoggedIn ? <IconLogout size={24} /> : <IconLogin size={24} />}
          </ButtonWithIcon>
        </Tooltip>
        <Tooltip
          label={computedColorScheme === "light" ? "Dark Mode" : "Light Mode"}
        >
          <ButtonWithIcon
            onClick={() => toggleColorScheme()}
            style={{ width: "100%" }}
          >
            {computedColorScheme === "light" ? (
              <IconSun size={24} />
            ) : (
              <IconMoon size={24} />
            )}
          </ButtonWithIcon>
        </Tooltip>
        <Tooltip label="Settings">
          <ButtonWithIcon aria-label="Settings" style={{ width: "100%" }}>
            <IconSettings size={24} />
          </ButtonWithIcon>
        </Tooltip>
      </SimpleGrid>
    </>
  );
}
