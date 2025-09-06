"use client";

import { Search, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Input } from "@/components/ui/input";

interface Game {
  _id?: string;
  gameId: string;
  walletAddress: string;
  title: string;
  description?: string;
  tags?: string[];
  currentVersion: number;
  versions: Array<{
    version: number;
    ipfsCid: string;
    createdAt: Date;
  }>;
  isPublishedToMarketplace: boolean;
  isPublishedToCommunity: boolean;
  marketplacePublishedAt?: Date;
  communityPublishedAt?: Date;
  forkCount: number;
  originalGameId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MarketplacePage() {
  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const loadMarketplaceGames = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await fetch(`/api/marketplace?${params}`);
        const result = await response.json();

        if (result.success) {
          setGames(result.games);
        } else {
          toast.error("Failed to load marketplace games");
          setGames([]);
        }
      } catch (error) {
        console.error("Load marketplace games error:", error);
        toast.error("Failed to load marketplace games");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMarketplaceGames();
  }, [page, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading marketplace games...
            </p>
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
            <Store className="h-8 w-8 text-green-600" />
            Game Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover and play amazing games created by the community
          </p>
        </div>
        <Link href="/editor">
          <Button className="gap-2">Create Your Own Game</Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <Input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Be the first to publish a game to the marketplace!"}
          </p>
          <Link href="/editor">
            <Button className="gap-2">Create First Game</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.gameId}
              game={game}
              variant="marketplace"
              onShare={(gameId) => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/marketplace/${gameId}`,
                );
                toast.success("Game link copied!");
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {games.length === 12 && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
