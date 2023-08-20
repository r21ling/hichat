import { shallow } from "zustand/shallow";

import { useChatStore } from "@/libs/stores/chat";

import Message from "./Message";

const Chat = () => {
  const { messages } = useChatStore((state) => state, shallow);

  return (
    <>
      {messages?.map?.((message) => (
        <Message key={message.id} {...message} />
      ))}
    </>
  );
};

export default Chat;
