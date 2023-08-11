import { Modal, Title, Stack, Group, ActionIcon, Text } from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import useEvent from "react-use-event-hook";

type AuthModalProps = ModalProps;

export default function SignInModal({ ...restProps }: AuthModalProps) {
  const popupCenter = useEvent((url, title = "Sign In") => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${
        550 / systemZoom
      },top=${top},left=${left}`
    );

    newWindow?.focus();
  });

  return (
    <Modal {...restProps}>
      <Stack gap="xl">
        <Title order={3} className="text-center">
          Please Choose your Sign In Platform
        </Title>

        <Group justify="center" gap="xl">
          <ActionIcon
            variant="subtle"
            size="xl"
            color="gray"
            onClick={() => popupCenter("/sign-in/google")}
          >
            <IconBrandGoogle size="lg" />
          </ActionIcon>
          <ActionIcon variant="subtle" size="xl" color="gray">
            <IconBrandGithub
              size="lg"
              onClick={() => popupCenter("/sign-in/github")}
            />
          </ActionIcon>
        </Group>

        <Text className="text-center">
          By signing up or logging in you are agreeing to our Terms of Service
          and Privacy Policy .
        </Text>
      </Stack>
    </Modal>
  );
}
