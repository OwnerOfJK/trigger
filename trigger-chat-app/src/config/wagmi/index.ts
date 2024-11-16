import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import type { CreateConfigParameters } from "wagmi";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const configs: Record<string, CreateConfigParameters> = {
  1: {
    chains: [mainnet],
    transports: { [mainnet.id]: http() },
  },
  11155111: {
    chains: [sepolia],
    transports: { [sepolia.id]: http() },
  },
};

const wallets = getDefaultWallets().wallets;

export const config = createConfig({
  connectors: connectorsForWallets(wallets, {
    appName: "Starter",
    projectId: "f993a0cda4a3880fad05493dd58f9f4a",
  }),
  ...configs[import.meta.env.VITE_APP_CHAIN_ID],
});
