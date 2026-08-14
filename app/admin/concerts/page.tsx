import { PlusCircle, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { concertService } from "@/lib/services/concert.service";
import { FormModal } from "@/components/admin/form-modal";
import { ConcertForm } from "@/components/admin/forms/concert-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { ConcertDto } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const columns: ColumnDef<ConcertDto>[] = [
  {
    header: "Event",
    accessorKey: "title",
    cell: (concert) => (
      <span className="font-semibold text-zinc-900">{concert.title}</span>
    )
  },
  {
    header: "Artist",
    cell: (concert) => (
      <span className="text-zinc-500">{concert.singers?.[0]?.name || "Unknown"}</span>
    )
  },
  {
    header: "Date",
    cell: (concert) => (
      <span className="text-zinc-500">
        {formatDate(concert.startsAt, "MMM d")}
      </span>
    )
  },
  {
    header: "Status",
    cell: (concert) => {
      const isSoldOut = concert.availableStock === 0;
      return (
        <StatusBadge tone={isSoldOut ? "danger" : "success"}>
          {isSoldOut ? "Sold Out" : "On Sale"}
        </StatusBadge>
      );
    }
  },
  {
    header: "Actions",
    cell: (concert) => (
      <div className="flex items-center gap-3 text-zinc-400">
        <FormModal 
          title="Edit Concert"
          trigger={
            <button type="button" aria-label={`Edit ${concert.title}`} className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <ConcertForm initialData={concert} />
        </FormModal>
        <DeleteEntityButton entity="concert" id={concert.id} label={concert.title} />
      </div>
    )
  }
];

export default async function AdminConcertsPage() {
  const concerts = await concertService.listConcerts();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Concert Management"
        description="Manage events, inventory, and pricing"
        action={
          <FormModal 
            title="Create Concert"
            trigger={
              <Button className="rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Concert
              </Button>
            }
          >
            <ConcertForm />
          </FormModal>
        }
      />

      <DataTable 
        columns={columns}
        data={concerts}
        keyExtractor={(item) => item.id}
        emptyMessage="No concerts found."
      />
    </div>
  );
}
