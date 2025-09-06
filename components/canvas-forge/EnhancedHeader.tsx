"use client";

import { Bot, Download, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GenerateGameCodeOutput } from "@/types/ai-sdk";
import { EnhancedGameGeneratorDialog } from "./EnhancedGameGeneratorDialog";
import { GameGeneratorDialog } from "./GameGeneratorDialog";

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

  const GeneratorDialog = useEnhanced
    ? EnhancedGameGeneratorDialog
    : GameGeneratorDialog;
  const GeneratorIcon = useEnhanced ? Zap : Bot;

  return (
    <header className="flex h-16 items-center justify-between p-4">
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
