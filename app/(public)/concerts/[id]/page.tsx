import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArrowLeft, CalendarDays, Clock3, MapPin, Music2, Ticket, Users } from 'lucide-react';
import { ReservePanel } from '@/components/checkout/reserve-panel';
import { ApiError } from '@/lib/api/errors';
import { concertService } from '@/lib/services/concert.service';
import { ticketService } from '@/lib/services/ticket.service';
import { formatDate, formatTime } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

const getConcert = cache(async (id: string) => {
  try {
    return await concertService.getConcert(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

type ConcertPageProps = {
  params: Promise<{ id: string }>;
};

function EventInfo({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-brand/10 bg-white/95 p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export async function generateMetadata({ params }: ConcertPageProps): Promise<Metadata> {
  const { id } = await params;
  const concert = await getConcert(id);

  return {
    title: concert?.title ?? 'Concert',
    description: concert ? `Reserve tickets for ${concert.title} at ${concert.venue}.` : 'Concert details',
  };
}

export default async function ConcertPage({ params }: ConcertPageProps) {
  const { id } = await params;
  const [concert, tickets] = await Promise.all([getConcert(id), ticketService.listTickets()]);

  if (!concert) {
    notFound();
  }

  const concertTickets = tickets.filter((item) => item.concertId === concert.id);
  const performer = concert.singers.map((singer) => singer.name).join(', ') || 'Live performers';

  return (
    <div className="-mx-4 -my-8 sm:-mx-6 lg:-mx-10 lg:-my-10">
      <section id="top" className="relative min-h-[31rem] scroll-mt-20 overflow-hidden bg-slate-950 text-white sm:min-h-[34rem]">
        <Image src="/demo-preview.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-black/35" />
        <div className="relative mx-auto flex min-h-[31rem] w-full max-w-7xl flex-col px-5 py-6 sm:min-h-[34rem] sm:px-8 lg:px-10">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/55"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back
          </Link>
          <div className="mt-auto max-w-3xl pb-20 sm:pb-24">
            <div className="flex flex-wrap gap-2">
              {concert.category ? <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand">{concert.category.name}</span> : null}
              <span className="rounded-full bg-brand/90 px-3 py-1 text-xs font-semibold text-white">Featured event</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{concert.title}</h1>
            <p className="mt-2 text-lg font-medium text-white/80 sm:text-xl">{performer}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 grid w-full max-w-7xl gap-6 px-4 pb-12 sm:px-8 lg:px-10">
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EventInfo icon={CalendarDays} label="Date" value={formatDate(concert.startsAt)} />
          <EventInfo icon={Clock3} label="Time" value={formatTime(concert.startsAt)} />
          <EventInfo icon={MapPin} label="Venue" value={concert.venue} />
          <EventInfo icon={Music2} label="Category" value={concert.category?.name ?? 'Live music'} />
          <EventInfo icon={Users} label="Capacity" value={concert.totalStock.toLocaleString()} />
          <EventInfo icon={Ticket} label="Available" value={`${concert.availableStock.toLocaleString()} seats`} />
        </div>
      </section>

      <ReservePanel concert={concert} tickets={concertTickets} />
    </div>
  );
}
