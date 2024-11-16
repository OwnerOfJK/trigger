import React from "react";
import { Message } from "@/types/chat";

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
        {message.content}
      </div>
    </div>
  );
};
