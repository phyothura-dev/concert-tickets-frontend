'use client';

import { useQuery } from '@tanstack/react-query';
import { Pencil, PlusCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { DataTable, type ColumnDef } from '@/components/admin/data-table';
import { FormModal } from '@/components/admin/form-modal';
import { UserForm } from '@/components/admin/forms/user-form';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { toUserMessage } from '@/lib/api/errors';
import type { UserDto } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { userService } from '@/lib/services/user.service';

const columns: ColumnDef<UserDto>[] = [
  {
    header: 'User',
    accessorKey: 'name',
    cell: (user) => <span className="font-semibold text-foreground">{user.name ?? 'Unnamed user'}</span>,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: (user) => <span className="text-muted-foreground">{user.email}</span>,
  },
  {
    header: 'Role',
    cell: (user) => <StatusBadge>{user.role}</StatusBadge>,
  },
  {
    header: 'Status',
    cell: (user) => <StatusBadge tone={user.status === 'ACTIVE' ? 'success' : 'danger'}>{user.status}</StatusBadge>,
  },
  {
    header: 'Actions',
    cell: (user) => (
      <FormModal
        title="Edit User"
        trigger={
          <button type="button" aria-label={`Edit ${user.name ?? user.email}`} className="text-muted-foreground transition-colors hover:text-foreground">
            <Pencil className="h-4 w-4" />
          </button>
        }
      >
        <UserForm initialData={user} />
      </FormModal>
    ),
  },
];

export default function AdminUsersPage() {
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: userService.listUsers,
  });

  if (usersQuery.isLoading) {
    return <LoadingState />;
  }

  if (usersQuery.isError) {
    return <ErrorState message={toUserMessage(usersQuery.error)} onRetry={() => void usersQuery.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and roles."
        action={
          <FormModal
            title="Create User"
            trigger={
              <Button className="rounded-full px-5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            }
          >
            <UserForm />
          </FormModal>
        }
      />

      <DataTable columns={columns} data={usersQuery.data ?? []} keyExtractor={(item) => item.id} emptyMessage="No users found." />
    </div>
  );
}
