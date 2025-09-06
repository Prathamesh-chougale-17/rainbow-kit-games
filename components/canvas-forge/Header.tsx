"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Download,
  Share2,
  Code,
  ShoppingCart,
  Users,
  Save,
  Link,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameGeneratorDialog } from "./GameGeneratorDialog";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";

interface HeaderProps {
  onShare: () => void;
  onGenerate: (output: GenerateGameCodeOutput) => void;
  onSave?: () => void;
  onPublishMarketplace?: () => void;
  onPublishCommunity?: () => void;
  html: string;
  isGameGenerated: boolean;
  showPublishButtons?: boolean;
  isSaving?: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
}

export function Header({
  onShare,
  onGenerate,
  onSave,
  onPublishMarketplace,
  onPublishCommunity,
  html,
  isGameGenerated,
  showPublishButtons = false,
  isSaving = false,
  title,
  onTitleChange,
}: HeaderProps) {
  const iconClass = "mr-2 h-4 w-4 drop-shadow-[0_0_2px_hsl(var(--accent))]";
  const buttonClass =
    "transition-all hover:text-accent hover:drop-shadow-[0_0_4px_hsl(var(--accent))]";

  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  return (
    <header className="flex h-16 items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Code className="h-8 w-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <h1 className="text-2xl font-bold tracking-tighter text-gray-100">
                {title || "CanvasForge"}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => onTitleChange?.(e.target.value)}
                className="w-64"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
                className={buttonClass}
              >
                <Save className={iconClass} />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <GameGeneratorDialog
          onGenerate={onGenerate}
          html={html}
          isGameGenerated={isGameGenerated}
        >
          <Button variant="ghost" className={buttonClass}>
            <Bot className={iconClass} />
            {isGameGenerated ? "Refine Game" : "Generate Game"}
          </Button>
        </GameGeneratorDialog>

        {/* Save Button */}
        {onSave && (
          <Button
            variant="ghost"
            onClick={onSave}
            className={buttonClass}
            disabled={isSaving}
          >
            <Save className={iconClass} />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}

        {/* Publish Buttons */}
        {showPublishButtons && (
          <>
            {onPublishMarketplace && (
              <Button
                variant="ghost"
                onClick={onPublishMarketplace}
                className={buttonClass}
              >
                <ShoppingCart className={iconClass} />
                Publish to Marketplace
              </Button>
            )}
            {onPublishCommunity && (
              <Button
                variant="ghost"
                onClick={onPublishCommunity}
                className={buttonClass}
              >
                <Users className={iconClass} />
                Publish to Community
              </Button>
            )}
          </>
        )}

        <Button variant="ghost" onClick={onShare} className={buttonClass}>
          <Share2 className={iconClass} />
          Share
        </Button>
      </div>
    </header>
  );
}
