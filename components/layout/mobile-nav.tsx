"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
interface NavItem {
  title: string;
  href: string;
}

interface MobileNavProps {
  navItems: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="px-0 md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="px-6 py-8 w-[280px] sm:w-[350px] border-l focus:outline-none"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-6 border-b mb-6">
            <DialogTitle>Portfolio</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/70 transition-colors hover:text-foreground text-lg font-medium hover:translate-x-1 duration-200"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
