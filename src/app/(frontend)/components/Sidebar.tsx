"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Receipt,
  FileText,
  Clock,
  Menu,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/Transactions",
    icon: Briefcase,
  },
  {
    title: "Expenses",
    href: "/Expenses",
    icon: Receipt,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Advances",
    href: "/advances",
    icon: Clock,
  },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="container py-4 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}

export function Sidebar(): React.ReactElement {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 absolute top-2 left-2 z-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center px-4 bg-slate-900 text-white">
              <span className="text-lg font-medium">Expense</span>
            </div>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="flex-1 overflow-auto py-2">
              <ul className="grid gap-1 px-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100",
                        pathname === item.href
                          ? "bg-slate-100 text-black"
                          : "text-slate-600"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-slate-200 bg-white">
          <div className="flex h-14 items-center px-4 bg-slate-900 text-white">
            <span className="text-lg font-medium">Expense</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 py-4">
              <ul className="grid gap-1 px-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100",
                        pathname === item.href
                          ? "bg-slate-100 text-black"
                          : "text-slate-600"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
