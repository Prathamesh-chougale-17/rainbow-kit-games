"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Save,
  Play,
  Palette,
  Wand2,
  Upload,
  Users,
  Store,
  Code,
  Zap,
  Share2,
  Download,
} from "lucide-react";
import { EnhancedGameGeneratorDialog } from "./EnhancedGameGeneratorDialog";
import { toast } from "sonner";
import type { GenerateGameCodeOutput } from "@/types/ai-sdk";

interface EnhancedHeaderProps {
  onGenerate: (output: GenerateGameCodeOutput) => void;
  onExport: () => void;
  onShare: () => void;
  html: string;
  isGameGenerated: boolean;
  gameId?: string;
  title?: string;
}

export function EnhancedHeader({
  onGenerate,
  onExport,
  onShare,
  html,
  isGameGenerated,
  gameId,
  title,
}: EnhancedHeaderProps) {
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handlePublish = async (type: "marketplace" | "community") => {
    if (!gameId || !title || !html) {
      toast.error("Please save your game first before publishing");
      return;
    }

    setIsPublishing(true);
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      if (!walletAddress) {
        toast.error("Wallet address not configured");
        return;
      }

      const response = await fetch("/api/games/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          type,
          walletAddress,
          version: 1, // TODO: Get actual version
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Successfully published to ${type === "marketplace" ? "Marketplace" : "Community"}!`,
          {
            description: `Your game "${title}" is now available for ${type === "marketplace" ? "players" : "the community to fork and improve"}.`,
          },
        );
      } else {
        throw new Error(result.error || "Failed to publish");
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish game", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const iconClass = "mr-2 h-4 w-4 drop-shadow-[0_0_2px_hsl(var(--accent))]";
  const buttonClass =
    "transition-all hover:text-accent hover:drop-shadow-[0_0_4px_hsl(var(--accent))]";

  return (
    <header className="flex h-16 items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Code className="h-8 w-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
        <h1 className="text-2xl font-bold tracking-tighter text-gray-100">
          CanvasForge
          <span className="ml-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Enhanced
          </span>
        </h1>
        {title && (
          <>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="text-lg font-medium text-gray-200">{title}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* AI Generator Dialog */}
        <EnhancedGameGeneratorDialog
          onGenerate={onGenerate}
          html={html}
          isGameGenerated={isGameGenerated}
        >
          <Button variant="ghost" className={buttonClass}>
            <Zap className={iconClass} />
            {isGameGenerated ? "Enhance Game" : "Generate Game"}
          </Button>
        </EnhancedGameGeneratorDialog>

        {/* Publish to Marketplace Button */}
        {isGameGenerated && (
          <Button
            variant="ghost"
            onClick={() => handlePublish("marketplace")}
            disabled={isPublishing}
            className={`${buttonClass} text-green-400 hover:text-green-300`}
          >
            <Store className={iconClass} />
            Marketplace
          </Button>
        )}

        {/* Publish to Community Button */}
        {isGameGenerated && (
          <Button
            variant="ghost"
            onClick={() => handlePublish("community")}
            disabled={isPublishing}
            className={`${buttonClass} text-blue-400 hover:text-blue-300`}
          >
            <Users className={iconClass} />
            Community
          </Button>
        )}

        <Button variant="ghost" onClick={onShare} className={buttonClass}>
          <Share2 className={iconClass} />
          Share
        </Button>

        <Button variant="ghost" onClick={onExport} className={buttonClass}>
          <Download className={iconClass} />
          Export
        </Button>
      </div>
    </header>
  );
}
