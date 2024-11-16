// import { withLayout } from "@/layout";
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Client,
//   type Signer,
//   type Conversation,
//   DecodedMessage,
// } from "@xmtp/browser-sdk";
// import { ChatRoom } from "@/types/chat";
// import { useAccount } from "wagmi";

// const Chat: React.FC = () => {
//   const navigate = useNavigate();

//   const [client, setClient] = React.useState<Client | null>(null);

//   const [conversations, setConversations] = React.useState<Conversation[]>([]);
//   const [messages, setMessages] = React.useState<Map<string, DecodedMessage[]>>(
//     new Map()
//   );

//   const aaSigner: Signer = {
//     getAddress: () => accountAddress,
//     signMessage: async (message) => {
//       // return value from a signing method here
//     },
//     // these methods are required for smart contract wallets
//     // block number is optional
//     getBlockNumber: () => undefined,
//     // this example uses the Base chain
//     getChainId: () => BigInt(8453),
//   };

//   // this value should be generated once per installation and stored securely
//   const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32));
//   console.log("encryptionKey", encryptionKey);

//   const { address: accountAddress } = useAccount();

//   useEffect(() => {
//     const setup = async () => {
//       if (!accountAddress) return;

//       const signer: Signer = {
//         getAddress: () => accountAddress,
//         signMessage: async (message) => {
//           // return value from a signing method here
//         },
//       };

//       const c = await Client.create(
//         signer,
//         encryptionKey
//         // options /* optional */
//       );
//       setClient(c);
//     };
//     setup();
//   }, [accountAddress]);

//   const handleListGroups = async () => {
//     if (client) {
//       const groups = await client.conversations.list();
//       setConversations(groups);
//     }
//   };

//   useEffect(() => {
//     handleListGroups();
//   }, [client]);

//   // This would typically come from an API
//   const chatRooms: ChatRoom[] = [
//     {
//       id: "1",
//       name: "Chatbot",
//       lastMessage: "Hello everyone!",
//       lastActivityAt: new Date().toISOString(),
//       participantsCount: 5,
//       unreadCount: 3,
//       avatarUrl: "https://ui-avatars.com/api/?name=General&background=random",

//       type: "bot",
//       botId: "1",
//       botAvatarUrl:
//         "https://ui-avatars.com/api/?name=General&background=random",
//     },
//     {
//       id: "1",
//       name: "General",
//       lastMessage: "Hello everyone!",
//       lastActivityAt: new Date().toISOString(),
//       participantsCount: 5,
//       unreadCount: 3,
//       avatarUrl: "https://ui-avatars.com/api/?name=General&background=random",
//       groupAvatarUrl:
//         "https://ui-avatars.com/api/?name=General&background=random",
//       type: "group",
//       members: ["0x...", "0x..."],
//     },
//     {
//       id: "1",
//       name: "General",
//       lastMessage: "Hello everyone!",
//       lastActivityAt: new Date().toISOString(),
//       participantsCount: 5,
//       unreadCount: 3,
//       avatarUrl: "https://ui-avatars.com/api/?name=General&background=random",
//       type: "individual",
//       userId: "0x...",
//     },

//     // Add more rooms as needed
//   ];

//   const handleRoomClick = (roomId: string) => {
//     navigate(`/chat/${roomId}`);
//   };

//   const createNewChat = async (address: string) => {
//     if (client) {
//       const group = await client.conversations.newDm(address);
//       await group.sync();
//       await handleListGroups();
//     }
//   };

//   const formatLastActivity = (date: string) => {
//     const now = new Date();
//     const activity = new Date(date);
//     const diff = now.getTime() - activity.getTime();

//     if (diff < 60000) return "Just now";
//     if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//     return activity.toLocaleDateString();
//   };

//   return (
//     <div className="h-screen w-full flex flex-col bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow px-4 py-6">
//         <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
//       </div>

//       {/* Chat Rooms List */}
//       <div className="flex-1 overflow-y-auto">
//         {chatRooms.map((room) => (
//           <div
//             key={room.id}
//             onClick={() => handleRoomClick(room.id)}
//             className="flex inline-flex w-full items-center px-4 py-3 space-x-4 bg-white hover:bg-gray-50 cursor-pointer border-b transition-colors"
//           >
//             {/* Avatar */}
//             <img
//               src={room.avatarUrl}
//               alt={room.name}
//               className="w-12 h-12 rounded-full object-cover flex-shrink-0"
//             />

//             {/* Room Info */}
//             <div className="flex-1 min-w-0">
//               <h2 className="font-semibold text-gray-800 truncate">
//                 {room.name}
//               </h2>
//               <p className="text-sm text-gray-600 truncate">
//                 {room.lastMessage}
//               </p>
//             </div>

//             {/* Time and Unread */}
//             <div className="flex flex-col items-end gap-1 flex-shrink-0">
//               <span className="text-xs text-gray-500">
//                 {formatLastActivity(room.lastActivityAt)}
//               </span>
//               {room.unreadCount ? (
//                 <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
//                   {room.unreadCount}
//                 </span>
//               ) : null}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* FAB - Floating Action Button */}
//       <button
//         onClick={() => navigate("/chat/new")}
//         className="fixed right-6 bottom-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 4v16m8-8H4"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default withLayout(Chat);


import { withLayout } from "@/layout";
import { ChatRoom } from "@/components/chat/ChatRoom";

function Chat() {
  return (
    <div className="flex h-screen">
      <ChatRoom />
    </div>
  );
}

export default withLayout(Chat);