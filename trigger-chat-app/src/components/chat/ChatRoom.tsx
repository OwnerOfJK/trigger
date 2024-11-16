import { useAccount } from 'wagmi'
import { getEthersContract } from 'wagmi-ethers-adapters/ethers-v5'
import { contracts } from '@/config'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useChat } from '@/hooks/useChat'

export function ChatRoom() {
  const { messages, sendMessage, isLoading } = useChat()
  const { address, isConnected } = useAccount()

  const handleSendMessage = (message: string) => {
    sendMessage(message)
  }

  const handleTransfer = async () => {
    if (!isConnected || !address) return
    const erc20 = getEthersContract(contracts.ERC20)
    const transaction = await erc20.transfer(address, 0)
    await transaction.wait()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      <div className="bg-white border-t p-4">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        {isConnected && (
          <div className="mt-2 flex justify-end">
            <button 
              onClick={handleTransfer}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Pay
            </button>
          </div>
        )}
      </div>
    </div>
  )
}