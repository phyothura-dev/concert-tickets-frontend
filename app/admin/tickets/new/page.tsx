import { CreateTicketForm } from "@/components/admin/create-ticket-form";
import { concertService } from "@/lib/services/concert.service";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const concerts = await concertService.listConcerts();

  return (
    <div className="mx-auto max-w-2xl">
      <CreateTicketForm concerts={concerts} />
    </div>
  );
}

