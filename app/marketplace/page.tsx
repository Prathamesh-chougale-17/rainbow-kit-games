"use client";

import { Search, Store } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Input } from "@/components/ui/input";
import { PAGE_SIZE } from "@/lib/constants";

type Game = {
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
};

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
      } catch {
        toast.error("Failed to load marketplace games");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplaceGames();
  }, [page, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return (
      <div className="mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-muted-foreground">
              Loading marketplace games...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
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
      <form className="flex max-w-md gap-2" onSubmit={handleSearch}>
        <Input
          className="flex-1"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search games..."
          type="text"
          value={searchQuery}
        />
        <Button size="icon" type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="py-12 text-center">
          <Store className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-xl">No games found</h3>
          <p className="mb-6 text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "Be the first to publish a game to the marketplace!"}
          </p>
          <Link href="/editor">
            <Button className="gap-2">Create First Game</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard
              game={game}
              key={game.gameId}
              onShare={(gameId) => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/marketplace/${gameId}`
                );
                toast.success("Game link copied!");
              }}
              variant="marketplace"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {games.length === PAGE_SIZE && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            variant="outline"
          >
            Previous
          </Button>
          <Button onClick={() => setPage((p) => p + 1)} variant="outline">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
