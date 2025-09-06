"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Header } from "@/components/canvas-forge/Header";
import { CodeEditor } from "@/components/canvas-forge/CodeEditor";
import { Preview } from "@/components/canvas-forge/Preview";
import type { GenerateGameCodeOutput } from "@/types/ai-sdk";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Game</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 500px;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    .start-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
    }
    .start-btn:hover {
      background: #5a6fd8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎮 Game Studio</h1>
    <p>Welcome to your game development workspace!</p>
    <p>Use the AI generator to create amazing games, or start coding your own masterpiece.</p>
    <button class="start-btn" onclick="alert('Let\\'s create something amazing!')">
      Start Creating
    </button>
  </div>
</body>
</html>`;

export default function GameEditor() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const isNewGame = gameId === 'new';

  const [html, setHtml] = React.useState(defaultHtml);
  const [title, setTitle] = React.useState("New Game");
  const [currentGameId, setCurrentGameId] = React.useState<string | undefined>(
    isNewGame ? undefined : gameId
  );
  const [currentGame, setCurrentGame] = React.useState<any>(null);
  const [isGameGenerated, setIsGameGenerated] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isNewGame) {
      loadGame(gameId);
    }
  }, [gameId, isNewGame]);

  const loadGame = async (id: string) => {
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      const response = await fetch(`/api/games?wallet=${walletAddress}`);
      const result = await response.json();

      if (result.success) {
        const game = result.games.find((g: any) => g.gameId === id);
        if (game && game.versions.length > 0) {
          const latestVersion = game.versions[game.versions.length - 1];
          setHtml(latestVersion.html);
          setTitle(game.title);
          setIsGameGenerated(true);
          setCurrentGameId(game.gameId);
          setCurrentGame(game); // Store the full game data
        }
      }
    } catch (error) {
      console.error('Load game error:', error);
      toast.error("Failed to load game");
    }
  };

  const handleGenerate = (output: GenerateGameCodeOutput) => {
    setHtml(output.html);
    setIsGameGenerated(true);
    toast.success("Game Generated!", {
      description: "Your new game has been created. Don't forget to save it!",
    });
  };

  const handleSave = async () => {
    if (!html.trim()) {
      toast.error("Cannot save empty game");
      return;
    }

    setIsSaving(true);
    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      if (!walletAddress) {
        toast.error("Wallet address not configured");
        return;
      }

      const response = await fetch('/api/games/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGameId,
          html,
          title,
          description: `Generated game - ${new Date().toLocaleDateString()}`,
          tags: ['ai-generated', 'canvas-forge'],
          walletAddress,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (!currentGameId) {
          // New game was created
          setCurrentGameId(result.game.gameId);
          setCurrentGame(result.game); // Store the new game data
          // Update URL to reflect the new game ID
          router.replace(`/editor/${result.game.gameId}`);
        } else {
          // Existing game was updated - reload the game data
          loadGame(currentGameId);
        }
        
        toast.success("Game Saved Successfully!", {
          description: result.message || "Your game has been saved and uploaded to IPFS permanently",
        });

        // Show IPFS details if available
        if (result.ipfs?.cid) {
          console.log('Game uploaded to IPFS with CID:', result.ipfs.cid);
          console.log('IPFS URL:', result.ipfs.url);
        }
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save game", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToMarketplace = async () => {
    if (!currentGameId) {
      toast.error("Please save your game first");
      return;
    }

    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      const currentVersion = currentGame?.currentVersion || 1;
      
      const response = await fetch('/api/games/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGameId,
          type: 'marketplace',
          walletAddress: walletAddress,
          version: currentVersion,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Published to Marketplace!", {
          description: "Your game is now available for players to enjoy.",
        });
        // Reload game data to update publish status
        if (currentGameId) {
          loadGame(currentGameId);
        }
      } else {
        throw new Error(result.error || 'Failed to publish');
      }
    } catch (error) {
      console.error('Publish to marketplace error:', error);
      toast.error("Failed to publish to marketplace");
    }
  };

  const handlePublishToCommunity = async () => {
    if (!currentGameId) {
      toast.error("Please save your game first");
      return;
    }

    try {
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      const currentVersion = currentGame?.currentVersion || 1;
      
      const response = await fetch('/api/games/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGameId,
          type: 'community',
          walletAddress: walletAddress,
          version: currentVersion,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Published to Community!", {
          description: "Your game is now available for developers to fork and improve.",
        });
        // Reload game data to update publish status
        if (currentGameId) {
          loadGame(currentGameId);
        }
      } else {
        throw new Error(result.error || 'Failed to publish');
      }
    } catch (error) {
      console.error('Publish to community error:', error);
      toast.error("Failed to publish to community");
    }
  };

  const handleShare = () => {
    if (navigator.share && currentGameId) {
      navigator.share({
        title: title,
        text: `Check out my game: ${title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Game link copied to clipboard!");
    }
  };

  const srcDoc = React.useMemo(() => {
    return html;
  }, [html]);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <Header
        onGenerate={handleGenerate}
        onShare={handleShare}
        onSave={handleSave}
        onPublishMarketplace={handlePublishToMarketplace}
        onPublishCommunity={handlePublishToCommunity}
        html={html}
        isGameGenerated={isGameGenerated}
        showPublishButtons={!!currentGameId}
        isSaving={isSaving}
      />

      {/* Game Title */}
      <div className="px-4 py-2 border-b border-gray-800">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white w-full max-w-md"
          placeholder="Game title..."
        />
      </div>

      {/* Main Editor */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} className="min-w-[300px]">
            <CodeEditor 
              value={html} 
              onChange={(value) => setHtml(value || "")}
              language="html"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} className="min-w-[300px]">
            <Preview srcDoc={srcDoc} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
