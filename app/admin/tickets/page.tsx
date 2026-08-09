import { PlusCircle, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { ticketService } from "@/lib/services/ticket.service";
import { concertService } from "@/lib/services/concert.service";
import { FormModal } from "@/components/admin/form-modal";
import { TicketForm } from "@/components/admin/forms/ticket-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { TicketDto } from "@/lib/api/types";

export const dynamic = "force-dynamic";

function getColumns(concertNames: Map<string, string>): ColumnDef<TicketDto>[] {
  return [
  {
    header: "Ticket Type",
    accessorKey: "type",
    cell: (ticket) => (
      <span className="font-semibold text-zinc-900">{ticket.type}</span>
    )
  },
  {
    header: "Concert",
    cell: (ticket) => (
      <span className="text-zinc-500">
        {concertNames.get(ticket.concertId) ?? "Unknown concert"}
      </span>
    )
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (ticket) => (
      <span className="text-zinc-900">${ticket.price.toFixed(2)}</span>
    )
  },
  {
    header: "Status",
    cell: (ticket) => {
      const isAvailable = ticket.remainingStock > 0;
      return (
        <StatusBadge tone={isAvailable ? "success" : "danger"}>
          {isAvailable ? `${ticket.remainingStock} left` : "Sold Out"}
        </StatusBadge>
      );
    }
  },
  ];
}

export default async function AdminTicketsPage() {
  const [tickets, concerts] = await Promise.all([
    ticketService.listTickets(),
    concertService.listConcerts(),
  ]);

  const concertNames = new Map(concerts.map((concert) => [concert.id, concert.title]));
  const columnsWithActions: ColumnDef<TicketDto>[] = [
    ...getColumns(concertNames),
    {
      header: "Actions",
      cell: (ticket) => (
        <div className="flex items-center gap-3 text-zinc-400">
          <FormModal 
            title="Edit Ticket"
            trigger={
              <button type="button" aria-label={`Edit ${ticket.type} ticket`} className="hover:text-zinc-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            }
          >
            <TicketForm initialData={ticket} concerts={concerts} />
          </FormModal>
          <DeleteEntityButton entity="ticket" id={ticket.id} label={`${ticket.type} ticket`} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tickets Management"
        description="Manage ticket types and availability"
        action={
          <FormModal 
            title="Create Ticket"
            trigger={
              <Button className="rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Ticket
              </Button>
            }
          >
            <TicketForm concerts={concerts} />
          </FormModal>
        }
      />

      <DataTable 
        columns={columnsWithActions}
        data={tickets}
        keyExtractor={(item) => item.id}
        emptyMessage="No tickets found."
      />
    </div>
  );
}
