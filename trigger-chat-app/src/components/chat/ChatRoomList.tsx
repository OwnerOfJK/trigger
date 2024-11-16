import { useNavigate } from "react-router-dom";
import { ChatRoom } from "@/types/chat";

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
}

export default function ChatRoomList({ chatRooms }: ChatRoomListProps) {
  const navigate = useNavigate();

  const handleChatSelect = (chatRoom: ChatRoom) => {
    navigate(`/chat/${chatRoom.type}/${chatRoom.id}`);
  };

  return (
    <div className="flex flex-col w-full max-w-xs border-r border-gray-200">
      {chatRooms.map((room) => (
        <ChatRoomItem
          key={room.id}
          room={room}
          onClick={() => handleChatSelect(room)}
        />
      ))}
    </div>
  );
}

function ChatRoomItem({
  room,
  onClick,
}: {
  room: ChatRoom;
  onClick: () => void;
}) {
  const getAvatarUrl = () => {
    switch (room.type) {
      case "individual":
        return room.avatarUrl;
      case "group":
        return room.groupAvatarUrl;
      case "bot":
        return room.botAvatarUrl;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="relative">
        <img
          src={getAvatarUrl() || "/default-avatar.png"}
          alt={room.name}
          className="w-12 h-12 rounded-full"
        />
        {room.type === "individual" && room.status && (
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
              room.status === "online"
                ? "bg-green-500"
                : room.status === "away"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          />
        )}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{room.name}</h3>
          {room.lastMessageTime && (
            <span className="text-sm text-gray-500">
              {new Date(room.lastMessageTime).toLocaleTimeString()}
            </span>
          )}
        </div>
        {room.lastMessage && (
          <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
        )}
      </div>

      {room.unreadCount && room.unreadCount > 0 && (
        <div className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {room.unreadCount}
        </div>
      )}
    </div>
  );
}
