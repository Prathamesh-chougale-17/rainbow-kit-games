"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Play,
  Edit,
  Calendar,
  Code,
  Trash2,
  ShoppingCart,
  Users,
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

export default function EditorDashboard() {
  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      const response = await fetch(`/api/games?wallet=${walletAddress}`);
      const result = await response.json();

      if (result.success) {
        setGames(result.games);
      } else {
        toast.error("Failed to load games");
      }
    } catch (error) {
      console.error("Load games error:", error);
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      // Note: You'll need to implement delete API endpoint
      toast.success("Game deleted successfully");
      setGames(games.filter((game) => game.gameId !== gameId));
    } catch (error) {
      toast.error("Failed to delete game");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your games...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Code className="h-8 w-8 text-blue-600" />
            Game Studio
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and publish your games
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/marketplace">
            <Button variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </Button>
          </Link>
          <Link href="/community">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Community
            </Button>
          </Link>
          <Link href="/editor/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center py-12">
          <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No games yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first game to get started!
          </p>
          <Link href="/editor/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Game
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.gameId}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {game.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-1">
                  {game.isPublishedToMarketplace && (
                    <Badge variant="default" className="text-xs">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Marketplace
                    </Badge>
                  )}
                  {game.isPublishedToCommunity && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Community
                    </Badge>
                  )}
                  {game.originalGameId && (
                    <Badge variant="outline" className="text-xs">
                      Fork
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                {game.tags && game.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {game.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {game.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{game.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />v{game.currentVersion}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {game.forkCount} forks
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(game.updatedAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/editor/${game.gameId}`} className="flex-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  {game.isPublishedToMarketplace && (
                    <Link href={`/marketplace/${game.gameId}`}>
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(game.gameId)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
