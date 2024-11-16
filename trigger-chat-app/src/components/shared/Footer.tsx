import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} TriggerChat. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
