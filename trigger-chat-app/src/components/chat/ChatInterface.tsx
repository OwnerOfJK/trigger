import React from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Message } from "@/types/chat";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage }) => {
  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      <ChatInput onSend={onSendMessage} />
    </div>
  );
};
