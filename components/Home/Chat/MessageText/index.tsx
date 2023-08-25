import { Text } from "@mantine/core";

import { type IMessageText } from "@/libs/stores/message";

type MessageTextProps = Omit<IMessageText, "type">;

const MessageText = ({ text }: MessageTextProps) => {
  return <Text size="sm">{text}</Text>;
};

export default MessageText;
