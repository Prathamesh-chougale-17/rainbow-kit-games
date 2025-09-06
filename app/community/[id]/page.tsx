"use client";

import {
  ArrowLeft,
  Calendar,
  Code,
  Download,
  ExternalLink,
  GitFork,
  Maximize,
  Play,
  Share2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface CommunityGamePageProps {
  params: {
    id: string;
  };
}

export default function CommunityGamePage({ params }: CommunityGamePageProps) {
  // Next.js may provide params as a Promise in newer versions.
  // Use React.use() to unwrap params before accessing properties to be future-proof.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resolvedParams: { id: string } =
    params instanceof Promise ? React.use(params) : params;
  const [game, setGame] = React.useState<Game | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [forking, setForking] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const router = useRouter();

  const loadGame = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/community/${resolvedParams.id}`);
      const result = await response.json();

      if (result.success && result.game) {
        setGame(result.game);
      } else {
        toast.error("Game not found");
        router.push("/community");
      }
    } catch (error) {
      console.error("Load game error:", error);
      toast.error("Failed to load game");
      router.push("/community");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  React.useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleFork = async () => {
    try {
      setForking(true);
      const response = await fetch("/api/games/fork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalGameId: resolvedParams.id,
          walletAddress: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Game forked successfully!");
        router.push(`/editor/${result.game.gameId}`);
      } else {
        toast.error(result.error || "Failed to fork game");
      }
    } catch (error) {
      console.error("Fork game error:", error);
      toast.error("Failed to fork game");
    } finally {
      setForking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Game link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = () => {
    if (game?.versions?.[game.currentVersion - 1]?.ipfsCid) {
      const downloadUrl = `https://ipfs.io/ipfs/${game.versions[game.currentVersion - 1].ipfsCid}`;
      window.open(downloadUrl, "_blank");
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getGameUrl = () => {
    if (game?.versions?.[game.currentVersion - 1]?.ipfsCid) {
      return `https://ipfs.io/ipfs/${game.versions[game.currentVersion - 1].ipfsCid}`;
    }
    return "";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-muted-foreground">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/community">
          <Button size="icon" variant="outline">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="font-bold text-2xl">Community Game</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Game Player */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Game Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={!getGameUrl()}
                    onClick={handleDownload}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                {getGameUrl() ? (
                  <iframe
                    className="h-full w-full border-0"
                    src={getGameUrl()}
                    title={game.title}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Game not available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {game.description || "No description provided for this game."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {game.title}
                {game.originalGameId && (
                  <Badge className="text-xs" variant="outline">
                    <GitFork className="mr-1 h-3 w-3" />
                    Fork
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              {game.tags && game.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.tags.map((tag) => (
                      <Badge className="text-xs" key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    Creator
                  </span>
                  <span className="font-mono">
                    {formatWalletAddress(game.walletAddress)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Code className="h-4 w-4" />
                    Version
                  </span>
                  <span>v{game.currentVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <GitFork className="h-4 w-4" />
                    Forks
                  </span>
                  <span>{game.forkCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Published
                  </span>
                  <span>
                    {formatDate(game.communityPublishedAt || game.createdAt)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  disabled={forking}
                  onClick={handleFork}
                >
                  <GitFork className="h-4 w-4" />
                  {forking ? "Forking..." : "Fork & Edit"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleShare} size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleDownload} size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fork Info */}
          {game.originalGameId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fork Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">
                  <p>This is a fork of another community game.</p>
                  <Link
                    className="mt-2 flex items-center gap-1 text-primary hover:underline"
                    href={`/community/${game.originalGameId}`}
                  >
                    View original <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative h-full w-full">
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={() => setIsFullscreen(false)}
                size="sm"
                variant="secondary"
              >
                Exit Fullscreen
              </Button>
            </div>
            {getGameUrl() && (
              <iframe
                className="h-full w-full border-0"
                src={getGameUrl()}
                title={`${game.title} - Fullscreen`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
