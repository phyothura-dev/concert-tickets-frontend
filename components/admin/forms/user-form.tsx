"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { useModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toUserMessage } from "@/lib/api/errors";
import { userInputSchema } from "@/lib/api/schemas";
import type { CreateUserInput, UserDto, UserInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { userService } from "@/lib/services/user.service";

interface UserFormProps {
  initialData?: UserDto;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = Boolean(initialData);
  const form = useForm<z.input<typeof userInputSchema>, unknown, UserInput>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      name: initialData?.name ?? "",
      role: initialData?.role ?? "USER",
      status: initialData?.status ?? "ACTIVE",
      emailVerified: initialData?.emailVerified ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: UserInput) => {
      if (isUpdate && initialData) return userService.updateUser(initialData.id, values);
      const createInput: CreateUserInput = {
        email: values.email,
        name: values.name,
        role: values.role,
        status: values.status,
      };
      return userService.createUser(createInput);
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
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Email address" htmlFor="email" required errorId="email-error" error={form.formState.errors.email?.message}>
        <Input id="email" type="email" placeholder="name@example.com" autoComplete="off" aria-invalid={Boolean(form.formState.errors.email)} aria-describedby={form.formState.errors.email ? "email-error" : undefined} {...form.register("email")} />
      </FormField>

    

      <FormField label="Full name" htmlFor="name" required errorId="name-error" error={form.formState.errors.name?.message}>
        <Input id="name" placeholder="e.g. Thura Aung" autoComplete="off" aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? "name-error" : undefined} {...form.register("name")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Role" htmlFor="role" required errorId="role-error" error={form.formState.errors.role?.message}>
          <Controller control={form.control} name="role" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" aria-invalid={Boolean(form.formState.errors.role)} aria-describedby={form.formState.errors.role ? "role-error" : undefined}><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent><SelectItem value="USER">User</SelectItem><SelectItem value="ADMIN">Admin</SelectItem></SelectContent>
            </Select>
          )} />
        </FormField>
        <FormField label="Account status" htmlFor="status" required errorId="status-error" error={form.formState.errors.status?.message}>
          <Controller control={form.control} name="status" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status" aria-invalid={Boolean(form.formState.errors.status)} aria-describedby={form.formState.errors.status ? "status-error" : undefined}><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="DISABLED">Disabled</SelectItem></SelectContent>
            </Select>
          )} />
        </FormField>
      </div>

      {isUpdate ? (
        <Controller
          control={form.control}
          name="emailVerified"
          render={({ field }) => (
            <label htmlFor="emailVerified" className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-4">
              <input id="emailVerified" type="checkbox" checked={field.value} onChange={field.onChange} className="mt-0.5 h-4 w-4 accent-brand" />
              <span>
                <span className="block text-sm font-medium text-foreground">Email verified</span>
                <span className="block text-xs leading-5 text-muted-foreground">Mark this account&apos;s email address as verified.</span>
              </span>
            </label>
          )}
        />
      ) : null}

      <AdminFormActions entityLabel="user" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
