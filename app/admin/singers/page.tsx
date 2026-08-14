import { Pencil, PlusCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { FormModal } from "@/components/admin/form-modal";
import { SingerForm } from "@/components/admin/forms/singer-form";
import { Button } from "@/components/ui/button";
import type { CategoryDto, SingerDto } from "@/lib/api/types";
import { categoryService } from "@/lib/services/category.service";
import { singerService } from "@/lib/services/singer.service";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

function getColumns(categories: CategoryDto[]): ColumnDef<SingerDto>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (singer) => (
        <span className="font-semibold text-zinc-900">{singer.name}</span>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (singer) => <span className="text-zinc-500">{singer.title}</span>,
    },
    {
      header: "Category",
      cell: (singer) => (
        <span className="text-zinc-500">
          {singer.category?.name ?? "Uncategorized"}
        </span>
      ),
    },
    {
      header: "Created Date",
      cell: (singer) => (
        <span className="text-zinc-500">
          {formatDate(singer.createdAt)}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (singer) => (
        <div className="flex items-center gap-3 text-zinc-400">
          <FormModal
            title="Edit Singer"
            trigger={
              <button
                type="button"
                aria-label={`Edit ${singer.name}`}
                className="transition-colors hover:text-zinc-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
            }
          >
            <SingerForm initialData={singer} categories={categories} />
          </FormModal>
          <DeleteEntityButton entity="singer" id={singer.id} label={singer.name} />
        </div>
      ),
    },
  ];
}

export default async function SingersPage() {
  const [singers, categories] = await Promise.all([
    singerService.listSingers(),
    categoryService.listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Singers"
        description={`${singers.length} registered artists`}
        action={
          <FormModal
            title="Create Singer"
            trigger={
              <Button className="rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Singer
              </Button>
            }
          >
            <SingerForm categories={categories} />
          </FormModal>
        }
      />
      <DataTable
        columns={getColumns(categories)}
        data={singers}
        keyExtractor={(item) => item.id}
        emptyMessage="No singers found."
      />
    </div>
  );
}
