import { createContext, useContext, useState, useEffect } from "react";
import { PushAPI } from "@pushprotocol/restapi";
import { useAccount, useWalletClient } from "wagmi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ReactNode } from "react";

interface ChatContextType {
  pushUser: PushAPI | undefined;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType>({
  pushUser: undefined,
  isLoading: true,
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [pushUser, setPushUser] = useState<PushAPI>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!account || !walletClient) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await PushAPI.initialize(walletClient, {
          env: ENV.DEV,
          alpha: { feature: ["SCALABILITY_V2"] },
        });
        setPushUser(user);
      } catch (error) {
        console.error("Failed to initialize Push user:", error);
      }
      setIsLoading(false);
    })();
  }, [account, walletClient]);

  return (
    <ChatContext.Provider value={{ pushUser, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export const usePushChat = () => useContext(ChatContext);
