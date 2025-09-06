"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Bot, 
  Loader2, 
  Sparkles, 
  Lightbulb, 
  Shuffle, 
  Zap,
  BarChart3,
  Wand2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  generateGameEnhanced, 
  refineGameAdvanced,
  refinePromptAction,
  generateGameIdeaAction,
  generateGameVariationsAction
} from "@/lib/actions-enhanced";
import type { 
  GenerateGameCodeOutput,
  GameIdea,
  GameVariation,
  GameGenerationResult,
  GameRefinementResult
} from "@/types/ai-sdk";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  mode: z.enum(["simple", "advanced", "creative"]),
  difficulty: z.enum(["simple", "medium", "complex"]),
  creativity: z.number().min(0).max(1),
});

interface EnhancedGameGeneratorDialogProps {
  onGenerate: (output: GenerateGameCodeOutput) => void;
  children: React.ReactNode;
  html: string;
  isGameGenerated: boolean;
}

export function EnhancedGameGeneratorDialog({
  onGenerate,
  children,
  html,
  isGameGenerated,
}: EnhancedGameGeneratorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isRefining, setIsRefining] = React.useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = React.useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("generate");
  const [gameIdeas, setGameIdeas] = React.useState<GameIdea[]>([]);
  const [gameVariations, setGameVariations] = React.useState<GameVariation[]>([]);
  const [generationMetrics, setGenerationMetrics] = React.useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      mode: "simple",
      difficulty: "medium",
      creativity: 0.7,
    },
  });

  const handleRefinePrompt = async () => {
    const currentPrompt = form.getValues("prompt");
    if (currentPrompt.length < 10) {
      form.setError("prompt", {
        type: "manual",
        message: "Please enter a game idea of at least 10 characters to refine.",
      });
      return;
    }

    setIsRefining(true);
    try {
      const result = await refinePromptAction({
        prompt: currentPrompt,
        isGameGenerated: isGameGenerated,
      });
      form.setValue("prompt", result.refinedPrompt, { shouldValidate: true });
      toast.success("Prompt Refined!", {
        description: "Your game idea has been enhanced with more detail.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Refinement Failed", {
        description: "There was an error refining the prompt. Please try again.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateIdea = async () => {
    const theme = form.getValues("prompt") || "random";
    const difficulty = form.getValues("difficulty");
    const creativity = form.getValues("creativity");

    setIsGeneratingIdea(true);
    try {
      const result = await generateGameIdeaAction(theme, difficulty, creativity);
      setGameIdeas([result]);
      form.setValue("prompt", `${result.concept}\n\nFeatures: ${result.features.join(", ")}\nVisual Style: ${result.visualStyle}`, { shouldValidate: true });
      
      // Switch to the Generate tab after generating an idea
      setActiveTab("generate");
      
      toast.success("Game Idea Generated!", {
        description: `${result.title} - Ready to generate game code!`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Idea Generation Failed", {
        description: "There was an error generating the game idea. Please try again.",
      });
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleGenerateVariations = async () => {
    const currentPrompt = form.getValues("prompt");
    if (currentPrompt.length < 10) {
      toast.error("Please enter a game concept first");
      return;
    }

    setIsGeneratingVariations(true);
    try {
      const result = await generateGameVariationsAction(currentPrompt, 3);
      setGameVariations(result);
      toast.success("Game Variations Generated!", {
        description: `${result.length} unique variations created`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Variation Generation Failed", {
        description: "There was an error generating variations. Please try again.",
      });
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleAdvancedGeneration = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      let result: GenerateGameCodeOutput;
      
      if (values.mode === "advanced" && isGameGenerated) {
        // Use advanced refinement with reasoning
        const refinementResult: GameRefinementResult = await refineGameAdvanced(html, values.prompt);
        result = {
          html: refinementResult.improvedGame.html,
          description: `${refinementResult.improvedGame.reasoning}\n\nChanges made:\n${refinementResult.improvedGame.changes.join('\n')}`
        };
        
        toast.success("Advanced Refinement Complete!", {
          description: "Game analyzed and improved with detailed reasoning",
        });
      } else {
        // Use enhanced generation with metrics
        const enhancedResult: GameGenerationResult = await generateGameEnhanced({
          prompt: values.prompt,
          previousHtml: isGameGenerated ? html : undefined,
        });
        
        result = {
          html: enhancedResult.html,
          description: enhancedResult.description
        };
        
        setGenerationMetrics(enhancedResult.metrics);
        
        toast.success("Enhanced Generation Complete!", {
          description: `Generated in ${enhancedResult.metrics.duration}ms`,
        });
      }

      onGenerate(result);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Generation Failed", {
        description: "There was an error generating the game. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.mode === "advanced") {
      return handleAdvancedGeneration(values);
    }

    // Default simple generation
    setIsGenerating(true);
    try {
      const enhancedResult = await generateGameEnhanced({
        prompt: values.prompt,
        previousHtml: isGameGenerated ? html : undefined,
      });

      onGenerate({
        html: enhancedResult.html,
        description: enhancedResult.description
      });
      
      setGenerationMetrics(enhancedResult.metrics);
      setIsOpen(false);
      form.reset();
      
      toast.success(isGameGenerated ? "Game Refined!" : "Game Generated!", {
        description: `Completed in ${enhancedResult.metrics.duration}ms`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Generation Failed", {
        description: "There was an error generating the game. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const selectVariation = (variation: GameVariation) => {
    form.setValue("prompt", `${variation.description}\n\nUnique Feature: ${variation.uniqueFeature}`, { shouldValidate: true });
    
    // Switch to the Generate tab after selecting a variation
    setActiveTab("generate");
    
    toast.success("Variation Selected!", {
      description: `${variation.title} - Ready to generate game code!`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isGameGenerated ? "Enhance Your Game" : "AI Game Generator"}
              </DialogTitle>
              <DialogDescription asChild>
                <div>
                  Advanced AI-powered game generation with creative assistance and detailed analysis.
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">1</span>
                        Generate Ideas
                      </span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">2</span>
                        Generate Game Code
                      </span>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate" className="relative">
                  Generate
                  {form.watch("prompt") && form.watch("prompt").length > 100 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="ideas">💡 Ideas</TabsTrigger>
                <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>
                          {isGameGenerated ? "Refinements" : "Game Concept"}
                          {form.watch("prompt") && form.watch("prompt").length > 100 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              AI Generated
                            </Badge>
                          )}
                        </FormLabel>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRefinePrompt}
                            disabled={isRefining || isGenerating}
                          >
                            {isRefining ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Refine
                          </Button>
                        </div>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={
                            isGameGenerated
                              ? "Describe improvements: make it faster, add power-ups, change colors..."
                              : "Describe your game: a platformer with jumping mechanics, puzzle elements..."
                          }
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {gameVariations.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Game Variations</label>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {gameVariations.map((variation) => (
                        <div
                          key={variation.variation}
                          className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => selectVariation(variation)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{variation.title}</h4>
                              <p className="text-sm text-muted-foreground">{variation.description}</p>
                              <p className="text-xs text-accent-foreground mt-1">{variation.uniqueFeature}</p>
                            </div>
                            <Badge variant="outline">{variation.difficulty}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ideas" className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateIdea}
                    disabled={isGeneratingIdea}
                    className="flex-1"
                  >
                    {isGeneratingIdea ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Lightbulb className="mr-2 h-4 w-4" />
                    )}
                    Generate Idea
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateVariations}
                    disabled={isGeneratingVariations}
                    className="flex-1"
                  >
                    {isGeneratingVariations ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Shuffle className="mr-2 h-4 w-4" />
                    )}
                    Variations
                  </Button>
                </div>

                {gameIdeas.length > 0 && (
                  <div className="space-y-3">
                    {gameIdeas.map((idea, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <h3 className="font-bold">{idea.title}</h3>
                        <p className="text-sm">{idea.concept}</p>
                        <div className="flex flex-wrap gap-1">
                          {idea.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{idea.visualStyle}</p>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Button
                        onClick={() => setActiveTab("generate")}
                        className="w-full"
                        variant="default"
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Game Code
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Idea has been added to the prompt. Click to generate the actual game code.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generation Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select generation mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="simple">Simple - Fast generation</SelectItem>
                          <SelectItem value="advanced">Advanced - With analysis & reasoning</SelectItem>
                          <SelectItem value="creative">Creative - Maximum innovation</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Complexity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="simple">Simple - Basic mechanics</SelectItem>
                          <SelectItem value="medium">Medium - Balanced gameplay</SelectItem>
                          <SelectItem value="complex">Complex - Advanced features</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creativity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creativity Level: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </FormItem>
                  )}
                />

                {generationMetrics && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Last Generation Metrics</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Duration: {generationMetrics.duration}ms</div>
                      <div>Status: {generationMetrics.success ? "Success" : "Failed"}</div>
                      <div>Time: {new Date(generationMetrics.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              {form.watch("prompt") && form.watch("prompt").length > 100 && activeTab !== "generate" && (
                <div className="w-full text-center mb-4">
                  <p className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
                    🎯 Game concept ready! Switch to "Generate" tab to create the game code.
                  </p>
                </div>
              )}
              <Button 
                type="submit" 
                disabled={isGenerating || isRefining}
                className="min-w-[120px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    {form.watch("mode") === "advanced" ? (
                      <Zap className="mr-2 h-4 w-4" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {isGameGenerated ? "Enhance Game" : "Generate Game Code"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
