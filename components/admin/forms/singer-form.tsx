"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { useModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toUserMessage } from "@/lib/api/errors";
import { singerInputSchema } from "@/lib/api/schemas";
import type { CategoryDto, SingerDto, SingerInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { singerService } from "@/lib/services/singer.service";

interface SingerFormProps {
  initialData?: SingerDto;
  categories: CategoryDto[];
}

export function SingerForm({ initialData, categories }: SingerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = Boolean(initialData);
  const form = useForm<SingerInput>({
    resolver: zodResolver(singerInputSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      title: initialData?.title ?? "",
      categoryId: initialData?.categoryId ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: SingerInput) =>
      isUpdate && initialData
        ? singerService.updateSinger(initialData.id, values)
        : singerService.createSinger(values),
    onSuccess: () => {
      toast.success(isUpdate ? "Singer updated" : "Singer created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.singers });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  if (categories.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
        Create a category before adding a singer.{" "}
        <Link href="/admin/categories" className="font-medium text-brand hover:underline" onClick={() => setOpen(false)}>Go to Categories</Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Singer name" htmlFor="name" required errorId="name-error" error={form.formState.errors.name?.message}>
        <Input id="name" placeholder="e.g. Taylor Swift" aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? "name-error" : undefined} {...form.register("name")} />
      </FormField>
      <FormField label="Artist title" htmlFor="title" required errorId="title-error" error={form.formState.errors.title?.message}>
        <Input id="title" placeholder="e.g. Singer and songwriter" aria-invalid={Boolean(form.formState.errors.title)} aria-describedby={form.formState.errors.title ? "title-error" : undefined} {...form.register("title")} />
      </FormField>
      <FormField label="Category" htmlFor="categoryId" required errorId="categoryId-error" error={form.formState.errors.categoryId?.message}>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="categoryId" aria-invalid={Boolean(form.formState.errors.categoryId)} aria-describedby={form.formState.errors.categoryId ? "categoryId-error" : undefined}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <AdminFormActions entityLabel="singer" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
