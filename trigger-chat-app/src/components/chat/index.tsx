import ChatRoomList from "@/components/chat/ChatRoomList";
import { Outlet } from "react-router-dom";
import { ChatRoom } from "@/types/chat";

export default function Chat() {
  // Example data - you would typically fetch this from your API
  const chatRooms: ChatRoom[] = [
    {
      id: "1",
      type: "individual",
      name: "John Doe",
      userId: "user1",
      status: "online",
      lastMessage: "Hey, how are you?",
      lastMessageTime: new Date(),
      unreadCount: 2,
    },
    {
      id: "2",
      type: "group",
      name: "Project Team",
      members: ["user1", "user2", "user3"],
      lastMessage: "Meeting at 2 PM",
      lastMessageTime: new Date(),
    },
    {
      id: "3",
      type: "bot",
      name: "AI Assistant",
      botId: "bot1",
      lastMessage: "How can I help you today?",
      lastMessageTime: new Date(),
    },
  ];

  return (
    <div className="flex h-screen">
      <ChatRoomList chatRooms={chatRooms} />
      <Outlet />
    </div>
  );
}
