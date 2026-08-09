import { PlusCircle, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/lib/services/category.service";
import { FormModal } from "@/components/admin/form-modal";
import { CategoryForm } from "@/components/admin/forms/category-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { CategoryDto } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const columns: ColumnDef<CategoryDto>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: (category) => (
      <span className="font-semibold text-zinc-900">{category.name}</span>
    )
  },
  {
    header: "Slug",
    accessorKey: "slug",
    cell: (category) => (
      <span className="text-zinc-500">{category.slug}</span>
    )
  },
  {
    header: "Actions",
    cell: (category) => (
      <div className="flex items-center gap-3 text-zinc-400">
        <FormModal 
          title="Edit Category"
          trigger={
            <button type="button" aria-label={`Edit ${category.name}`} className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <CategoryForm initialData={category} />
        </FormModal>
        <DeleteEntityButton entity="category" id={category.id} label={category.name} />
      </div>
    )
  }
];

export default async function CategoriesPage() {
  const categories = await categoryService.listCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} genres`}
        action={
          <FormModal 
            title="Create Category"
            trigger={
              <Button className="rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            }
          >
            <CategoryForm />
          </FormModal>
        }
      />

      <DataTable 
        columns={columns}
        data={categories}
        keyExtractor={(item) => item.id}
        emptyMessage="No categories found."
      />
    </div>
  );
}
