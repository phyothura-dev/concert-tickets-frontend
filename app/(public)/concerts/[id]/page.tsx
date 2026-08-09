import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ConcertDetail } from "@/components/concert/concert-detail";
import { ReservePanel } from "@/components/checkout/reserve-panel";
import { ApiError } from "@/lib/api/errors";
import { concertService } from "@/lib/services/concert.service";
import { ticketService } from "@/lib/services/ticket.service";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({
  params,
}: ConcertPageProps): Promise<Metadata> {
  const { id } = await params;
  const concert = await getConcert(id);

  return {
    title: concert?.title ?? "Concert",
    description: concert
      ? `Reserve tickets for ${concert.title} at ${concert.venue}.`
      : "Concert details",
  };
}

export default async function ConcertPage({ params }: ConcertPageProps) {
  const { id } = await params;
  const [concert, tickets] = await Promise.all([
    getConcert(id),
    ticketService.listTickets(),
  ]);

  if (!concert) {
    notFound();
  }

  const ticket = tickets.find((item) => item.concertId === concert.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <ConcertDetail concert={concert} ticket={ticket} />
      <ReservePanel concert={concert} />
    </div>
  );
}
