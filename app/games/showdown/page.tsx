"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GameState = "waiting" | "ready" | "countdown" | "fire" | "result";
type Winner = "player" | "ai" | "none";

type GameStats = {
  playerWins: number;
  aiWins: number;
};

export default function QuickDrawGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("waiting");
  const [winner, setWinner] = useState<Winner>("none");
  const [message, setMessage] = useState("Press START to begin the duel!");
  const [stats, setStats] = useState<GameStats>({ playerWins: 0, aiWins: 0 });
  const [playerShot, setPlayerShot] = useState(false);
  const [aiShot, setAiShot] = useState(false);
  const [playerFell, setPlayerFell] = useState(false);
  const [aiFell, setAiFell] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showReadyIndicator, setShowReadyIndicator] = useState(false);

  const gameTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const aiReactionRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);

  // Game timing constants
  const MIN_DELAY = 2000;
  const MAX_DELAY = 5000;
  const AI_MIN_REACTION = 200;
  const AI_MAX_REACTION = 800;

  // Start a new game
  const startGame = useCallback(() => {
    setGameState("ready");
    setMessage("Get Ready...");
    setPlayerShot(false);
    setAiShot(false);
    setPlayerFell(false);
    setAiFell(false);
    setWinner("none");
    setShowReadyIndicator(true);

    // Random delay between 2-5 seconds before showing "FIRE!"
    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    gameTimerRef.current = setTimeout(() => {
      setGameState("fire");
      setMessage("FIRE!");
      setShowReadyIndicator(false);

      // AI reaction time (200-800ms after FIRE appears)
      const aiDelay =
        Math.random() * (AI_MAX_REACTION - AI_MIN_REACTION) + AI_MIN_REACTION;
      aiReactionRef.current = setTimeout(() => {
        // Only AI wins if player hasn't shot yet
        if (!playerShot) {
          setAiShot(true);
          setPlayerFell(true);
          setWinner("ai");
          setGameState("result");
          setMessage("AI wins! You were too slow!");
          setStats((prev) => ({ ...prev, aiWins: prev.aiWins + 1 }));

          // Show result dialog after a short delay
          setTimeout(() => {
            setShowResultDialog(true);
          }, 1000);
        }
      }, aiDelay);
    }, delay);
  }, [playerShot]);

  // Drawing functions
  const drawCactus = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x, y, width, height);
    // Arms
    ctx.fillRect(x - 15, y + 20, 15, 30);
    ctx.fillRect(x + width, y + 30, 15, 25);
  };

  const drawCowboy = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facing: "left" | "right",
    shot: boolean,
    fell: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);
    if (facing === "right") {
      ctx.scale(-1, 1);
    }

    // Hat
    ctx.fillStyle = "#92400e";
    ctx.fillRect(-15, -40, 30, 8);
    ctx.fillRect(-20, -48, 40, 8);

    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(-10, -32, 20, 20);

    // Body
    ctx.fillStyle = "#1f2937";
    if (fell) {
      // Lying down
      ctx.fillRect(-30, -5, 40, 15);
      ctx.fillStyle = "#92400e"; // Arms
      ctx.fillRect(-35, -10, 15, 8);
      ctx.fillRect(20, -10, 15, 8);
    } else {
      // Standing
      ctx.fillRect(-12, -12, 24, 30);

      // Arms
      ctx.fillStyle = "#92400e";
      if (shot) {
        // Gun drawn
        ctx.fillRect(12, -8, 20, 6);
        ctx.fillStyle = "#374151"; // Gun
        ctx.fillRect(32, -6, 8, 3);
      } else {
        // Arms at sides
        ctx.fillRect(-18, -8, 8, 20);
        ctx.fillRect(10, -8, 8, 20);
      }

      // Legs
      ctx.fillStyle = "#1e40af";
      ctx.fillRect(-10, 18, 8, 20);
      ctx.fillRect(2, 18, 8, 20);
    }

    ctx.restore();
  };

  const drawMuzzleFlash = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawReadyIndicator = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    // Blinking "READY" text
    const time = Date.now() * 0.005;
    const alpha = (Math.sin(time) + 1) * 0.5;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("READY", x, y);
    ctx.restore();
  };

  const drawFireText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    // Large "FIRE!" text
    ctx.save();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FIRE!", x, y);
    ctx.restore();
  };

  // Draw the game scene
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desert background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#fbbf24"); // Golden sky
    gradient.addColorStop(0.6, "#f59e0b"); // Orange horizon
    gradient.addColorStop(1, "#d97706"); // Desert ground
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = "#92400e";
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Cacti
    drawCactus(ctx, 100, canvas.height - 150, 30, 80);
    drawCactus(ctx, canvas.width - 150, canvas.height - 130, 25, 70);

    // Player cowboy (left side)
    const playerY = playerFell ? canvas.height - 50 : canvas.height - 120;
    drawCowboy(ctx, 150, playerY, "left", playerShot, playerFell);

    // AI cowboy (right side)
    const aiY = aiFell ? canvas.height - 50 : canvas.height - 120;
    drawCowboy(ctx, canvas.width - 150, aiY, "right", aiShot, aiFell);

    // Muzzle flashes
    if (playerShot && !playerFell) {
      drawMuzzleFlash(ctx, 180, canvas.height - 100);
    }
    if (aiShot && !aiFell) {
      drawMuzzleFlash(ctx, canvas.width - 180, canvas.height - 100);
    }

    // Ready indicator (blinking "READY")
    if (showReadyIndicator && gameState === "ready") {
      drawReadyIndicator(ctx, canvas.width / 2, canvas.height / 2 - 50);
    }

    // Fire text (large "FIRE!")
    if (gameState === "fire") {
      drawFireText(ctx, canvas.width / 2, canvas.height / 2 - 50);
    }
  }, [playerShot, aiShot, playerFell, aiFell, showReadyIndicator, gameState]);

  // Game logic
  const endGame = useCallback((gameWinner: Winner, customMessage?: string) => {
    setGameState("result");
    setWinner(gameWinner);

    if (customMessage) {
      setMessage(customMessage);
    } else if (gameWinner === "player") {
      setMessage("You won the duel!");
      setAiFell(true);
      setStats((prev) => ({ ...prev, playerWins: prev.playerWins + 1 }));
    } else if (gameWinner === "ai") {
      setMessage("The AI outgunned you!");
      setPlayerFell(true);
      setStats((prev) => ({ ...prev, aiWins: prev.aiWins + 1 }));
    }

    // Show result dialog after a short delay
    setTimeout(() => {
      setShowResultDialog(true);
    }, 1000);

    // Clear timers
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
    }
    if (aiReactionRef.current) {
      clearTimeout(aiReactionRef.current);
    }
  }, []);

  const playerShoot = useCallback(() => {
    if (gameState === "fire" && !playerShot) {
      setPlayerShot(true);
      // Player wins if they shoot first or at the same time as AI
      endGame("player");

      // Clear AI timer since player has already won
      if (aiReactionRef.current) {
        clearTimeout(aiReactionRef.current);
      }
    } else if (gameState === "ready" || gameState === "countdown") {
      // Shot too early - player loses
      setPlayerShot(true);
      endGame("ai", "You shot too early!");
    }
  }, [gameState, playerShot, endGame]);

  const resetGame = useCallback(() => {
    setGameState("waiting");
    setMessage("Press START to begin the duel!");
    setWinner("none");
    setPlayerShot(false);
    setAiShot(false);
    setPlayerFell(false);
    setAiFell(false);
    setShowReadyIndicator(false);
    setShowResultDialog(false);

    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
    }
    if (aiReactionRef.current) {
      clearTimeout(aiReactionRef.current);
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "KeyA") {
        e.preventDefault();
        playerShoot();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerShoot]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawScene();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawScene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current);
      }
      if (aiReactionRef.current) {
        clearTimeout(aiReactionRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Instructions Dialog */}
      <Dialog open={showInstructions}>
        <DialogContent className="max-w-md font-mono text-center bg-gradient-to-br from-orange-100 to-yellow-50 border-4 border-orange-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-900 text-center">
              🤠 SHOWDOWN RULES 🤠
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-6 text-orange-800">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold">FASTEST DRAW WINS!</p>
              <div className="space-y-2">
                <p>⚡ Wait for the bell to ring</p>
                <p>🔫 Click SHOOT to draw</p>
                <p>🚫 Shoot too early and you're disqualified!</p>
                <p>🏆 Beat the AI cowboy to win!</p>
              </div>
            </div>

            <Button
              className="w-full font-mono"
              onClick={() => {
                setShowInstructions(false);
                startGame();
              }}
              size="lg"
            >
              START DUEL
            </Button>
            <Link className="w-full" href="/games">
              <Button className="w-full font-mono" size="lg" variant="outline">
                🏠 GO TO GAMES
              </Button>
            </Link>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={showResultDialog}>
        <DialogContent className="max-w-md font-mono text-center bg-gradient-to-br from-orange-100 to-yellow-50 border-4 border-orange-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-900">
              {winner === "player" ? "🏆 VICTORY! 🏆" : "💀 DEFEATED �"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 text-orange-800">
            <p className="text-lg">
              {winner === "player"
                ? "You're the fastest gun in the west!"
                : "The AI was quicker on the draw!"}
            </p>

            <div className="space-y-3">
              <Button
                className="w-full font-mono"
                onClick={handlePlayAgain}
                size="lg"
              >
                🔄 PLAY AGAIN
              </Button>

              <Link className="w-full" href="/games">
                <Button
                  className="w-full font-mono"
                  size="lg"
                  variant="outline"
                >
                  🏠 GO TO GAMES
                </Button>
              </Link>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Game */}
      <div className="fixed inset-0 z-40 flex h-full flex-col bg-background">
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b bg-background p-4">
          <h1 className="font-bold font-mono text-2xl text-foreground">
            🤠 QUICK DRAW SHOWDOWN 🤠
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-primary">You: {stats.playerWins}</span>
              <span className="text-muted-foreground">VS</span>
              <span className="text-destructive">AI: {stats.aiWins}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex flex-1 items-center justify-center p-4">
          <canvas
            className="max-h-full max-w-full rounded-lg border border-border bg-gradient-to-b from-amber-200 to-orange-300"
            height={600}
            ref={canvasRef}
            width={1000}
            onClick={playerShoot}
          />
        </div>

        {/* Game Controls */}
        <div className="border-t bg-background p-6 text-center">
          <h2 className="mb-4 font-bold font-mono text-2xl text-foreground">
            {message}
          </h2>

          {gameState === "waiting" && (
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-bold"
              onClick={startGame}
            >
              START DUEL
            </Button>
          )}

          {(gameState === "ready" ||
            gameState === "countdown" ||
            gameState === "fire") && (
            <div className="space-y-4">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-bold bg-red-600 hover:bg-red-700"
                onClick={playerShoot}
                disabled={playerShot}
              >
                SHOOT!
              </Button>
              <p className="text-muted-foreground text-sm">
                Click SHOOT when you see "FIRE!"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
