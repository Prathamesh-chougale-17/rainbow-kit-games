import {
  ArrowRight,
  Cloud,
  Code,
  GitFork,
  Shield,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description:
      "Describe your game idea and let AI generate the complete HTML5 game code instantly",
    iconColor: "text-yellow-500",
    gradientColor: "#eab308",
  },
  {
    icon: Cloud,
    title: "IPFS Version Control",
    description:
      "Every game version is stored on IPFS via Pinata, ensuring permanent and decentralized storage",
    iconColor: "text-blue-500",
    gradientColor: "#3b82f6",
  },
  {
    icon: Shield,
    title: "Wallet Authentication",
    description:
      "Secure ownership and management of your games using blockchain wallet authentication",
    iconColor: "text-green-500",
    gradientColor: "#10b981",
  },
  {
    icon: ShoppingCart,
    title: "Game Marketplace",
    description:
      "Publish your games to the marketplace for players to discover and enjoy",
    iconColor: "text-purple-500",
    gradientColor: "#8b5cf6",
  },
  {
    icon: Users,
    title: "Developer Community",
    description:
      "Share your games with developers, get feedback, and collaborate on improvements",
    iconColor: "text-orange-500",
    gradientColor: "#f97316",
  },
  {
    icon: GitFork,
    title: "Fork & Improve",
    description:
      "Fork community games to learn, modify, and create your own improved versions",
    iconColor: "text-pink-500",
    gradientColor: "#ec4899",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="mb-20 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 font-medium text-accent-foreground text-xs">
              New • Complete Game Development Platform
            </p>

            <h1 className="mt-6 font-bold text-4xl leading-tight md:text-5xl">
              Create, Version, and Share Games with AI-Powered Tools
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Build games with AI assistance, manage versions with IPFS storage,
              publish to marketplace, and collaborate with the community. All
              secured by blockchain wallet authentication.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link className="flex items-center gap-2" href="/editor">
                  <Code className="size-4" />
                  Start Creating
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link className="flex items-center gap-2" href="/marketplace">
                  <ShoppingCart className="size-4" />
                  Explore Games
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link className="flex items-center gap-2" href="/community">
                  <Users className="size-4" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-lg border border-border/50 bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-8 backdrop-blur-sm">
              <div className="text-center">
                <Code className="mx-auto mb-4 size-16 text-blue-500" />
                <h3 className="mb-2 font-semibold text-xl">
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
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl">
              Everything You Need to Build Games
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From AI-powered generation to community sharing, our platform
              provides all the tools for modern game development
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                description={feature.description}
                gradientColor={feature.gradientColor}
                icon={feature.icon}
                iconColor={feature.iconColor}
                key={feature.title}
                title={feature.title}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        {/* <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Reach out
              and let us know how we can help.
            </p>
          </div>
          <div className="flex justify-center">
            <ContactForm />
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 font-bold text-3xl">
              Ready to Start Building?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join the future of game development with AI assistance,
              decentralized storage, and community collaboration
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link className="flex items-center gap-2" href="/editor">
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
