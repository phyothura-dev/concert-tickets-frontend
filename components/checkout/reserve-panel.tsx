'use client';

import { useQuery } from '@tanstack/react-query';
import { Armchair, CheckCircle2, LockKeyhole, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useReservation } from '@/hooks/use-reservation';
import { toUserMessage } from '@/lib/api/errors';
import type { ConcertDto, SeatDto, TicketDto } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { ticketService } from '@/lib/services/ticket.service';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useAuthModal } from '@/providers/auth-modal-provider';

const SEATS_PER_ROW = 10;
const SEAT_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-[10px] border text-[10px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';
const seatStatusClasses: Record<SeatDto['status'], string> = {
  AVAILABLE: 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:-translate-y-0.5 hover:border-emerald-500',
  HELD: 'cursor-not-allowed border-amber-300 bg-amber-100 text-amber-700',
  SOLD: 'cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400',
};

function toRows(seats: SeatDto[]) {
  const rows: SeatDto[][] = [];
  for (let index = 0; index < seats.length; index += SEATS_PER_ROW) {
    rows.push(seats.slice(index, index + SEATS_PER_ROW));
  }
  return rows;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn('h-3 w-3 rounded-full', color)} />
      {label}
    </span>
  );
}

export function ReservePanel({ concert, tickets }: { concert: ConcertDto; tickets: TicketDto[] }) {
  const router = useRouter();
  const userQuery = useCurrentUser();
  const { openSignIn } = useAuthModal();
  const { reserveMutation } = useReservation();
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? '');
  const [selected, setSelected] = useState<string[]>([]);
  const ticket = tickets.find((item) => item.id === ticketId);
  const seatsQuery = useQuery({
    queryKey: queryKeys.seats(ticketId),
    queryFn: () => ticketService.listSeats(ticketId),
    enabled: Boolean(ticketId),
  });
  const rows = useMemo(() => toRows(seatsQuery.data ?? []), [seatsQuery.data]);
  const selectedSeats = useMemo(() => (seatsQuery.data ?? []).filter((seat) => selected.includes(seat.id)), [seatsQuery.data, selected]);
  const subtotal = (ticket?.price ?? 0) * selected.length;

  function chooseTicket(id: string) {
    setTicketId(id);
    setSelected([]);
  }

  function toggleSeat(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((seatId) => seatId !== id);
      if (current.length >= 5) {
        toast.error('You can select up to 5 seats');
        return current;
      }
      return [...current, id];
    });
  }

  function reserve() {
    if (!ticket || selected.length === 0) return;
    reserveMutation.mutate(
      { ticketId: ticket.id, seatIds: selected },
      {
        onSuccess: (reservation) => {
          toast.success('Seats held for 15 minutes');
          router.push(`/checkout/${reservation.id}`);
        },
        onError: (error) => {
          toast.error(toUserMessage(error));
          setSelected([]);
          void seatsQuery.refetch();
        },
      },
    );
  }

  return (
    <section id="seat-selection" className="scroll-mt-20 border-t border-brand/10 bg-[#f8f6ff] px-4 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <h2 className="mt-7 text-3xl font-bold tracking-tight">Select Your Seats</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {concert.title} · {formatDateTime(concert.startsAt)} · {concert.venue}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800">
            <LockKeyhole className="h-4 w-4" /> 15-minute hold starts after selection
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Ticket types">
          {tickets.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={ticketId === item.id}
              onClick={() => chooseTicket(item.id)}
              className={cn(
                'rounded-full border px-5 py-2 text-sm font-semibold transition',
                ticketId === item.id
                  ? 'border-brand bg-brand text-white shadow-md shadow-brand/20'
                  : 'border-brand/15 bg-white text-muted-foreground hover:border-brand/40 hover:text-foreground',
              )}
            >
              {item.type} · {formatCurrency(item.price)}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 rounded-3xl border border-brand/10 bg-white p-4 shadow-sm sm:p-7">
            <div className="mx-auto mb-8 flex h-11 max-w-xs items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-bold tracking-[0.2em] text-brand shadow-inner">
              STAGE
            </div>

            {seatsQuery.isLoading ? (
              <LoadingState className="min-h-72" />
            ) : seatsQuery.isError ? (
              <ErrorState className="min-h-72" message={toUserMessage(seatsQuery.error)} onRetry={() => void seatsQuery.refetch()} />
            ) : rows.length ? (
              <div className="max-h-[35rem] overflow-auto pb-3">
                <div className="mx-auto w-max min-w-full space-y-2">
                  {rows.map((row, rowIndex) => (
                    <div key={row[0]?.id ?? rowIndex} className="grid grid-cols-[1.5rem_repeat(10,2.25rem)] items-center gap-2">
                      <span className="text-center text-xs font-bold text-muted-foreground">{String.fromCharCode(65 + rowIndex)}</span>
                      {row.map((seat) => {
                        const isSelected = selected.includes(seat.id);
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={seat.status !== 'AVAILABLE' || (selected.length >= 5 && !isSelected)}
                            onClick={() => toggleSeat(seat.id)}
                            aria-label={`${seat.label}, ${seat.status.toLowerCase()}`}
                            aria-pressed={isSelected}
                            title={seat.label}
                            className={cn(
                              SEAT_CLASS,
                              isSelected ? 'border-brand bg-brand text-white shadow-md shadow-brand/30' : seatStatusClasses[seat.status],
                            )}
                          >
                            {seat.sequence}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-muted-foreground">No seats configured for this ticket type.</div>
            )}

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-brand/10 pt-5">
              <LegendItem color="bg-emerald-400" label="Available" />
              <LegendItem color="bg-brand" label="Selected" />
              <LegendItem color="bg-amber-400" label="Reserved" />
              <LegendItem color="bg-rose-300" label="Sold" />
            </div>
          </div>

          <aside className="rounded-3xl border border-brand/10 bg-white p-5 shadow-lg shadow-brand/5 lg:sticky lg:top-24 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Selected Seats ({selected.length})</h3>
              <Ticket className="h-5 w-5 text-brand" />
            </div>
            {selectedSeats.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => toggleSeat(seat.id)}
                    className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20"
                    title="Remove seat"
                  >
                    {seat.label} ×
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Armchair className="mx-auto h-9 w-9 text-zinc-300" />
                <p className="mx-auto mt-3 max-w-44 text-sm leading-5 text-muted-foreground">Click available seats on the map to select them</p>
              </div>
            )}
            <div className="space-y-3 border-t border-brand/10 pt-5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Ticket type</span>
                <span className="font-medium text-foreground">{ticket?.type ?? '—'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Price per seat</span>
                <span className="font-medium text-foreground">{ticket ? formatCurrency(ticket.price) : '—'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service fee</span>
                <span className="font-medium text-foreground">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between border-t border-brand/10 pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-brand">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {!userQuery.isLoading && !userQuery.data ? (
              <Button className="mt-6 h-13 w-full rounded-2xl" onClick={openSignIn}>
                Sign in to continue
              </Button>
            ) : (
              <Button
                className="mt-6 h-13 w-full rounded-2xl text-base"
                disabled={!ticket || selected.length === 0 || reserveMutation.isPending}
                onClick={reserve}
              >
                {reserveMutation.isPending ? 'Reserving...' : 'Continue to Checkout'}
              </Button>
            )}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Secure seat reservation
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
