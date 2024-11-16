import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              TriggerChat
            </Link>
          </div>

          <nav className="flex space-x-4">
            <Link
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
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
