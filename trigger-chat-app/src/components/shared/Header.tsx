import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();

  return (
    <header className="bg-blue-100 border-b shadow-sm w-full">
      <div className="px-4">
        <div className="flex justify-between items-center h-16 flex-1">
          <div className="flex items-center">
            <Link to="/chat" className="text-xl font-bold text-gray-800">
              Trigger
            </Link>
          </div>

          <nav className="flex  ">
            {/* <Link
              to="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith("/chat")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Chats
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/profile"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Profile
            </Link> */}

            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
