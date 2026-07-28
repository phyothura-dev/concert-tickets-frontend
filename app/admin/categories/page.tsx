import { PlusCircle, Pencil, Trash2 } from "lucide-react";
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
            <button className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <CategoryForm initialData={category} />
        </FormModal>
        <button className="hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }
];

export default async function CategoriesPage() {
  const categories = await categoryService.listCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {categories.length} genres
          </p>
        </div>
        <div>
          <FormModal 
            title="Create Category"
            trigger={
              <Button className="bg-violet-600 hover:bg-violet-700 rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            }
          >
            <CategoryForm />
          </FormModal>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={categories}
        keyExtractor={(item) => item.id}
        emptyMessage="No categories found."
      />
    </div>
  );
}
