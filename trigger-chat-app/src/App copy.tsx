import { useAccount, useConnect, useDisconnect } from "wagmi";
import { MessageList } from "./components/chat/MessageList";
import { ChatInterface } from "./components/chat/ChatInterface";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      <h2>Chat</h2>

      <ChatInterface
        messages={[
          { id: "1", content: "Hello!", sender: "bot", timestamp: new Date() },
          { id: "2", content: "Hello!2 ", sender: "user", timestamp: new Date() },
        ]}
        onSendMessage={() => {}}
      />

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button key={connector.uid} onClick={() => connect({ connector })} type="button">
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default App;
