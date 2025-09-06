import React from "react";
import {
  Bot,
  Code,
  ShoppingCart,
  Users,
  Save,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameGeneratorDialog } from "./GameGeneratorDialog";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";

interface HeaderProps {
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
  isPublishedToMarketplace?: boolean;
  isPublishedToCommunity?: boolean;
  onUnpublish?: (type: "marketplace" | "community") => Promise<void> | void;
}

export function Header({
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
  isPublishedToMarketplace = false,
  isPublishedToCommunity = false,
  onUnpublish,
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
              <div className="flex items-center">
                {isPublishedToMarketplace ? (
                  <div className="flex items-center gap-2">
                    {onUnpublish && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className={buttonClass}>
                            <XCircle className={iconClass} />
                            Unpublish from Marketplace
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Unpublish from Marketplace</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to unpublish this game from the
                            Marketplace? This will remove it from the public
                            marketplace listing.
                          </p>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="ghost"
                              onClick={() => onUnpublish("marketplace")}
                            >
                              Yes, unpublish
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className={buttonClass}>
                        <ShoppingCart className={iconClass} />
                        Publish to Marketplace
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish to Marketplace</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to publish this game to the Marketplace?</p>
                      <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={onPublishMarketplace}>
                          Yes, publish
                        </Button>
                        {onUnpublish && isPublishedToMarketplace && (
                          <Button variant="ghost" onClick={() => onUnpublish("marketplace")}>
                            Unpublish
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
            {onPublishCommunity && (
              <div className="flex items-center">
                {isPublishedToCommunity ? (
                  <div className="flex items-center gap-2">
                    {onUnpublish && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className={buttonClass}>
                            <XCircle className={iconClass} />
                            Unpublish from Community
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Unpublish from Community</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to unpublish this game from the
                            Community? This will remove it from community listings.
                          </p>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="ghost"
                              onClick={() => onUnpublish("community")}
                            >
                              Yes, unpublish
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className={buttonClass}>
                        <Users className={iconClass} />
                        Publish to Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish to Community</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to publish this game to the Community?</p>
                      <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={onPublishCommunity}>
                          Yes, publish
                        </Button>
                        {onUnpublish && isPublishedToCommunity && (
                          <Button variant="ghost" onClick={() => onUnpublish("community")}>
                            Unpublish
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
