export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface BaseChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface UserChatRoom extends BaseChatRoom {
  type: "individual";
  userId: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away";
}

export interface GroupChatRoom extends BaseChatRoom {
  type: "group";
  members: string[];
  groupAvatarUrl?: string;
}

export interface BotChatRoom extends BaseChatRoom {
  type: "bot";
  botId: string;
  botAvatarUrl?: string;
}

export type ChatRoom = UserChatRoom | GroupChatRoom | BotChatRoom;
