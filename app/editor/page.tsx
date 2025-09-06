"use client";

import {
  Calendar,
  Code,
  Edit,
  Play,
  Plus,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Game {
  _id?: string;
  gameId: string;
  walletAddress: string;
  title: string;
  description?: string;
  tags?: string[];
  currentVersion: number;
  versions: number[];
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
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedGameToDelete, setSelectedGameToDelete] = React.useState<
    string | null
  >(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadGames = React.useCallback(async () => {
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      const response = await fetch(`/api/games?wallet=${walletAddress}`);
      const result = await response.json();

      if (result.success) {
        setGames(result.games);
      } else {
        toast.error("Failed to load games");
      }
    } catch {
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadGames();
  }, [loadGames]);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openDeleteDialog = (gameId: string) => {
    setSelectedGameToDelete(gameId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedGameToDelete(null);
  };

  const performDelete = async (gameId: string | null) => {
    if (!gameId) return;
    setDeleting(true);
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      if (!walletAddress) {
        toast.error("Wallet address not configured");
        return;
      }

      const res = await fetch("/api/games/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, walletAddress }),
      });

      const result = await res.json();
      if (!(res.ok && result.success)) {
        throw new Error(result.error || "Failed to delete game");
      }

      toast.success("Game deleted successfully");
      setGames((prev) => prev.filter((game) => game.gameId !== gameId));
      closeDeleteDialog();

      // Note: if the user is currently editing this game, a redirect could be performed here.
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete game");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-muted-foreground">Loading your games...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
              <Code className="h-8 w-8 text-blue-600" />
              Game Studio
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and publish your games
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/marketplace">
              <Button className="gap-2" variant="outline">
                <ShoppingCart className="h-4 w-4" />
                Marketplace
              </Button>
            </Link>
            <Link href="/community">
              <Button className="gap-2" variant="outline">
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
          <div className="py-12 text-center">
            <Code className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No games yet</h3>
            <p className="mb-6 text-muted-foreground">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={game.gameId}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="line-clamp-1">
                        {game.title}
                      </CardTitle>
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
                      <Badge className="text-xs" variant="default">
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Marketplace
                      </Badge>
                    )}
                    {game.isPublishedToCommunity && (
                      <Badge className="text-xs" variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        Community
                      </Badge>
                    )}
                    {game.originalGameId && (
                      <Badge className="text-xs" variant="outline">
                        Fork
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  {game.tags && game.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {game.tags.slice(0, 3).map((tag) => (
                        <Badge className="text-xs" key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {game.tags.length > 3 && (
                        <Badge className="text-xs" variant="outline">
                          +{game.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-muted-foreground text-sm">
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
                    <Link className="flex-1" href={`/editor/${game.gameId}`}>
                      <Button
                        className="w-full gap-2"
                        size="sm"
                        variant="default"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    {game.isPublishedToMarketplace && (
                      <Link href={`/marketplace/${game.gameId}`}>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      onClick={() => openDeleteDialog(game.gameId)}
                      size="sm"
                      variant="outline"
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
      {/* Delete Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
          setDeleteDialogOpen(open);
        }}
        open={deleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete game?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this game?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={deleting}
              onClick={() => performDelete(selectedGameToDelete)}
              variant="destructive"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
