import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Music, Search } from 'lucide-react';
import { ConcertList } from '@/components/concert/concert-list';
import { HomeHeroCarousel } from '@/components/concert/home-hero-carousel';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { categoryService } from '@/lib/services/category.service';
import { concertService, type ConcertFilters } from '@/lib/services/concert.service';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Concerts',
};

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function singleValue(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function filterHref(filters: ConcertFilters, categoryId?: string): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.venue) params.set('venue', filters.venue);
  if (categoryId) params.set('categoryId', categoryId);
  const query = params.toString();
  return `${query ? `/?${query}` : '/'}#events`;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const filters: ConcertFilters = {
    search: singleValue(params.search) || undefined,
    venue: singleValue(params.venue) || undefined,
    categoryId: singleValue(params.categoryId) || undefined,
  };
  const hasFilters = Boolean(filters.search || filters.venue || filters.categoryId);

  const [categories, allConcerts, filteredConcerts] = await Promise.all([
    categoryService.listCategories(),
    concertService.listConcerts(),
    hasFilters ? concertService.listConcerts(filters) : Promise.resolve(null),
  ]);
  const concerts = filteredConcerts ?? allConcerts;
  const totalStock = allConcerts.reduce((sum, concert) => sum + concert.totalStock, 0);
  const availableStock = allConcerts.reduce((sum, concert) => sum + concert.availableStock, 0);
  const soldOutCount = allConcerts.filter((concert) => concert.availableStock <= 0).length;
  const hotConcerts = [...allConcerts].sort((a, b) => a.availableStock - b.availableStock);
  const venues = [...new Set(allConcerts.map((concert) => concert.venue))].sort();
  const categoryCounts = new Map<string, number>();
  allConcerts.forEach((concert) => {
    if (concert.categoryId) {
      categoryCounts.set(concert.categoryId, (categoryCounts.get(concert.categoryId) ?? 0) + 1);
    }
  });

  return (
    <div className="space-y-14">
      <div className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-10 lg:-mt-10">
        <HomeHeroCarousel concerts={allConcerts} />

        <section
          aria-label="Search concerts"
          className="relative z-20 mx-4 -mt-14 rounded-2xl bg-white p-4 shadow-2xl shadow-violet-950/20 ring-1 ring-violet-100 sm:mx-8 lg:mx-auto lg:max-w-6xl"
          data-section="search"
        >
          <form action="/" className="grid gap-3 lg:grid-cols-[1fr_13rem_auto]">
            <label className="flex h-12 items-center gap-3 rounded-xl bg-violet-50 px-4 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search concerts or artists</span>
              <input className="w-full bg-transparent outline-none placeholder:text-slate-400" defaultValue={filters.search} name="search" placeholder="Search concerts, artists..." type="search" />
            </label>
            <label className="flex h-12 items-center gap-3 rounded-xl bg-violet-50 px-4 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="sr-only">Venue</span>
              <select className="w-full bg-transparent outline-none" defaultValue={filters.venue ?? ''} name="venue">
                <option value="">All Locations</option>
                {venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </label>
            <Button className="h-12 rounded-xl px-7" type="submit">
              Search
            </Button>
            {filters.categoryId ? <input name="categoryId" type="hidden" value={filters.categoryId} /> : null}
          </form>
        </section>
      </div>

      <section className="space-y-6" data-section="categories">
        <h2 className="text-2xl font-semibold tracking-tight">Browse by Category</h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              aria-current={filters.categoryId === category.id ? 'true' : undefined}
              className="rounded-2xl border border-violet-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200/60 aria-[current=true]:border-brand aria-[current=true]:ring-2 aria-[current=true]:ring-brand/20"
              href={filterHref(filters, category.id)}
              key={category.id}
            >
              <Music className='mx-auto text-primary'/>
              <span className="mt-3 block text-sm font-semibold">{category.name}</span>
              <span className="mt-1 block text-xs text-slate-500">{categoryCounts.get(category.id) ?? 0} events</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6" data-section="upcoming" id="events">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{hasFilters ? 'Filtered Events' : 'Upcoming Concerts'}</h2>
            {hasFilters ? <p className="mt-1 text-sm text-muted-foreground">{concerts.length} matching events</p> : null}
          </div>
          {hasFilters ? (
            <Link className="flex items-center gap-1 text-sm font-semibold text-brand" href="/#events">
              Clear filters <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <ConcertList concerts={concerts} />
      </section>

      <section className="grid gap-6 rounded-3xl bg-brand p-8 text-center text-white shadow-xl shadow-brand/20 md:grid-cols-4" data-section="metrics">
        {[
          [`${allConcerts.length.toLocaleString()}+`, 'Events Listed'],
          [`${availableStock.toLocaleString()}+`, 'Tickets Available'],
          [`${Math.max(0, totalStock - availableStock).toLocaleString()}+`, 'Tickets Sold'],
          [`${soldOutCount.toLocaleString()}+`, 'Sold Out'],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-violet-100">{label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6" data-section="hot">
        <h2 className="text-2xl font-semibold tracking-tight">Hot Right Now</h2>
        <ConcertList concerts={hotConcerts} />
      </section>

      <PublicFooter />
    </div>
  );
}
