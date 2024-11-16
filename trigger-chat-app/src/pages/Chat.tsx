import React from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  lastActivityAt: string;
  participantsCount: number;
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
    },
    // Add more rooms as needed
  ];

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chat Rooms</h1>
      <div className="space-y-2">
        {chatRooms.map((room) => (
          <div key={room.id} onClick={() => handleRoomClick(room.id)} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{room.name}</h2>
              <span className="text-sm text-gray-500">{new Date(room.lastActivityAt).toLocaleDateString()}</span>
            </div>
            {room.lastMessage && <p className="text-sm text-gray-600 mt-1">{room.lastMessage}</p>}
            <p className="text-xs text-gray-500 mt-1">{room.participantsCount} participants</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
