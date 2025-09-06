import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto px-6 py-20">
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Code, 
  Users, 
  ShoppingCart, 
  GitFork, 
  Zap, 
  Shield,
  Cloud
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="inline-flex items-center rounded-full bg-accent/10 text-accent-foreground px-3 py-1 text-xs font-medium">
              New • Complete Game Development Platform
            </p>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              Create, Version, and Share Games with AI-Powered Tools
            </h1>

            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Build games with AI assistance, manage versions with IPFS storage, 
              publish to marketplace, and collaborate with the community. 
              All secured by blockchain wallet authentication.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/editor" className="flex items-center gap-2">
                  <Code className="size-4" />
                  Start Creating
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/marketplace" className="flex items-center gap-2">
                  <ShoppingCart className="size-4" />
                  Explore Games
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/community" className="flex items-center gap-2">
                  <Users className="size-4" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg border border-border/50 p-8 backdrop-blur-sm">
              <div className="text-center">
                <Code className="size-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Game Development Reimagined</h3>
                <p className="text-muted-foreground">
                  AI-assisted coding, IPFS storage, and community collaboration
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Build Games</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered generation to community sharing, our platform provides all the tools for modern game development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="size-8 text-yellow-500 mb-2" />
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Describe your game idea and let AI generate the complete HTML5 game code instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="size-8 text-blue-500 mb-2" />
                <CardTitle>IPFS Version Control</CardTitle>
                <CardDescription>
                  Every game version is stored on IPFS via Pinata, ensuring permanent and decentralized storage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="size-8 text-green-500 mb-2" />
                <CardTitle>Wallet Authentication</CardTitle>
                <CardDescription>
                  Secure ownership and management of your games using blockchain wallet authentication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="size-8 text-purple-500 mb-2" />
                <CardTitle>Game Marketplace</CardTitle>
                <CardDescription>
                  Publish your games to the marketplace for players to discover and enjoy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="size-8 text-orange-500 mb-2" />
                <CardTitle>Developer Community</CardTitle>
                <CardDescription>
                  Share your games with developers, get feedback, and collaborate on improvements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <GitFork className="size-8 text-pink-500 mb-2" />
                <CardTitle>Fork & Improve</CardTitle>
                <CardDescription>
                  Fork community games to learn, modify, and create your own improved versions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the future of game development with AI assistance, decentralized storage, and community collaboration
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/editor" className="flex items-center gap-2">
                  <Code className="size-5" />
                  Create Your First Game
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

              <a href="#features" className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-transparent hover:bg-muted/50">
                See features
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              <div className="p-3 rounded-lg border bg-muted/5">
                <h4 className="font-semibold">Exportable code</h4>
                <p className="text-sm text-muted-foreground">Download a working React/TS game bundle.</p>
              </div>
              <div className="p-3 rounded-lg border bg-muted/5">
                <h4 className="font-semibold">Refine prompts</h4>
                <p className="text-sm text-muted-foreground">Iterate quickly using AI feedback and previews.</p>
              </div>
            </div>
          </div>

          <div aria-hidden className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600/20 to-rose-400/10 p-6 shadow-lg">
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-indigo-800/40 to-transparent flex items-center justify-center">
              {/* Placeholder illustration */}
              <div className="text-center">
                <div className="mx-auto mb-4 h-36 w-64 rounded-md bg-white/5" />
                <p className="text-sm text-muted-foreground">Live preview of generated game (playable in the editor)</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20">
          <h2 className="text-2xl font-bold">What you'll get</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Handy features designed for fast experimentation and deployment.</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-background/50 shadow-sm">
              <h3 className="font-semibold">Live Editor</h3>
              <p className="mt-2 text-sm text-muted-foreground">Edit code and see a live preview side-by-side.</p>
            </div>
            <div className="p-6 rounded-xl border bg-background/50 shadow-sm">
              <h3 className="font-semibold">AI Refinements</h3>
              <p className="mt-2 text-sm text-muted-foreground">Ask the model to tweak difficulty, controls, visuals and more.</p>
            </div>
            <div className="p-6 rounded-xl border bg-background/50 shadow-sm">
              <h3 className="font-semibold">One-click Export</h3>
              <p className="mt-2 text-sm text-muted-foreground">Export a runnable project or embed the game wherever you like.</p>
            </div>
          </div>
        </section>

        <section id="get-started" className="mt-20 py-12 rounded-2xl bg-gradient-to-r from-accent/6 to-transparent border">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold">Ready to create?</h3>
            <p className="mt-2 text-muted-foreground">Start by describing a simple game idea — we'll do the rest.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href="/editor" className="flex items-center gap-2">Open Generator</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/ai-features" className="flex items-center gap-2">AI Features Demo</Link>
              </Button>
              <a href="#features" className="text-sm text-muted-foreground underline underline-offset-4">View details</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-20 bg-background/50">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Game Hub — Built with Tailwind & AI</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
