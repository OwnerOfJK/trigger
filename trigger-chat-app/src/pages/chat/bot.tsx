import { withLayout } from "@/layout";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { ChatRoom } from "@/types/chat";
import { useAccount, useSignMessage } from "wagmi";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks";

function ChatbotPage() {
  const { messages, sendMessage, isLoading } = useChat();
  const { address, isConnected } = useAccount();

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleTransfer = async () => {
    if (!isConnected || !address) return;
    const erc20 = getEthersContract(contracts.ERC20);
    const transaction = await erc20.transfer(address, 0);
    await transaction.wait();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} />
      </div>
      <div className="bg-white border-t p-4">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default withLayout(ChatbotPage);
