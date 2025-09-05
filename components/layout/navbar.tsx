import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";

// Navigation items

export function Navbar({
  navItems,
}: {
  navItems: { title: string; href: string }[];
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex justify-between items-center h-14">
        {/* Logo - Left */}
        <div className="flex items-center">
          <Link href="/" className="items-center space-x-2 md:flex">
            <span className="font-bold inline-block font-mono">Game Hub</span>
          </Link>
        </div>

        {/* Desktop navigation - Center */}
        <nav className="hidden md:flex justify-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Theme toggle and mobile nav - Right */}
        <div className="flex items-center justify-end gap-2 md:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
