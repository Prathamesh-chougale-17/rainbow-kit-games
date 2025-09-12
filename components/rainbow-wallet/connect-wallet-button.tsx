"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConnectWalletButtonProps = {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showBalance?: boolean;
};

export function ConnectWalletButton({
  variant = "default",
  size = "default",
  className,
  showBalance = true,
}: ConnectWalletButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    className={className}
                    onClick={openConnectModal}
                    size={size}
                    variant={variant}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    className={className}
                    onClick={openChainModal}
                    size={size}
                    variant="destructive"
                  >
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {showBalance && (
                    <Button
                      className={cn("mr-1", className)}
                      onClick={openChainModal}
                      size={size}
                      variant="outline"
                    >
                      {account.displayBalance
                        ? `${account.displayBalance}`
                        : ""}
                    </Button>
                  )}

                  <Button
                    className={className}
                    onClick={openAccountModal}
                    size={size}
                    variant="outline"
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
