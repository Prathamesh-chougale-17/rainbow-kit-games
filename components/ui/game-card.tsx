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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

type GameCardProps = {
  game: Game;
  variant?: "editor" | "marketplace";
  onDelete?: (gameId: string) => void;
  onShare?: (gameId: string) => void;
};

export function GameCard({
  game,
  variant = "editor",
  onDelete,
  onShare,
}: GameCardProps) {
  // Constants to avoid magic numbers when formatting wallet addresses
  const WALLET_ADDRESS_PREFIX_LENGTH = 6;
  const WALLET_ADDRESS_SUFFIX_LENGTH = 4;
  // Maximum number of tags to display on the card before collapsing
  const MAX_TAGS_DISPLAY = 3;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatWalletAddress = (address: string) => {
    if (
      !address ||
      address.length <=
        WALLET_ADDRESS_PREFIX_LENGTH + WALLET_ADDRESS_SUFFIX_LENGTH
    ) {
      return address;
    }
    return `${address.slice(0, WALLET_ADDRESS_PREFIX_LENGTH)}...${address.slice(
      -WALLET_ADDRESS_SUFFIX_LENGTH
    )}`;
  };

  return (
    <MagicCard
      className="group overflow-hidden rounded-xl p-0 transition-shadow hover:shadow-2xl"
      gradientColor={variant === "marketplace" ? "#10b981" : "#6366f1"}
      gradientOpacity={0.12}
    >
      <Card className="border-transparent bg-transparent shadow-none">
        <CardHeader className="px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
                {game.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-muted-foreground text-sm">
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

              <div className="text-right text-muted-foreground text-xs">
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
        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {game.tags.slice(0, MAX_TAGS_DISPLAY).map((tag) => (
              <Badge
                className="px-2 py-1 text-xs"
                key={tag}
                variant={variant === "marketplace" ? "secondary" : "outline"}
              >
                {tag}
              </Badge>
            ))}
            {game.tags.length > MAX_TAGS_DISPLAY && (
              <Badge
                className="px-2 py-1 text-xs"
                variant={variant === "marketplace" ? "secondary" : "outline"}
              >
                +{game.tags.length - MAX_TAGS_DISPLAY}
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
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
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
        <div className="flex gap-2 border-white/5 border-t pt-3">
          {variant === "editor" ? (
            <>
              <Link className="flex-1" href={`/editor/${game.gameId}`}>
                <Button
                  className="w-full gap-2"
                  size="sm"
                  type="button"
                  variant="default"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              </Link>
              {game.isPublishedToMarketplace && (
                <Link href={`/marketplace/${game.gameId}`}>
                  <Button size="sm" type="button" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                </Link>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(game.gameId)}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Link className="flex-1" href={`/marketplace/${game.gameId}`}>
                <Button
                  className="w-full gap-2"
                  size="sm"
                  type="button"
                  variant="default"
                >
                  <Play className="h-3 w-3" />
                  Play Game
                </Button>
              </Link>
              {onShare && (
                <Button
                  onClick={() => onShare(game.gameId)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    </MagicCard>
  );
}
