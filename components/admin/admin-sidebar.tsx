"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Music,
  Ticket,
  Users,
  Tags,
  Mic2,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Concerts", href: "/admin/concerts", icon: Music },
  { name: "Tickets", href: "/admin/tickets", icon: Ticket },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Singers", href: "/admin/singers", icon: Mic2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r-gray-700 bg-white pb-4">
      <div className="flex h-16 items-center border-b-gray-700 px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Admin Panel
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t-gray-700 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
