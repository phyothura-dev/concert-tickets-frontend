import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { singerService } from "@/lib/services/singer.service";
import { FormModal } from "@/components/admin/form-modal";
import { SingerForm } from "@/components/admin/forms/singer-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { SingerDto } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const columns: ColumnDef<SingerDto>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: (singer) => (
      <span className="font-semibold text-zinc-900">{singer.name}</span>
    )
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: (singer) => (
      <span className="text-zinc-500">{singer.title}</span>
    )
  },
  {
    header: "Created Date",
    cell: (singer) => (
      <span className="text-zinc-500">
        {new Date(singer.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    )
  },
  {
    header: "Actions",
    cell: (singer) => (
      <div className="flex items-center gap-3 text-zinc-400">
        <FormModal 
          title="Edit Singer"
          trigger={
            <button className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <SingerForm initialData={singer} />
        </FormModal>
        <button className="hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }
];

export default async function SingersPage() {
  const singers = await singerService.listSingers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Singers
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {singers.length} registered artists
          </p>
        </div>
        <div>
          <FormModal 
            title="Create Singer"
            trigger={
              <Button className="bg-violet-600 hover:bg-violet-700 rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Singer
              </Button>
            }
          >
            <SingerForm />
          </FormModal>
        </div>
      </div>



      <DataTable 
        columns={columns}
        data={singers}
        keyExtractor={(item) => item.id}
        emptyMessage="No singers found."
      />
    </div>
  );
}
