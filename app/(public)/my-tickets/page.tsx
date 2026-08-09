"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toUserMessage } from "@/lib/api/errors";
import type { ReservationHistory } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { reservationService } from "@/lib/services/reservation.service";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<ReservationHistory["status"], string> = {
  PURCHASED: "bg-success-muted text-success-foreground",
  PENDING: "bg-amber-100 text-amber-800",
  EXPIRED: "bg-muted text-muted-foreground",
};

function TicketHistorySkeleton() {
  return (
    <div aria-label="Loading ticket history" className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          className="h-36 animate-pulse rounded-2xl border border-border bg-surface"
          key={item}
        />
      ))}
    </div>
  );
}

export default function MyTicketsPage() {
  const { data: currentUser, isLoading: isAuthLoading } = useCurrentUser();
  const { openSignIn } = useAuthModal();
  const historyQuery = useQuery({
    queryKey: [...queryKeys.reservationHistory, currentUser?.id],
    queryFn: reservationService.listHistory,
    enabled: Boolean(currentUser),
  });

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-brand/10 bg-gradient-to-br from-slate-950 via-violet-950 to-brand px-6 py-10 text-white shadow-xl shadow-brand/15 sm:px-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Ticket aria-hidden="true" className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            My Tickets
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
            Review your reservation and purchase history in one place.
          </p>
        </div>
      </section>

      <section aria-labelledby="ticket-history-heading" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight" id="ticket-history-heading">
            Ticket history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Newest bookings appear first.
          </p>
        </div>

        {isAuthLoading ? <TicketHistorySkeleton /> : null}

        {!isAuthLoading && !currentUser ? (
          <Card className="px-6 py-12 text-center sm:px-10">
            <Ticket aria-hidden="true" className="mx-auto h-9 w-9 text-brand" />
            <h3 className="mt-4 text-xl font-semibold">Sign in to view your tickets</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your reservation and purchase history is private to your account.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={openSignIn}>Sign in</Button>
              <Button asChild variant="outline">
                <Link href="/#events">Browse events</Link>
              </Button>
            </div>
          </Card>
        ) : null}

        {currentUser && historyQuery.isLoading ? <TicketHistorySkeleton /> : null}

        {currentUser && historyQuery.isError ? (
          <Card className="border-danger/20 px-6 py-10 text-center">
            <p className="font-medium text-danger">Could not load ticket history</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {toUserMessage(historyQuery.error)}
            </p>
            <Button className="mt-5" onClick={() => historyQuery.refetch()} variant="outline">
              Try again
            </Button>
          </Card>
        ) : null}

        {currentUser && historyQuery.data?.length === 0 ? (
          <Card className="px-6 py-12 text-center">
            <Ticket aria-hidden="true" className="mx-auto h-9 w-9 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No tickets yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your ticket history will appear here after your first reservation.
            </p>
            <Button asChild className="mt-6">
              <Link href="/#events">Explore events</Link>
            </Button>
          </Card>
        ) : null}

        {currentUser && historyQuery.data?.length ? (
          <div className="space-y-3">
            {historyQuery.data.map((reservation) => (
              <article
                className="grid gap-5 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-brand/25 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
                key={reservation.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      className="truncate text-lg font-semibold hover:text-brand"
                      href={`/concerts/${reservation.concert.id}`}
                    >
                      {reservation.concert.title}
                    </Link>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusStyles[reservation.status],
                      )}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays aria-hidden="true" className="h-4 w-4" />
                      {formatDateTime(reservation.concert.startsAt)}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin aria-hidden="true" className="h-4 w-4" />
                      {reservation.concert.venue}
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                    Booked {formatDateTime(reservation.createdAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:block sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Quantity
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{reservation.quantity}</p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <PublicFooter />
    </div>
  );
}
