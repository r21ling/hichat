import { useMemo } from "react";
import { shallow } from "zustand/shallow";

import { useChannelStore } from "@/libs/stores/channel";
import { useMessageStore } from "@/libs/stores/message";

import Message from "./Message";
import { useChannelMessage } from "./hooks";

const Chat = () => {
  useChannelMessage();

  const { activeChannel } = useChannelStore(
    (state) => ({
      activeChannel: state.activeChannel,
    }),
    shallow
  );
  const { channelMessageMap } = useMessageStore(
    (state) => ({
      channelMessageMap: state.channelMessageMap,
    }),
    shallow
  );

  const messages = useMemo(() => {
    return activeChannel?.id ? channelMessageMap.get(activeChannel?.id) : [];
  }, [activeChannel?.id, channelMessageMap]);

  return (
    <>
      {messages?.map?.((message) => (
        <Message key={message.id} {...message} />
      ))}
    </>
  );
};

export default Chat;
