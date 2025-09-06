"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Shuffle, 
  Zap, 
  BarChart3, 
  Wand2,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  generateGameIdeaAction,
  generateGameVariationsAction,
  generateGameEnhanced
} from "@/lib/actions-enhanced";
import type { GameIdea, GameVariation, GameGenerationResult } from "@/types/ai-sdk";
import { toast } from "sonner";

export function AIFeaturesDemo() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [gameIdea, setGameIdea] = React.useState<GameIdea | null>(null);
  const [variations, setVariations] = React.useState<GameVariation[]>([]);
  const [metrics, setMetrics] = React.useState<any>(null);

  const handleGenerateIdea = async () => {
    setIsLoading(true);
    try {
      const idea = await generateGameIdeaAction("retro arcade", "medium", 0.8);
      setGameIdea(idea);
      toast.success("Game Idea Generated!", {
        description: idea.title
      });
    } catch (error) {
      toast.error("Failed to generate game idea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!gameIdea) return;
    
    setIsLoading(true);
    try {
      const vars = await generateGameVariationsAction(gameIdea.concept, 3);
      setVariations(vars);
      toast.success("Variations Generated!", {
        description: `${vars.length} unique variations created`
      });
    } catch (error) {
      toast.error("Failed to generate variations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGeneration = async () => {
    if (!gameIdea) return;
    
    setIsLoading(true);
    try {
      const result: GameGenerationResult = await generateGameEnhanced({
        prompt: gameIdea.concept
      });
      setMetrics(result.metrics);
      toast.success("Generation Test Complete!", {
        description: `Completed in ${result.metrics.duration}ms`
      });
    } catch (error) {
      toast.error("Generation test failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI-Enhanced Game Generator
        </h1>
        <p className="text-muted-foreground">
          Powered by Vercel AI SDK with advanced features for creative game development
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Creative Game Ideas
            </CardTitle>
            <CardDescription>
              Generate detailed game concepts with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateIdea} 
              disabled={isLoading}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Game Idea
            </Button>
            
            {gameIdea && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <h3 className="font-bold">{gameIdea.title}</h3>
                <p className="text-sm">{gameIdea.concept}</p>
                <div className="flex flex-wrap gap-1">
                  {gameIdea.features.slice(0, 4).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><strong>Style:</strong> {gameIdea.visualStyle}</div>
                  <div><strong>Objective:</strong> {gameIdea.objective}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Game Variations
            </CardTitle>
            <CardDescription>
              Explore different takes on your game concept
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateVariations} 
              disabled={isLoading || !gameIdea}
              className="w-full"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Generate Variations
            </Button>
            
            {variations.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {variations.map((variation) => (
                  <div key={variation.variation} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{variation.title}</h4>
                        <p className="text-xs text-muted-foreground">{variation.description}</p>
                        <p className="text-xs text-accent-foreground">{variation.uniqueFeature}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{variation.difficulty}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Generation Features
          </CardTitle>
          <CardDescription>
            Enhanced AI capabilities with performance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-3">
            <Button 
              onClick={handleTestGeneration} 
              disabled={isLoading || !gameIdea}
              variant="outline"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Test Generation
            </Button>
            <Button variant="outline" disabled>
              <Zap className="mr-2 h-4 w-4" />
              Stream Generation
            </Button>
            <Button variant="outline" disabled>
              <Wand2 className="mr-2 h-4 w-4" />
              Multi-Step Analysis
            </Button>
          </div>

          {metrics && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Generation Metrics</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{metrics.duration}ms</span>
                </div>
                <div className="flex items-center gap-2">
                  {metrics.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{metrics.success ? "Success" : "Failed"}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(metrics.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-medium">Available Features:</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Multi-provider AI support (Google, OpenAI, Anthropic)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Performance monitoring and metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced prompt refinement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Game analysis and reasoning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Creative idea generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Automatic fallback handling</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
