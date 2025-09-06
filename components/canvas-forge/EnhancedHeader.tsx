"use client";

import { Bot, Download, Share2, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameGeneratorDialog } from "./GameGeneratorDialog";
import { EnhancedGameGeneratorDialog } from "./EnhancedGameGeneratorDialog";
import type { GenerateGameCodeOutput } from "@/types/ai-sdk";

interface HeaderProps {
  onExport: () => void;
  onShare: () => void;
  onGenerate: (output: GenerateGameCodeOutput) => void;
  html: string;
  isGameGenerated: boolean;
  useEnhanced?: boolean;
}

export function EnhancedHeader({
  onExport,
  onShare,
  onGenerate,
  html,
  isGameGenerated,
  useEnhanced = true,
}: HeaderProps) {
  const iconClass = "mr-2 h-4 w-4 drop-shadow-[0_0_2px_hsl(var(--accent))]";
  const buttonClass =
    "transition-all hover:text-accent hover:drop-shadow-[0_0_4px_hsl(var(--accent))]";

  const GeneratorDialog = useEnhanced ? EnhancedGameGeneratorDialog : GameGeneratorDialog;
  const GeneratorIcon = useEnhanced ? Zap : Bot;

  return (
    <header className="flex h-16 items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Code className="h-8 w-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
        <h1 className="text-2xl font-bold tracking-tighter text-gray-100">
          CanvasForge
          {useEnhanced && (
            <span className="ml-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Enhanced
            </span>
          )}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <GeneratorDialog
          onGenerate={onGenerate}
          html={html}
          isGameGenerated={isGameGenerated}
        >
          <Button variant="ghost" className={buttonClass}>
            <GeneratorIcon className={iconClass} />
            {isGameGenerated ? "Enhance Game" : "Generate Game"}
          </Button>
        </GeneratorDialog>

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
