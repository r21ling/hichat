import { shallow } from "zustand/shallow";

import { useMessageStore } from "@/libs/stores/message";

import Message from "./Message";

const Chat = () => {
  const { messages } = useMessageStore((state) => state, shallow);

  return (
    <>
      {messages?.map?.((message) => (
        <Message key={message.id} {...message} />
      ))}
    </>
  );
};

export default Chat;
