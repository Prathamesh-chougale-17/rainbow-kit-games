import {
  Calendar,
  Code,
  Edit,
  Play,
  Share2,
  ShoppingCart,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface GameCardProps {
  game: Game;
  variant?: "editor" | "marketplace";
  onDelete?: (gameId: string) => void;
  onShare?: (gameId: string) => void;
}

export function GameCard({
  game,
  variant = "editor",
  onDelete,
  onShare,
}: GameCardProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <MagicCard
      className="p-0 rounded-xl overflow-hidden group transition-shadow hover:shadow-2xl"
      gradientColor={variant === "marketplace" ? "#10b981" : "#6366f1"}
      gradientOpacity={0.12}
    >
      <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader className="px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold leading-tight truncate group-hover:text-primary transition-colors">
                {game.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {game.description || "No description provided"}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
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

              <div className="text-right text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Code className="h-3 w-3" />
                  <span>v{game.currentVersion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{game.forkCount} forks</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.tags.slice(0, 3).map((tag) => (
                <Badge
                  className="text-xs px-2 py-1"
                  key={tag}
                  variant={variant === "marketplace" ? "secondary" : "outline"}
                >
                  {tag}
                </Badge>
              ))}
              {game.tags.length > 3 && (
                <Badge
                  className="text-xs px-2 py-1"
                  variant={variant === "marketplace" ? "secondary" : "outline"}
                >
                  +{game.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats / Meta */}
          {variant === "editor" ? (
            <div className="grid grid-cols-2 gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(game.updatedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {game.forkCount} forks
              </div>
              <div className="flex items-center gap-1">
                <Code className="h-3 w-3" />v{game.currentVersion}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {formatWalletAddress(game.walletAddress)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(game.marketplacePublishedAt || game.createdAt)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-white/5 pt-3 flex gap-2">
            {variant === "editor" ? (
              <>
                <Link className="flex-1" href={`/editor/${game.gameId}`}>
                  <Button
                    type="button"
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
                    <Button type="button" size="sm" variant="outline">
                      <Play className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(game.gameId)}
                    type="button"
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </>
            ) : (
              <>
                <Link href={`/marketplace/${game.gameId}`} className="flex-1">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Play className="h-3 w-3" />
                    Play Game
                  </Button>
                </Link>
                {onShare && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(game.gameId)}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </MagicCard>
  );
}
