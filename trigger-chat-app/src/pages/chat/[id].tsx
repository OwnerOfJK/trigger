import { useState } from "react";
import { useAccount } from "wagmi";
import { getEthersContract } from "wagmi-ethers-adapters/ethers-v5";
import { usePushChat } from "@/components/utils/ChatProvider";
import { contracts } from "@/config";
import React from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useCallback } from "react";
import { withLayout } from "@/layout";
import { CONSTANTS } from "@pushprotocol/restapi";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

function ChatRoom() {
  // Mock data for initial messages
  const { id } = useParams();
  const { address, isConnected } = useAccount();

  const { pushUser } = usePushChat();
  async function transfer() {
    const erc20 = getEthersContract(contracts.ERC20);
    const transaction = await erc20.transfer(address!, 0);
    await transaction.wait();
  }

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("id", id, pushUser);
      const history = await pushUser?.chat.history(id);
      console.log("history", history);
      const messages = history
        .map((hi) => {
          return {
            id: hi.messageObj.cid,
            content: hi.messageObj.content,
            sender: {
              id: hi.fromDID,
              name: hi.fromDID,
              avatar: `https://ui-avatars.com/api/?name=${hi.fromDID
                .split(":")[1]
                .slice(2, 4)}&background=0D8ABC`,
            },
            timestamp: new Date(hi.timestamp),
            status: "sent",
          };
        })
        .reverse();

      setMessages(messages);
    };

    fetchHistory();

    const fetchLatest = async () => {
      const stream = await pushUser?.initStream([CONSTANTS.STREAM.CHAT], {
        filter: {
          channels: ["*"],
          chats: ["*"],
        },
        connection: {
          retries: 3,
        },
        raw: false,
      });

      stream.on(CONSTANTS.STREAM.CHAT, async (event) => {
        console.log("event", event);
        const message = {
          id: event.message.cid,
          content: event.messageObj.content,
          sender: {
            id: event.from,
            name: event.from,
            avatar: `https://ui-avatars.com/api/?name=${event.from
              .split(":")[1]
              .slice(2, 4)}&background=0D8ABC`,
          },
          timestamp: new Date(event.timestamp),
          status: "sent",
        };

        setMessages((prev) => [...prev, message]);
      });
    };

    fetchLatest();
  }, [id, pushUser]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const isCurrentUser = (id: string) => {
    return id.split(":")[1] === pushUser?.account;
  };

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      const message1 = await pushUser?.chat.send(id, {
        type: "Text",
        content: newMessage,
      });

      console.log("message", message1, pushUser);

      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: {
          id: `id:${pushUser?.account}`, // Current user
          name: pushUser?.account,
          avatar: `https://ui-avatars.com/api/?name=${pushUser?.account.slice(
            2,
            4
          )}&background=0D8ABC`,
        },
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    },
    [id, newMessage, pushUser]
  ); // Add dependencies used inside the callback

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              isCurrentUser(message.sender.id) ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isCurrentUser(message.sender.id)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isCurrentUser(message.sender.id) && (
                  <span>
                    {message.status === "read"
                      ? "✓✓"
                      : message.status === "delivered"
                      ? "✓✓"
                      : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-2 border focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default withLayout(ChatRoom);
