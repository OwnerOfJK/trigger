import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Chat from "../pages/Chat";
import ChatRoom from "../pages/ChatRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "chat",
        element: <Chat />,
        children: [
          {
            index: true,
            element: <div className="flex-1 flex items-center justify-center text-gray-500">Chat</div>,
          },
          {
            path: ":type/:id",
            element: <ChatRoom />,
          },
        ],
      },
      // ... your other existing routes
    ],
  },
]);
