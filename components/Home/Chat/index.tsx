import Message from "./Message";
import { useMessageByActiveChannel } from "./hooks";

const Chat = () => {
  const { messages } = useMessageByActiveChannel();

  return (
    <>
      {messages?.map?.((message) => (
        <Message key={message.id} {...message} />
      ))}
    </>
  );
};

export default Chat;
