"use client";

import { Check, ChevronDown, Loader2, Wifi, WifiOff } from "lucide-react";
import { type JSX, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";

// Network configurations with their icons and details
const networkConfigs = {
  1: { name: "Ethereum", color: "#627EEA", icon: "🔷", rpc: "mainnet" },
  137: { name: "Polygon", color: "#8247E5", icon: "💜", rpc: "polygon" },
  43114: { name: "Avalanche", color: "#E84142", icon: "🔺", rpc: "avalanche" },
  43113: {
    name: "Avalanche Fuji",
    color: "#E84142",
    icon: "🔻",
    rpc: "avalanche-fuji",
  },
  4158: {
    name: "CrossFi Mainnet",
    color: "#FF0420",
    icon: "🔴",
    rpc: "crossfi-mainnet",
  },
  4157: {
    name: "CrossFi Testnet",
    color: "#FF0420",
    icon: "🔵",
    rpc: "crossfi-testnet",
  },
};

export function NetworkSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentNetwork = chainId
    ? networkConfigs[chainId as keyof typeof networkConfigs]
    : null;

  const handleNetworkSwitch = (targetChainId: number) => {
    switchChain({ chainId: targetChainId });
    setIsOpen(false);
  };

  // Don't show if wallet is not connected
  if (!isConnected) {
    return null;
  }
  let actionIcon: JSX.Element | null = null;
  return (
    <div className="relative">
      <Button
        className="flex min-w-[120px] items-center gap-2 border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
      >
        {currentNetwork ? (
          <>
            <span className="text-sm">{currentNetwork.icon}</span>
            <span className="hidden font-medium text-slate-700 text-sm sm:inline">
              {currentNetwork.name}
            </span>
            <Wifi className="h-3 w-3 text-green-500" />
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="hidden font-medium text-red-600 text-sm sm:inline">
              Unsupported
            </span>
          </>
        )}
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 z-50 mt-2 min-w-[200px] rounded-lg border border-slate-200 bg-white py-2 shadow-xl backdrop-blur-sm">
            <div className="border-slate-100 border-b px-3 py-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">
              Switch Network
            </div>

            {Object.entries(networkConfigs).map(([targetChainId, config]) => {
              const isCurrentChain =
                chainId === Number.parseInt(targetChainId, 10);
              const isChainPending = isPending;

              if (isChainPending) {
                actionIcon = (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                );
              } else if (isCurrentChain) {
                actionIcon = <Check className="h-4 w-4 text-green-500" />;
              }

              return (
                <button
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-slate-50 ${
                    isCurrentChain ? "bg-green-50" : ""
                  } ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  disabled={isPending}
                  key={targetChainId}
                  onClick={() =>
                    handleNetworkSwitch(Number.parseInt(targetChainId, 10))
                  }
                  type="button"
                >
                  <span className="text-lg">{config.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm">
                      {config.name}
                    </div>
                    <div className="text-slate-500 text-xs">
                      Chain ID: {targetChainId}
                    </div>
                  </div>

                  {actionIcon}
                </button>
              );
            })}

            <div className="mt-2 border-slate-100 border-t px-3 py-2">
              <div className="text-slate-400 text-xs">
                {process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
                  ? "🧪 Testnet mode enabled"
                  : "🏭 Mainnet mode"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
