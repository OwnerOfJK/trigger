import { useState } from "react";
import { useAccount } from "wagmi";
import { withLayout } from "../layout";
import { getEthersContract } from "wagmi-ethers-adapters/ethers-v5";

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
  const { address, isConnected } = useAccount();
  async function transfer() {
    const erc20 = getEthersContract(contracts.ERC20);
    const transaction = await erc20.transfer(address!, 0);
    await transaction.wait();
  }

  const mockMessages: Message[] = [
    {
      id: "1",
      content: "Hey team, how's the progress on the new feature?",
      sender: {
        id: "user1",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC",
      },
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      status: "read",
    },
    {
      id: "2",
      content:
        "We've completed the frontend part, just working on API integration now.",
      sender: {
        id: "user2",
        name: "Sarah Smith",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Smith&background=FF4B91",
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "read",
    },
    {
      id: "3",
      content: "Great progress! Any blockers we should know about?",
      sender: {
        id: "user1",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC",
      },
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
      status: "read",
    },
    {
      id: "4",
      content:
        "No blockers at the moment. We should be able to deliver by EOD.",
      sender: {
        id: "user3",
        name: "Mike Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Johnson&background=7A3E3E",
      },
      timestamp: new Date(Date.now() - 900000), // 15 mins ago
      status: "delivered",
    },
    {
      id: "5",
      content: "Perfect! Let's review it in tomorrow's standup 👍",
      sender: {
        id: "user1",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC",
      },
      timestamp: new Date(Date.now() - 300000), // 5 mins ago
      status: "sent",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: "user1", // Current user
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC",
      },
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.sender.id === "user1" ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender.id === "user1"
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
                {message.sender.id === "user1" && (
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

          <div className="flex-center mt-12px">
            <button onClick={transfer}>Pay</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;
