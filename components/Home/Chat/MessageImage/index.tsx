import { useState } from "react";
import { Box, Image, LoadingOverlay, rem } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import type { IMessage } from "@/libs/stores/message";

type MessageImageProps = Omit<IMessage, "type">;

const MessageImage = ({ payload }: MessageImageProps) => {
  const { ref, toggle } = useFullscreen();
  const [state, setState] = useState<"loading" | "loaded" | "error">();

  return (
    <Box pos="relative" w={rem(200)} h={rem(200)}>
      <LoadingOverlay
        visible={!state || state === "loading"}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Image
        ref={ref}
        src={payload?.image}
        fallbackSrc="https://placehold.co/200x200?text=Fallback"
        fit="cover"
        h="100%"
        radius="md"
        alt="message-image"
        onClick={() => toggle()}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </Box>
  );
};

export default MessageImage;
