import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ticketService } from "@/lib/services/ticket.service";
import { concertService } from "@/lib/services/concert.service";
import { FormModal } from "@/components/admin/form-modal";
import { TicketForm } from "@/components/admin/forms/ticket-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { TicketDto } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const columns: ColumnDef<TicketDto>[] = [
  {
    header: "Ticket Type",
    accessorKey: "type",
    cell: (ticket) => (
      <span className="font-semibold text-zinc-900">{ticket.type}</span>
    )
  },
  {
    header: "Concert",
    accessorKey: "concertName",
    cell: (ticket) => (
      <span className="text-zinc-500">{ticket.concertName}</span>
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
      const isAvailable = ticket.availableQuantity > 0;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isAvailable ? `${ticket.availableQuantity} left` : "Sold Out"}
        </span>
      );
    }
  },
];

export default async function AdminTicketsPage() {
  const [tickets, concerts] = await Promise.all([
    ticketService.listTickets(),
    concertService.listConcerts(),
  ]);

  const columnsWithActions: ColumnDef<TicketDto>[] = [
    ...columns,
    {
      header: "Actions",
      cell: (ticket) => (
        <div className="flex items-center gap-3 text-zinc-400">
          <FormModal 
            title="Edit Ticket"
            trigger={
              <button className="hover:text-zinc-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            }
          >
            <TicketForm initialData={ticket} concerts={concerts} />
          </FormModal>
          <button className="hover:text-red-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Tickets Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage ticket types and availability
          </p>
        </div>
        <div>
          <FormModal 
            title="Create Ticket"
            trigger={
              <Button className="bg-violet-600 hover:bg-violet-700 rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Ticket
              </Button>
            }
          >
            <TicketForm concerts={concerts} />
          </FormModal>
        </div>
      </div>

      <DataTable 
        columns={columnsWithActions}
        data={tickets}
        keyExtractor={(item) => item.id}
        emptyMessage="No tickets found."
      />
    </div>
  );
}


