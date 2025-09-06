import {
  Bot,
  Code,
  Edit,
  Save,
  ShoppingCart,
  Users,
  XCircle,
} from "lucide-react";
import React from "react";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GameGeneratorDialog } from "./GameGeneratorDialog";

type HeaderProps = {
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
};

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
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                className="w-64"
                onChange={(e) => onTitleChange?.(e.target.value)}
                ref={inputRef}
                value={title}
              />
              <Button
                className={buttonClass}
                onClick={() => setEditing(false)}
                size="sm"
                variant="ghost"
              >
                <Save className={iconClass} />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-bold text-2xl text-gray-100 tracking-tighter">
                {title || "CanvasForge"}
              </h1>
              <Button
                onClick={() => setEditing(true)}
                size="sm"
                variant="ghost"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <GameGeneratorDialog
          html={html}
          isGameGenerated={isGameGenerated}
          onGenerate={onGenerate}
        >
          <Button className={buttonClass} variant="ghost">
            <Bot className={iconClass} />
            {isGameGenerated ? "Refine Game" : "Generate Game"}
          </Button>
        </GameGeneratorDialog>

        {/* Save Button */}
        {onSave && (
          <Button
            className={buttonClass}
            disabled={isSaving}
            onClick={onSave}
            variant="ghost"
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
                          <Button className={buttonClass} variant="ghost">
                            <XCircle className={iconClass} />
                            Unpublish from Marketplace
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Unpublish from Marketplace
                            </DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to unpublish this game from
                            the Marketplace? This will remove it from the public
                            marketplace listing.
                          </p>
                          <DialogFooter className="mt-4">
                            <Button
                              onClick={() => onUnpublish("marketplace")}
                              variant="ghost"
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
                      <Button className={buttonClass} variant="ghost">
                        <ShoppingCart className={iconClass} />
                        Publish to Marketplace
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish to Marketplace</DialogTitle>
                      </DialogHeader>
                      <p>
                        Are you sure you want to publish this game to the
                        Marketplace?
                      </p>
                      <DialogFooter className="mt-4">
                        <Button onClick={onPublishMarketplace} variant="ghost">
                          Yes, publish
                        </Button>
                        {onUnpublish && isPublishedToMarketplace && (
                          <Button
                            onClick={() => onUnpublish("marketplace")}
                            variant="ghost"
                          >
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
                          <Button className={buttonClass} variant="ghost">
                            <XCircle className={iconClass} />
                            Unpublish from Community
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Unpublish from Community</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to unpublish this game from
                            the Community? This will remove it from community
                            listings.
                          </p>
                          <DialogFooter className="mt-4">
                            <Button
                              onClick={() => onUnpublish("community")}
                              variant="ghost"
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
                      <Button className={buttonClass} variant="ghost">
                        <Users className={iconClass} />
                        Publish to Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish to Community</DialogTitle>
                      </DialogHeader>
                      <p>
                        Are you sure you want to publish this game to the
                        Community?
                      </p>
                      <DialogFooter className="mt-4">
                        <Button onClick={onPublishCommunity} variant="ghost">
                          Yes, publish
                        </Button>
                        {onUnpublish && isPublishedToCommunity && (
                          <Button
                            onClick={() => onUnpublish("community")}
                            variant="ghost"
                          >
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
