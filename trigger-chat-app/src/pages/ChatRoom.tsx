import { useState } from "react";

interface Message {
  id: string;
  content: string;
  // Add other message properties as needed
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div>
      {/* Your chat room UI */}
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {/* Your message input component */}
    </div>
  );
};

export default ChatRoom;
