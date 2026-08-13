"use client";

import {
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Mic2,
  Music,
  CreditCard,
  Tags,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Concerts", href: "/admin/concerts", icon: Music },
  { name: "Tickets", href: "/admin/tickets", icon: Ticket },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Singers", href: "/admin/singers", icon: Mic2 },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
        <span className="text-sm font-semibold text-foreground">Admin Panel</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Open admin navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-surface pb-4 md:flex">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Close admin navigation" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-surface pb-4 shadow-xl">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Close admin navigation"
              className="absolute right-3 top-3 z-10"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
