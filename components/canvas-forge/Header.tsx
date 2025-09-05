"use client";

import { Bot, Download, Share2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameGeneratorDialog } from "./GameGeneratorDialog";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";

interface HeaderProps {
  onExport: () => void;
  onShare: () => void;
  onGenerate: (output: GenerateGameCodeOutput) => void;
  html: string;
  isGameGenerated: boolean;
}

export function Header({
  onExport,
  onShare,
  onGenerate,
  html,
  isGameGenerated,
}: HeaderProps) {
  const iconClass = "mr-2 h-4 w-4 drop-shadow-[0_0_2px_hsl(var(--accent))]";
  const buttonClass =
    "transition-all hover:text-accent hover:drop-shadow-[0_0_4px_hsl(var(--accent))]";

  return (
    <header className="flex h-16 items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Code className="h-8 w-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
        <h1 className="text-2xl font-bold tracking-tighter text-gray-100">
          CanvasForge
        </h1>
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
