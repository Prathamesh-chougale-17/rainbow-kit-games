"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  GitFork, 
  Code,
  User,
  Calendar,
  Download,
  Share2,
  ExternalLink,
  Maximize,
  ArrowLeft,
  Users,
  Heart,
  Copy
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Game {
  _id?: string;
  gameId: string;
  walletAddress: string;
  title: string;
  description?: string;
  tags?: string[];
  currentVersion: number;
  versions: any[];
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
  const [game, setGame] = React.useState<Game | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [forking, setForking] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    loadGame();
  }, [params.id]);

  const loadGame = async () => {
    try {
      const response = await fetch(`/api/community/${params.id}`);
      const result = await response.json();

      if (result.success && result.game) {
        setGame(result.game);
      } else {
        toast.error("Game not found");
        router.push('/community');
      }
    } catch (error) {
      console.error('Load game error:', error);
      toast.error("Failed to load game");
      router.push('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleFork = async () => {
    try {
      setForking(true);
      const response = await fetch('/api/games/fork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalGameId: params.id,
          walletAddress: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Game forked successfully!");
        router.push(`/editor/${result.gameId}`);
      } else {
        toast.error(result.error || "Failed to fork game");
      }
    } catch (error) {
      console.error('Fork game error:', error);
      toast.error("Failed to fork game");
    } finally {
      setForking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Game link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = () => {
    if (game?.versions?.[game.currentVersion - 1]?.ipfsCid) {
      const downloadUrl = `https://moccasin-historical-rooster-457.mypinata.cloud/ipfs/${game.versions[game.currentVersion - 1].ipfsCid}`;
      window.open(downloadUrl, '_blank');
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getGameUrl = () => {
    if (game?.versions?.[game.currentVersion - 1]?.ipfsCid) {
      return `https://moccasin-historical-rooster-457.mypinata.cloud/ipfs/${game.versions[game.currentVersion - 1].ipfsCid}`;
    }
    return '';
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
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/community">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Community Game</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Player */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Game Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!getGameUrl()}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {getGameUrl() ? (
                  <iframe
                    src={getGameUrl()}
                    className="w-full h-full border-0"
                    title={game.title}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Game not available</p>
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
                  <Badge variant="outline" className="text-xs">
                    <GitFork className="h-3 w-3 mr-1" />
                    Fork
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              {game.tags && game.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
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
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Creator
                  </span>
                  <span className="font-mono">
                    {formatWalletAddress(game.walletAddress)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Version
                  </span>
                  <span>v{game.currentVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <GitFork className="h-4 w-4" />
                    Forks
                  </span>
                  <span>{game.forkCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Published
                  </span>
                  <span>{formatDate(game.communityPublishedAt || game.createdAt)}</span>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  onClick={handleFork} 
                  disabled={forking}
                  className="w-full gap-2"
                >
                  <GitFork className="h-4 w-4" />
                  {forking ? "Forking..." : "Fork & Edit"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
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
                <div className="text-sm text-muted-foreground">
                  <p>This is a fork of another community game.</p>
                  <Link 
                    href={`/community/${game.originalGameId}`}
                    className="text-primary hover:underline flex items-center gap-1 mt-2"
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
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full relative">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                Exit Fullscreen
              </Button>
            </div>
            {getGameUrl() && (
              <iframe
                src={getGameUrl()}
                className="w-full h-full border-0"
                title={`${game.title} - Fullscreen`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
