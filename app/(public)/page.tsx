import type { Metadata } from "next";
import { ArrowRight, CalendarDays, MapPin, Music2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { ConcertList } from "@/components/concert/concert-list";
import { Button } from "@/components/ui/button";
import { concertService } from "@/lib/services/concert.service";
import { formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concerts",
};

export default async function Home() {
  const concerts = await concertService.listConcerts();
  const totalStock = concerts.reduce((sum, concert) => sum + concert.totalStock, 0);
  const availableStock = concerts.reduce(
    (sum, concert) => sum + concert.availableStock,
    0,
  );
  const soldOutCount = concerts.filter((concert) => concert.availableStock <= 0).length;
  const featuredConcert = concerts[1] ?? concerts[0];
  const hotConcerts = [...concerts].sort((a, b) => a.availableStock - b.availableStock);
  const genres = [
    ["🎵", "Pop", concerts.length],
    ["🎸", "Rock", Math.max(0, concerts.length - 1)],
    ["🎤", "Acoustic", concerts.length + soldOutCount],
    ["🎷", "Jazz", Math.max(1, soldOutCount + 1)],
  ];

  return (
    <div className="space-y-14">
      <section
        className="relative -mx-4 overflow-hidden rounded-b-[2rem] bg-slate-950 px-4 py-20 text-white shadow-2xl shadow-violet-200/70 sm:-mx-6 sm:px-10 lg:rounded-[2rem] lg:px-12"
        data-section="hero"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.2),transparent_12%),radial-gradient(circle_at_72%_12%,rgba(255,255,255,0.18),transparent_10%),linear-gradient(120deg,rgba(17,24,39,0.45),rgba(88,28,135,0.34)),linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.1)),linear-gradient(135deg,#111827,#713f12_44%,#050505)]" />
        <div className="relative max-w-3xl space-y-7">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-violet-600 px-3 py-1">✦ Featured Event</span>
            <span className="text-white/70">1 / {Math.max(1, concerts.length)}</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              {featuredConcert?.title ?? "Upcoming concerts"}
            </h1>
            <p className="text-2xl text-white/80">
              {featuredConcert?.venue ?? "Browse live inventory"}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-white/80">
            {featuredConcert ? (
              <>
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDateTime(featuredConcert.startsAt)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {featuredConcert.venue}
                </span>
              </>
            ) : null}
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Live inventory
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {featuredConcert ? (
              <Button asChild className="h-12 rounded-xl bg-violet-600 px-6 text-white hover:bg-violet-700">
                <a href={`/concerts/${featuredConcert.id}`}>Get Tickets</a>
              </Button>
            ) : null}
            <Button className="h-12 rounded-xl border-white/25 bg-white/15 px-6 text-white hover:bg-white/20" type="button" variant="outline">
              Browse All
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-label="Search concerts"
        className="-mt-16 rounded-2xl bg-white p-4 shadow-2xl shadow-violet-200/60 ring-1 ring-violet-100 lg:mx-8"
        data-section="search"
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_auto]">
          <label className="flex h-12 items-center gap-3 rounded-xl bg-violet-50 px-4 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
              placeholder="Search concerts, artists..."
              type="search"
            />
          </label>
          <label className="flex h-12 items-center gap-3 rounded-xl bg-violet-50 px-4 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400" />
            <select className="w-full bg-transparent outline-none">
              <option>All Locations</option>
              {concerts.map((concert) => (
                <option key={concert.id}>{concert.venue}</option>
              ))}
            </select>
          </label>
          <Button className="h-12 rounded-xl bg-violet-600 px-7 text-white hover:bg-violet-700" type="button">
            Search
          </Button>
        </div>
      </section>

      <section className="space-y-6" data-section="genres">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Browse by Genre</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-violet-600" type="button">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {genres.map(([icon, genre, count]) => (
            <button
              className="rounded-2xl border border-violet-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200/60"
              key={genre}
              type="button"
            >
              <span className="text-3xl">{icon}</span>
              <span className="mt-3 block text-sm font-semibold">{genre}</span>
              <span className="mt-1 block text-xs text-slate-500">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6" data-section="upcoming">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Upcoming Concerts</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-violet-600" type="button">
            See all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <ConcertList concerts={concerts} />
      </section>

      <section className="grid gap-6 rounded-3xl bg-violet-600 p-8 text-center text-white shadow-xl shadow-violet-200 md:grid-cols-4" data-section="metrics">
        {[
          [`${concerts.length.toLocaleString()}+`, "Events Listed"],
          [`${availableStock.toLocaleString()}+`, "Tickets Available"],
          [`${Math.max(0, totalStock - availableStock).toLocaleString()}+`, "Tickets Sold"],
          [`${soldOutCount.toLocaleString()}+`, "Sold Out"],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-violet-100">{label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6" data-section="hot">
        <h2 className="text-2xl font-semibold tracking-tight">Hot Right Now</h2>
        <ConcertList concerts={hotConcerts} startIndex={2} />
      </section>

 

      <footer className="grid gap-10 border-t border-violet-100 bg-white/65 px-1 py-10 text-sm text-slate-500 md:grid-cols-4" data-section="footer">
        <div>
          <div className="flex items-center gap-2 font-semibold text-slate-950">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Music2 className="h-4 w-4" />
            </span>
            Music Concerts
          </div>
          <p className="mt-4 max-w-xs">The premier destination for concert tickets. Secure, instant, guaranteed.</p>
        </div>
        {["Platform", "Support", "Company"].map((group) => (
          <div key={group}>
            <h3 className="font-semibold text-slate-950">{group}</h3>
            <ul className="mt-4 space-y-3">
              {["Browse Events", "Help Center", "Privacy Policy", "Accessibility"].map((item) => (
                <li key={`${group}-${item}`}>
                  <button className="transition hover:text-violet-600" type="button">{item}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="border-t border-violet-100 text-center pt-6 md:col-span-4">
            <p>© 2026 Music Concerts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
