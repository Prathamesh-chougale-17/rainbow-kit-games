import {
  Coins,
  Gamepad2,
  Globe,
  Heart,
  Lock,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/ui/feature-card";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
              The Future of Gaming is Decentralized
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Game Hub uses{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                blockchain
              </span>{" "}
              to give players true digital ownership of their games and assets,
              enabling secure trading, transparent revenue sharing, and
              cross-platform interoperability through Web3 wallets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="inline-block">
                <button
                  type="button"
                  className="rounded-xl bg-gray-900 px-8 py-4 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-lg"
                >
                  <Gamepad2 className="inline mr-2 h-5 w-5" />
                  Explore Games
                </button>
              </Link>
              <Link href="/contact" className="inline-block">
                <button
                  type="button"
                  className="rounded-xl border-2 border-gray-200 px-8 py-4 text-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blockchain Benefits */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Blockchain Changes Everything
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              By anchoring game progress and checkpoints on-chain, we prevent
              cheating and ensure authenticity, while smart contracts create a
              fair and trustless marketplace.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title="True Ownership"
              description="Your games and assets belong to you permanently. Transfer them anywhere, anytime."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
            <FeatureCard
              icon={Coins}
              title="Secure Trading"
              description="Trade game assets safely with transparent smart contract transactions."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
            <FeatureCard
              icon={Globe}
              title="Cross-Platform"
              description="Use your Web3 wallet to access games across any platform or device."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
            <FeatureCard
              icon={Lock}
              title="Anti-Cheat"
              description="On-chain checkpoints and progress validation ensure fair gameplay for everyone."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Revenue Sharing"
              description="Transparent, automated revenue distribution to creators and the community."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
            <FeatureCard
              icon={Users}
              title="Community Governance"
              description="Vote on platform decisions and shape the future of Game Hub together."
              iconColor="text-blue-500"
              gradientColor="#f3f4f6"
            />
          </div>
        </section>

        {/* Decentralization Section */}
        <section className="py-16">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                No Central Authority, <br />
                <span className="text-gray-100">Maximum Freedom</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Blockchain removes reliance on central authorities and empowers
                the community with governance and long-term value in the gaming
                ecosystem. Smart contracts ensure fairness, transparency, and
                trust without intermediaries.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Instant Transactions</h4>
                    <p className="text-sm text-muted-foreground">
                      Lightning-fast asset transfers and game interactions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Community First</h4>
                    <p className="text-sm text-muted-foreground">
                      Decisions made by players, for players through
                      decentralized governance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Innovation Unleashed</h4>
                    <p className="text-sm text-muted-foreground">
                      Build on top of our platform with complete creative
                      freedom.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-2xl overflow-hidden shadow-md p-8 border border-gray-100 bg-gray-800">
                <h3 className="text-xl font-bold mb-3 text-gray-100">
                  Trustless Marketplace
                </h3>
                <p className="text-gray-400">
                  Smart contracts automatically handle payments, royalties, and
                  ownership transfers without requiring trust in third parties.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md p-8 border border-gray-100 bg-gray-800">
                <h3 className="text-xl font-bold mb-3 text-gray-100">
                  Immutable Records
                </h3>
                <p className="text-gray-400">
                  Game achievements, high scores, and asset ownership are
                  permanently recorded on the blockchain for complete
                  transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we build and every decision we
              make as a community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Be Helpful</h4>
              <p className="text-muted-foreground">
                We help creators learn and iterate quickly with kind, practical
                feedback and support.
              </p>
            </div>

            <div className="rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Stay Focused</h4>
              <p className="text-muted-foreground">
                Small, focused experiences are easier to build, share, and
                iterate on than massive projects.
              </p>
            </div>

            <div className="rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Open & Inclusive</h4>
              <p className="text-muted-foreground">
                We create an environment where anyone can join, contribute, and
                thrive regardless of background.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of creators, players, and builders who are
              shaping the next generation of decentralized gaming.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor" className="inline-block">
                <button
                  type="button"
                  className="rounded-xl bg-gray-800 px-8 py-4 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300 text-lg"
                >
                  <Sparkles className="inline mr-2 h-5 w-5 text-gray-100" />
                  Start Creating
                </button>
              </Link>
              <Link href="/community" className="inline-block">
                <button
                  type="button"
                  className="rounded-xl border-2 border-gray-200 px-8 py-4 text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  <Users className="inline mr-2 h-5 w-5 text-gray-700" />
                  Join Community
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
