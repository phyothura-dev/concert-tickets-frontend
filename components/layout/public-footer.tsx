import Link from "next/link";
import { LockKeyhole, Music2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export function PublicFooter() {
  return (
    <footer
      className="overflow-hidden rounded-3xl border border-brand/10 bg-slate-950 text-white shadow-xl shadow-brand/10"
      data-section="footer"
    >
      <div className="grid gap-8 px-6 py-9 sm:px-9 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-lg">
          <Link className="inline-flex items-center gap-3 font-semibold" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/30">
              <Music2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="text-lg">Music Concerts</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Discover live events and reserve available tickets in a few simple
            steps.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-2">
          <Link
            className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            href="/#events"
          >
            Events
          </Link>
          <Link
            className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            href="/my-tickets"
          >
            My Tickets
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <p>© {formatDate(new Date(), "yyyy")} Music Concerts. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
          Secure booking with live inventory
        </p>
      </div>
    </footer>
  );
}
