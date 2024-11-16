import React from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  lastActivityAt: string;
  participantsCount: number;
  unreadCount?: number;
  avatarUrl?: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  // This would typically come from an API
  const chatRooms: ChatRoom[] = [
    {
      id: "1",
      name: "General",
      lastMessage: "Hello everyone!",
      lastActivityAt: new Date().toISOString(),
      participantsCount: 5,
      unreadCount: 3,
      avatarUrl: "https://ui-avatars.com/api/?name=General&background=random",
    },
    {
      id: "2",
      name: "Project Alpha",
      lastMessage: "The meeting is scheduled for tomorrow",
      lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
      participantsCount: 8,
      unreadCount: 0,
      avatarUrl: "https://ui-avatars.com/api/?name=Project+Alpha&background=random",
    },
    // Add more rooms as needed
  ];

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room.id)}
            className="flex inline-flex w-full items-center px-4 py-3 space-x-4 bg-white hover:bg-gray-50 cursor-pointer border-b transition-colors"
          >
            {/* Avatar */}
            <img src={room.avatarUrl} alt={room.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">{room.name}</h2>
              <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
            </div>

            {/* Time and Unread */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-gray-500">{formatLastActivity(room.lastActivityAt)}</span>
              {room.unreadCount ? (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">{room.unreadCount}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => navigate("/chat/new")}
        className="fixed right-6 bottom-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Chat;
