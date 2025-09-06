"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Sparkles } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code-ai-sdk";
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
import { generateGame, refinePromptAction } from "@/lib/actions-ai-sdk";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

interface GameGeneratorDialogProps {
  onGenerate: (output: GenerateGameCodeOutput) => void;
  children: React.ReactNode;
  html: string;
  isGameGenerated: boolean;
}

export function GameGeneratorDialog({
  onGenerate,
  children,
  html,
  isGameGenerated,
}: GameGeneratorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isRefining, setIsRefining] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleRefinePrompt = async () => {
    const currentPrompt = form.getValues("prompt");
    if (currentPrompt.length < 10) {
      form.setError("prompt", {
        type: "manual",
        message:
          "Please enter a game idea of at least 10 characters to refine.",
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
        description:
          "There was an error refining the prompt. Please try again.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const result = await generateGame({
        prompt: values.prompt,
        previousHtml: isGameGenerated ? html : undefined,
      });
      onGenerate(result);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Generation Failed", {
        description:
          "There was an error generating the game. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isGameGenerated ? "Refine Your Game" : "Game Generator"}
              </DialogTitle>
              <DialogDescription>
                {isGameGenerated
                  ? "Describe the changes or new features you want to add."
                  : "Describe the game you want to create, and let AI build the code for you."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>
                        {isGameGenerated
                          ? "Feedback or Refinements"
                          : "Game Idea"}
                      </FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={handleRefinePrompt}
                        disabled={isRefining || isGenerating}
                        className="h-auto p-0 text-accent transition-all hover:text-primary"
                      >
                        {isRefining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Refining...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Refine
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={
                          isGameGenerated
                            ? "e.g., Make the paddle smaller and the ball faster."
                            : "e.g., A simple breakout-style game with a paddle and a ball."
                        }
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isGenerating || isRefining}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    {isGameGenerated ? "Refine Code" : "Generate Code"}
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
