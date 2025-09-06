"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Play, 
  Calendar,
  User,
  Share2,
  Fullscreen,
  Store,
  Download
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export default function MarketplaceGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [game, setGame] = React.useState<Game | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      // For now, we'll get the game from marketplace API
      // You might want to create a specific endpoint for individual games
      const response = await fetch(`/api/marketplace`);
      const result = await response.json();

      if (result.success) {
        const foundGame = result.games.find((g: Game) => g.gameId === gameId);
        if (foundGame) {
          setGame(foundGame);
        } else {
          toast.error("Game not found");
          router.push('/marketplace');
        }
      }
    } catch (error) {
      console.error('Load game error:', error);
      toast.error("Failed to load game");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDownload = () => {
    if (game && game.versions.length > 0) {
      const latestVersion = game.versions[game.versions.length - 1];
      if (latestVersion.html) {
        const blob = new Blob([latestVersion.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${game.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Game downloaded successfully!");
      }
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/marketplace">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{game.title}</h1>
          <p className="text-muted-foreground mt-1">
            {game.description || "No description provided"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Play Game</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="gap-2"
                  >
                    <Fullscreen className="h-4 w-4" />
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
                {gameUrl ? (
                  <iframe
                    src={gameUrl}
                    className={`w-full border-0 ${
                      isFullscreen ? 'h-screen' : 'h-[600px]'
                    }`}
                    title={game.title}
                  />
                ) : latestVersion?.html ? (
                  <iframe
                    srcDoc={latestVersion.html}
                    className={`w-full border-0 ${
                      isFullscreen ? 'h-screen' : 'h-[600px]'
                    }`}
                    title={game.title}
                  />
                ) : (
                  <div className="h-[600px] flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Game not available</p>
                  </div>
                )}
                
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-10"
                  >
                    Exit Fullscreen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  Creator
                </div>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {formatWalletAddress(game.walletAddress)}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  Published
                </div>
                <p className="text-sm">
                  {formatDate(game.marketplacePublishedAt || game.createdAt)}
                </p>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-2">Version</div>
                <p className="text-sm">v{game.currentVersion}</p>
              </div>

              {game.tags && game.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {game.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => window.open(gameUrl || '#', '_blank')}
                disabled={!gameUrl}
              >
                <Play className="h-4 w-4" />
                Open in New Tab
              </Button>
              
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share Game
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download HTML
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
