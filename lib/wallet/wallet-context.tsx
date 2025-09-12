"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { isValidWalletAddress, normalizeWalletAddress } from "./validation";

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  isReconnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  normalizedAddress: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const { address, isConnected, isReconnecting } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(true);

  // Normalize the address for consistent storage and comparison
  const normalizedAddress =
    address && isValidWalletAddress(address)
      ? normalizeWalletAddress(address)
      : null;

  useEffect(() => {
    // Set loading to false once we have initial connection state
    if (!isReconnecting) {
      setIsLoading(false);
    }
  }, [isReconnecting]);

  const handleConnect = () => {
    // Use the first available connector (usually MetaMask or injected)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const contextValue: WalletContextType = {
    address: address || null,
    isConnected,
    isLoading: isLoading || isConnecting || isReconnecting,
    isReconnecting,
    connect: handleConnect,
    disconnect,
    normalizedAddress,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Hook to access wallet context
 * @returns Wallet context value
 * @throws Error if used outside WalletProvider
 */
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
/**

 * Hook that requires wallet connection for components/routes
 * Provides wallet state and handles connection requirements
 * @param options Configuration options for wallet requirement
 * @returns Wallet state with connection utilities
 */
type UseRequireWalletOptions = {
  /** Whether to redirect if wallet is not connected */
  redirectOnDisconnect?: boolean;
  /** Custom redirect path (defaults to current page with connection prompt) */
  redirectPath?: string;
  /** Whether to show loading state while checking connection */
  showLoadingState?: boolean;
};

interface UseRequireWalletReturn extends WalletContextType {
  /** Whether the wallet requirement is satisfied */
  isWalletRequired: boolean;
  /** Whether to show connection prompt */
  shouldShowConnectPrompt: boolean;
  /** Function to prompt user to connect wallet */
  promptConnection: () => void;
}

export function useRequireWallet(
  options: UseRequireWalletOptions = {}
): UseRequireWalletReturn {
  const {
    redirectOnDisconnect = false,
    // showLoadingState = true,
  } = options;

  const wallet = useWallet();
  const { isConnected, isLoading, connect } = wallet;

  const [shouldShowConnectPrompt, setShouldShowConnectPrompt] = useState(false);

  useEffect(() => {
    // If not loading and not connected, determine what to do
    if (!(isLoading || isConnected)) {
      if (redirectOnDisconnect) {
        // Could implement redirect logic here if needed
        // For now, we'll just show the connect prompt
        setShouldShowConnectPrompt(true);
      } else {
        setShouldShowConnectPrompt(true);
      }
    } else if (isConnected) {
      setShouldShowConnectPrompt(false);
    }
  }, [isLoading, isConnected, redirectOnDisconnect]);

  const promptConnection = () => {
    setShouldShowConnectPrompt(true);
    connect();
  };

  return {
    ...wallet,
    isWalletRequired: true,
    shouldShowConnectPrompt: shouldShowConnectPrompt && !isConnected,
    promptConnection,
  };
}

/**
 * Higher-order component that requires wallet connection
 * Wraps a component and ensures wallet is connected before rendering
 */
type WithWalletRequiredProps = {
  fallback?: React.ComponentType;
  loadingComponent?: React.ComponentType;
};

export function withWalletRequired<P extends object>(
  Component: React.ComponentType<P>,
  options: WithWalletRequiredProps = {}
) {
  const { fallback: Fallback, loadingComponent: LoadingComponent } = options;

  return function WalletRequiredComponent(props: P) {
    const {
      isConnected,
      isLoading,
      shouldShowConnectPrompt,
      promptConnection,
    } = useRequireWallet();

    if (isLoading && LoadingComponent) {
      return <LoadingComponent />;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-muted-foreground">Connecting to wallet...</p>
          </div>
        </div>
      );
    }

    if (!isConnected || shouldShowConnectPrompt) {
      if (Fallback) {
        return <Fallback />;
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="mb-4 font-bold text-2xl">
              Wallet Connection Required
            </h2>
            <p className="mb-6 text-muted-foreground">
              Please connect your wallet to access this feature.
            </p>
            <Button
              className="rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={promptConnection}
              type="button"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
