"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toUserMessage } from "@/lib/api/errors";
import { createUserSchema } from "@/lib/api/schemas";
import type { UserDto, CreateUserInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { userService } from "@/lib/services/user.service";
import { useModal } from "@/components/admin/form-modal";
import { AdminFormActions } from "@/components/admin/admin-form-actions";

interface UserFormProps {
  initialData?: UserDto;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<z.input<typeof createUserSchema>, unknown, CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      name: initialData?.name ?? "",
      role: initialData?.role ?? "USER",
      status: initialData?.status ?? "ACTIVE",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateUserInput) => {
      if (isUpdate && initialData) {
        return userService.updateUser(initialData.id, values);
      }
      return userService.createUser(values);
    },
    onSuccess: () => {
      toast.success(isUpdate ? "User updated" : "User created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.users });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <FormField
        label="Email"
        htmlFor="email"
        errorId="email-error"
        error={form.formState.errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-describedby={form.formState.errors.email ? "email-error" : undefined}
          {...form.register("email")}
        />
      </FormField>
      {!isUpdate ? (
        <p className="text-xs text-muted-foreground">
          The backend assigns the configured default password automatically.
        </p>
      ) : null}
      <FormField
        label="Name"
        htmlFor="name"
        errorId="name-error"
        error={form.formState.errors.name?.message}
      >
        <Input
          id="name"
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-describedby={form.formState.errors.name ? "name-error" : undefined}
          {...form.register("name")}
        />
      </FormField>
      
      <FormField
        label="Role"
        htmlFor="role"
        errorId="role-error"
        error={form.formState.errors.role?.message}
      >
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="role"
                aria-invalid={Boolean(form.formState.errors.role)}
                aria-describedby={form.formState.errors.role ? "role-error" : undefined}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Status"
        htmlFor="status"
        errorId="status-error"
        error={form.formState.errors.status?.message}
      >
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="status"
                aria-invalid={Boolean(form.formState.errors.status)}
                aria-describedby={form.formState.errors.status ? "status-error" : undefined}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <AdminFormActions
        entityLabel="user"
        isPending={mutation.isPending}
        isUpdate={isUpdate}
        onCancel={() => setOpen(false)}
      />
    </form>
  );
}
