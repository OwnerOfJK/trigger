import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { MountsProvider, WagmiConfigProvider } from "./components";
import { config } from "./config";
import routes from "~react-pages";

import "@rainbow-me/rainbowkit/styles.css";
import "virtual:uno.css";
import "./styles/index.css";
import { ChatProvider } from "@/components/utils/ChatProvider";

function App() {
  return (
    <MountsProvider
      install={[
        { component: WagmiConfigProvider, props: { config } },
        { component: RainbowKitProvider },
      ]}
    >
      <ChatProvider>
        <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>
      </ChatProvider>
    </MountsProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
