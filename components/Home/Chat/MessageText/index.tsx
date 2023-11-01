import { Text } from "@mantine/core";

import type { IMessage } from "@/libs/stores/message";

type MessageTextProps = Omit<IMessage, "type">;

const MessageText = ({ payload }: MessageTextProps) => {
  return (
    <Text size="sm" className="break-all">
      {payload?.text}
    </Text>
  );
};

export default MessageText;
