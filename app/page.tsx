import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  Users,
  ShoppingCart,
  GitFork,
  Zap,
  Shield,
  Cloud,
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
              publish to marketplace, and collaborate with the community. All
              secured by blockchain wallet authentication.
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
                <h3 className="text-xl font-semibold mb-2">
                  Game Development Reimagined
                </h3>
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
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Build Games
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered generation to community sharing, our platform
              provides all the tools for modern game development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="size-8 text-yellow-500 mb-2" />
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Describe your game idea and let AI generate the complete HTML5
                  game code instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="size-8 text-blue-500 mb-2" />
                <CardTitle>IPFS Version Control</CardTitle>
                <CardDescription>
                  Every game version is stored on IPFS via Pinata, ensuring
                  permanent and decentralized storage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="size-8 text-green-500 mb-2" />
                <CardTitle>Wallet Authentication</CardTitle>
                <CardDescription>
                  Secure ownership and management of your games using blockchain
                  wallet authentication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="size-8 text-purple-500 mb-2" />
                <CardTitle>Game Marketplace</CardTitle>
                <CardDescription>
                  Publish your games to the marketplace for players to discover
                  and enjoy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="size-8 text-orange-500 mb-2" />
                <CardTitle>Developer Community</CardTitle>
                <CardDescription>
                  Share your games with developers, get feedback, and
                  collaborate on improvements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <GitFork className="size-8 text-pink-500 mb-2" />
                <CardTitle>Fork & Improve</CardTitle>
                <CardDescription>
                  Fork community games to learn, modify, and create your own
                  improved versions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the future of game development with AI assistance,
              decentralized storage, and community collaboration
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
      </main>
    </div>
  );
}
