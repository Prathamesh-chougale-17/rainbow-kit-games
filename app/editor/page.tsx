"use client";

import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Header } from "@/components/canvas-forge/Header";
import { CodeEditor } from "@/components/canvas-forge/CodeEditor";
import { Preview } from "@/components/canvas-forge/Preview";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";
import { toast } from "sonner";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dino Game</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      overflow: hidden;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F2F7 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    #game-container {
      position: relative;
      width: 800px;
      height: 600px;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    #start-screen, #game-over-screen {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: opacity 0.5s ease-in-out;
    }
    #game-over-screen { display: none; }

    h1 {
      font-size: 3em;
      margin-bottom: 20px;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
    }
    
    p {
      font-size: 1.5em;
      margin-bottom: 25px;
      opacity: 0.9;
      text-align: center;
    }

    button {
      padding: 14px 28px;
      font-size: 1.4em;
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      transition: transform 0.2s, background-color 0.3s;
    }
    #start-button {
      background: linear-gradient(135deg, #4CAF50, #388E3C);
    }
    #start-button:hover {
      background: linear-gradient(135deg, #66BB6A, #388E3C);
      transform: scale(1.05);
    }
    #restart-button {
      background: linear-gradient(135deg, #E53935, #B71C1C);
    }
    #restart-button:hover {
      background: linear-gradient(135deg, #EF5350, #B71C1C);
      transform: scale(1.05);
    }

    #score, #lives {
      position: absolute;
      top: 15px;
      font-size: 1.6em;
      font-weight: bold;
      color: #222;
      background: rgba(255, 255, 255, 0.7);
      padding: 8px 14px;
      border-radius: 10px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }
    #score { left: 15px; }
    #lives { right: 15px; }

    #dino {
      position: absolute;
      bottom: 20px;
      left: 50px;
      width: 70px;
      height: 90px;
      background: url('https://i.pinimg.com/736x/47/a5/86/47a586c6b9c7b93123de31e941276971.jpg') no-repeat;
      background-size: contain;
    }

    .dino-jump {
      animation: jump 0.6s ease-in-out;
    }
    @keyframes jump {
      0%, 100% { bottom: 20px; }
      50% { bottom: 150px; }
    }

    #obstacle {
      position: absolute;
      bottom: 20px;
      right: -50px;
      width: 40px;
      height: 60px;
      background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUF6wCI9IYI1OLhmF14EIL-WOG4ttbcy-wiw&s') no-repeat;
      background-size: contain;
      animation: obstacleMove 2s linear infinite;
    }
    @keyframes obstacleMove {
      0% { right: -50px; }
      100% { right: 850px; }
    }

    #controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
    }
    .control-button {
      padding: 12px 24px;
      font-size: 1.1em;
      background: linear-gradient(135deg, #3498db, #1976d2);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }
    .control-button:hover {
      background: linear-gradient(135deg, #64b5f6, #1976d2);
      transform: scale(1.05);
    }

    @media (max-width: 800px) {
      #game-container {
        width: 95vw;
        height: 62.5vw;
      }
      h1 { font-size: 2em; }
      p { font-size: 1em; }
      button { font-size: 1em; }
      #score, #lives { font-size: 1.1em; }
      #dino { width: 50px; height: 70px; }
      #obstacle { width: 30px; height: 50px; }
    }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="start-screen">
      <h1>Dino Game</h1>
      <p>Use Space or Arrow Up to Jump<br>Or tap the on-screen button!</p>
      <button id="start-button">Start Game</button>
    </div>
    <div id="game-over-screen">
      <h1>Game Over</h1>
      <button id="restart-button">Restart Game</button>
    </div>
    <div id="score">Score: 0</div>
    <div id="lives">Lives: 1</div>
    <div id="dino"></div>
    <div id="obstacle"></div>
    <div id="controls">
      <button class="control-button" id="jump-button">Jump</button>
    </div>
  </div>

  <script>
    const dino = document.getElementById('dino');
    const obstacle = document.getElementById('obstacle'); 
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameOverScreen = document.getElementById('game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const jumpButton = document.getElementById('jump-button');

    let score = 0;
    let lives = 3;
    let gameActive = false;
    let obstacleInterval;
    let collisionCooldown = false;

    function startGame() {
      gameActive = true;
      score = 0;
      lives = 1;
      collisionCooldown = false;
      scoreDisplay.innerText = 'Score: ' + score;
      livesDisplay.innerText = 'Lives: ' + lives;
      gameOverScreen.style.display = 'none';
      startScreen.style.display = 'none';
      dino.classList.remove('dino-jump');

      obstacle.style.animation = 'obstacleMove 1.5s linear infinite';
      obstacle.style.right = '-50px';

      clearInterval(obstacleInterval);
      obstacleInterval = setInterval(function() {
        if (gameActive) {
          score++;
          scoreDisplay.innerText = 'Score: ' + score;
        }
      }, 100);
    }

    function gameOver() {
      gameActive = false;
      gameOverScreen.style.display = 'flex';
      obstacle.style.animation = 'none';
      clearInterval(obstacleInterval);
    }

    function jump() {
      if (!dino.classList.contains('dino-jump') && gameActive) {
        dino.classList.add('dino-jump');
        setTimeout(() => dino.classList.remove('dino-jump'), 600);
      }
    }

    function checkCollision() {
      if (!gameActive) return;

      const dinoRect = dino.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        dinoRect.bottom > obstacleRect.top &&
        dinoRect.top < obstacleRect.bottom &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.left < obstacleRect.right
      ) {
        if (!collisionCooldown) {
          lives--;
          livesDisplay.innerText = 'Lives: ' + lives;
          collisionCooldown = true;

          setTimeout(() => collisionCooldown = false, 1000);

          if (lives <= 0) {
            gameOver();
          }
        }
      }
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    jumpButton.addEventListener('click', jump);

    document.addEventListener('keydown', function(event) {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
      }
    });

    setInterval(checkCollision, 10);

    obstacle.style.animation = 'none';
  </script>
</body>
</html>
`;

export default function Home() {
  const [html, setHtml] = React.useState(defaultHtml);
  const [srcDoc, setSrcDoc] = React.useState("");
  const [isGameGenerated, setIsGameGenerated] = React.useState(false);

  const handleCodeChange = (value: string | undefined) => {
    setHtml(value || "");
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSrcDoc(html);
    }, 500);

    return () => clearTimeout(handler);
  }, [html]);

  React.useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decoded = atob(hash);
        const data = JSON.parse(decoded);
        if (data.html) {
          setHtml(data.html);
          setIsGameGenerated(true);
          toast.success(
            "Project Loaded: Shared project has been loaded into the editor.",
          );
        }
      }
    } catch (error) {
      console.error("Failed to load project from URL hash", error);
      toast.error(
        "Error Loading Project: Could not load project from the shared link.",
      );
    }
  }, [toast]);

  const handleExport = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-forge-project.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(
      "Export Successful: Your project has been downloaded as an HTML file.",
    );
  };

  const handleShare = () => {
    const data = { html };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success(
      "Link Copied: A shareable link has been copied to your clipboard.",
    );
  };

  const handleGenerate = (output: GenerateGameCodeOutput) => {
    setHtml(output.html);
    setIsGameGenerated(true);
    toast.success(isGameGenerated ? "Game Refined!" : "Game Generated!", {
      description: output.description,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background text-foreground">
      <Header
        onExport={handleExport}
        onShare={handleShare}
        onGenerate={handleGenerate}
        html={html}
        isGameGenerated={isGameGenerated}
      />
      <main className="flex-1 overflow-hidden p-4 pt-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <CodeEditor
              language="HTML"
              value={html}
              onChange={handleCodeChange}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <Preview srcDoc={srcDoc} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
