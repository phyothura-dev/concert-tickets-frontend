import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConcertDetail } from "@/components/concert/concert-detail";
import { ReservePanel } from "@/components/checkout/reserve-panel";
import { concertService } from "@/lib/services/concert.service";
import { ticketService } from "@/lib/services/ticket.service";

export const dynamic = "force-dynamic";

type ConcertPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ConcertPageProps): Promise<Metadata> {
  const { id } = await params;
  const concerts = await concertService.listConcerts();
  const concert = concerts.find((item) => item.id === id);

  return {
    title: concert?.title ?? "Concert",
    description: concert
      ? `Reserve tickets for ${concert.title} at ${concert.venue}.`
      : "Concert details",
  };
}

export default async function ConcertPage({ params }: ConcertPageProps) {
  const { id } = await params;
  const [concerts, tickets] = await Promise.all([
    concertService.listConcerts(),
    ticketService.listTickets(),
  ]);
  const concert = concerts.find((item) => item.id === id);

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

