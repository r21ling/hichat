import { Box, Image, LoadingOverlay, rem } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { shallow } from "zustand/shallow";
import { useEvent } from "react-use-event-hook";

import { useMessageStore, type IMessageImage } from "@/libs/stores/message";

type MessageImageProps = Omit<IMessageImage, "type">;

const MessageImage = ({ image, state, ...rest }: MessageImageProps) => {
  const { updateMessage } = useMessageStore((state) => state, shallow);

  const { ref, toggle } = useFullscreen();
  const handleUpdateMessageState = useEvent(
    (newState: IMessageImage["state"]) => {
      updateMessage<IMessageImage>({
        ...rest,
        image,
        state: newState,
      });
    }
  );

  return (
    <Box pos="relative" w={rem(200)} h={rem(200)}>
      <LoadingOverlay
        visible={!state || state === "loading"}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Image
        ref={ref}
        src={image}
        fallbackSrc="https://placehold.co/200x200?text=Fallback"
        fit="cover"
        h="100%"
        radius="md"
        alt="message-image"
        onClick={() => toggle()}
        onLoad={() => handleUpdateMessageState("loaded")}
        onError={() => handleUpdateMessageState("error")}
      />
    </Box>
  );
};

export default MessageImage;
