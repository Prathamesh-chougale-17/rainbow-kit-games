"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  polygonAmoy,
  sepolia,
} from "wagmi/chains";
import { testnet } from "./chains";

// Configuring supported chains and providers for Rainbow Kit
export const config = getDefaultConfig({
  appName: "MediChainX",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    testnet,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [sepolia, polygonAmoy]
      : []),
  ],
  transports:
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? {
          [mainnet.id]: http(),
          [polygon.id]: http(),
          [testnet.id]: http(),
        }
      : {
          [mainnet.id]: http(),
          [polygon.id]: http(),
        },
  ssr: true,
});

export const supportedChains = [
  { id: mainnet.id, name: "Ethereum", icon: "/chains/ethereum.svg" },
  { id: polygon.id, name: "Polygon", icon: "/chains/polygon.svg" },
  { id: optimism.id, name: "Optimism", icon: "/chains/optimism.svg" },
  { id: arbitrum.id, name: "Arbitrum", icon: "/chains/arbitrum.svg" },
  { id: base.id, name: "Base", icon: "/chains/base.svg" },
];
