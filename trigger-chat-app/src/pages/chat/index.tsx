import { withLayout } from "@/layout";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { ChatRoom } from "@/types/chat";
import { useAccount, useSignMessage } from "wagmi";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { useChat } from "@/hooks";
import { usePushChat } from "@/components/utils/ChatProvider";

const ChatbotChatRoom = {
  id: "bot",
  name: "Talk to Chatbot",
  lastMessage: "Hello everyone!",
  lastActivityAt: new Date().toISOString(),
  participantsCount: 5,
  unreadCount: 3,
  avatarUrl: "https://ui-avatars.com/api/?name=General&background=random",

  type: "bot",
  botId: "1",
  botAvatarUrl: "https://ui-avatars.com/api/?name=General&background=random",
};

const Chat: React.FC = () => {
  const navigate = useNavigate();

  const { pushUser, isLoading } = usePushChat();

  const [conversations, setConversations] = React.useState<ChatRoom[]>([
    ChatbotChatRoom,
  ]);

  const [messages, setMessages] = React.useState<Map<string, DecodedMessage[]>>(
    new Map()
  );

  const { signMessageAsync } = useSignMessage();
  const aaSigner: Signer = {
    getAddress: () => accountAddress,
    signMessage: async (message: string) => {
      return signMessageAsync({ message });
    },
    // these methods are required for smart contract wallets
    // block number is optional
    getBlockNumber: () => undefined,
    // this example uses the Base chain
    getChainId: () => BigInt(8453),
  };

  // this value should be generated once per installation and stored securely
  const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32));
  console.log("encryptionKey", encryptionKey);

  const { address: accountAddress } = useAccount();

  useEffect(() => {
    const list = pushUser?.chat.list("CHATS");
    list?.then((res) => {
      console.log("res", res);
    });

    setConversations(list);
    console.log("list", list);
  }, [pushUser]);

  // This would typically come from an API

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  const formatLastActivity = (date: string) => {
    const now = new Date();
    const activity = new Date(date);
    const diff = now.getTime() - activity.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return activity.toLocaleDateString();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}

      <div className="bg-white shadow px-4 py-6 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Messages</h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/chat/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Create Group
          </button>
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {conversations?.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room.id)}
            className="flex inline-flex w-full items-center px-4 py-3 space-x-4 bg-white hover:bg-gray-50 cursor-pointer border-b transition-colors"
          >
            {/* Avatar */}
            <img
              src={room.avatarUrl}
              alt={room.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">
                {room.name}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {room.lastMessage}
              </p>
            </div>

            {/* Time and Unread */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-gray-500">
                {formatLastActivity(room.lastActivityAt)}
              </span>
              {room.unreadCount ? (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {room.unreadCount}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => navigate("/chat/create")}
        className="fixed right-6 bottom-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default withLayout(Chat);
