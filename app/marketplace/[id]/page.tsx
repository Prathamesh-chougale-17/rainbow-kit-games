"use client";

import { ArrowLeft, Share2, Store } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Game {
  _id?: string;
  gameId: string;
  walletAddress: string;
  title: string;
  description?: string;
  tags?: string[];
  currentVersion: number;
  versions: {
    version: number;
    ipfsCid: string;
    ipfsUrl?: string;
    html?: string;
    createdAt: Date;
  }[];
  isPublishedToMarketplace: boolean;
  isPublishedToCommunity: boolean;
  marketplacePublishedAt?: Date;
  communityPublishedAt?: Date;
  forkCount: number;
  originalGameId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MarketplaceGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [game, setGame] = React.useState<Game | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/marketplace`);
        const result = await response.json();

        if (result.success) {
          const foundGame = result.games.find((g: Game) => g.gameId === gameId);
          if (foundGame) {
            if (mounted) setGame(foundGame);
          } else {
            toast.error("Game not found");
            router.push("/marketplace");
          }
        }
      } catch (error) {
        console.error("Load game error:", error);
        toast.error("Failed to load game");
        router.push("/marketplace");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [gameId, router]);

  // Hide the global navbar/header while on the full-screen marketplace game page
  React.useEffect(() => {
    const header =
      typeof document !== "undefined"
        ? (document.querySelector("header") as HTMLElement | null)
        : null;
    if (header) {
      const prevDisplay = header.style.display;
      header.style.display = "none";
      return () => {
        header.style.display = prevDisplay || "";
      };
    }
    return () => {};
  }, []);

  const handleShare = () => {
    if (navigator.share && game) {
      navigator.share({
        title: game.title,
        text: `Check out this awesome game: ${game.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Game link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Game not found</h3>
          <p className="text-muted-foreground mb-6">
            The game you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/marketplace">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestVersion = game.versions[game.versions.length - 1];
  const gameUrl = latestVersion?.ipfsUrl;

  return (
    <div className="min-h-screen h-screen w-screen bg-black">
      <div className="relative h-screen w-full">
        {/* Full-viewport game iframe */}
        {gameUrl ? (
          <iframe
            src={gameUrl}
            className="w-full h-full border-0"
            title={game.title}
          />
        ) : latestVersion?.html ? (
          <iframe
            srcDoc={latestVersion.html}
            className="w-full h-full border-0"
            title={game.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Game not available</p>
          </div>
        )}

        {/* Top-left overlay: back button + title */}
        <div className="absolute top-12 left-4 z-50 flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-white">{game.title}</h1>
        </div>

        {/* Top-right overlay: avatar (popover) + share button */}
        <div className="absolute top-12 right-4 z-50 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-0">
                <Avatar>
                  {game.walletAddress ? (
                    <AvatarFallback className="text-xs">
                      {formatWalletAddress(game.walletAddress)}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback />
                  )}
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-sm">
                <div className="font-medium">Creator</div>
                <div className="font-mono mt-1">
                  {formatWalletAddress(game.walletAddress)}
                </div>
                <div className="text-muted-foreground mt-2">
                  Published:{" "}
                  {formatDate(game.marketplacePublishedAt || game.createdAt)}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
