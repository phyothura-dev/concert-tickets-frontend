import { CalendarDays, MapPin, Ticket } from "lucide-react";
import type { ConcertDto, TicketDto } from "@/lib/api/types";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";

export function ConcertDetail({
  concert,
  ticket,
}: {
  concert: ConcertDto;
  ticket?: TicketDto;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
          Live event
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {concert.title}
        </h1>
      </div>
      <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Venue</p>
          <div className="mt-2 flex items-center gap-2 font-medium text-zinc-950">
            <MapPin className="h-4 w-4 text-sky-500" />
            {concert.venue}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Starts at</p>
          <div className="mt-2 flex items-center gap-2 font-medium text-zinc-950">
            <CalendarDays className="h-4 w-4 text-sky-500" />
            {formatDateTime(concert.startsAt)}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Ticket</p>
          <div className="mt-2 flex items-center gap-2 font-medium text-zinc-950">
            <Ticket className="h-4 w-4 text-sky-500" />
            {ticket
              ? `${ticket.type} ${formatCurrency(ticket.price)}`
              : "Inventory pending"}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Available stock</p>
            <p className="mt-1 text-4xl font-semibold">{concert.availableStock}</p>
          </div>
          <p className="text-sm text-zinc-400">
            Total inventory: {concert.totalStock}
          </p>
        </div>
        <div className="mt-4 h-px bg-white/10" />
        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
          Reserve quickly to lock a hold, then finish checkout before the timer
          expires.
        </p>
      </div>
    </section>
  );
}
