'use client';

import Link from 'next/link';
import { Menu, Music2 } from 'lucide-react';
import { AuthStatus } from '@/components/auth/auth-status';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-8xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/30">
            <Music2 className="h-4 w-4" />
          </span>
          <span className="truncate text-lg">Music Concerts</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full bg-white/60 p-1 md:flex">
            <Button asChild className="h-8 rounded-full px-4 text-slate-600 hover:bg-white hover:text-slate-950" variant="ghost">
              <Link href="/#events">Events</Link>
            </Button>
            <Button asChild className="h-8 rounded-full px-4 text-slate-600 hover:bg-white hover:text-slate-950" variant="ghost">
              <Link href="/my-tickets">My Tickets</Link>
            </Button>

          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open navigation menu" size="icon" variant="outline">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/#events">Events</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-tickets">My Tickets</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth — always visible */}
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
