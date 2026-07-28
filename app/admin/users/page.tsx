import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService } from "@/lib/services/user.service";
import { FormModal } from "@/components/admin/form-modal";
import { UserForm } from "@/components/admin/forms/user-form";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { UserDto } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const columns: ColumnDef<UserDto>[] = [
  {
    header: "User",
    accessorKey: "name",
    cell: (user) => (
      <span className="font-semibold text-zinc-900">{user.name}</span>
    )
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (user) => (
      <span className="text-zinc-500">{user.email}</span>
    )
  },
  {
    header: "Role",
    cell: (user) => (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
        {user.role}
      </span>
    )
  },
  {
    header: "Actions",
    cell: (user) => (
      <div className="flex items-center gap-3 text-zinc-400">
        <FormModal 
          title="Edit User"
          trigger={
            <button className="hover:text-zinc-600 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <UserForm initialData={user} />
        </FormModal>
        <button className="hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }
];

export default async function AdminUsersPage() {
  const users = await userService.listUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Users
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage user accounts and roles.
          </p>
        </div>
        <div>
          <FormModal 
            title="Create User"
            trigger={
              <Button className="bg-violet-600 hover:bg-violet-700 rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            }
          >
            <UserForm />
          </FormModal>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={users}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found."
      />
    </div>
  );
}
