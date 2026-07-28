import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { concertService } from "@/lib/services/concert.service";
import { FormModal } from "@/components/admin/form-modal";
import { ConcertForm } from "@/components/admin/forms/concert-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { ConcertDto } from "@/lib/api/types";

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
        {new Date(concert.startsAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
    )
  },
  {
    header: "Status",
    cell: (concert) => {
      const isSoldOut = concert.availableStock === 0;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isSoldOut ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isSoldOut ? "Sold Out" : "On Sale"}
        </span>
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
            <button className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <ConcertForm initialData={concert} />
        </FormModal>
        <button className="hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }
];

export default async function AdminConcertsPage() {
  const concerts = await concertService.listConcerts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Concert Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage events, inventory, and pricing
          </p>
        </div>
        <div>
          <FormModal 
            title="Create Concert"
            trigger={
              <Button className="bg-violet-600 hover:bg-violet-700 rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Concert
              </Button>
            }
          >
            <ConcertForm />
          </FormModal>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={concerts}
        keyExtractor={(item) => item.id}
        emptyMessage="No concerts found."
      />
    </div>
  );
}
