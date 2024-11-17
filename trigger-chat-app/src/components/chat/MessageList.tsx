import React from "react";
import { MessageItem } from "./MessageItem";
import { Message } from "@/types/chat";
import styles from "./MessageList.module.css";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === "bot" ? styles.botMessage : styles.userMessage
          }`}
        >
          <div className={styles.content}>{message.content}</div>
          {/* <div className={styles.timestamp}>{message.timestamp.toLocaleTimeString()}</div> */}
        </div>
      ))}
    </div>
  );
};
