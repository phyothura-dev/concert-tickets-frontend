"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { useModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toUserMessage } from "@/lib/api/errors";
import { categoryInputSchema } from "@/lib/api/schemas";
import type { CategoryDto, CategoryInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { categoryService } from "@/lib/services/category.service";

interface CategoryFormProps {
  initialData?: CategoryDto;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = Boolean(initialData);
  const form = useForm<z.input<typeof categoryInputSchema>, unknown, CategoryInput>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: { name: initialData?.name ?? "", slug: initialData?.slug ?? "" },
  });

  const mutation = useMutation({
    mutationFn: (values: CategoryInput) =>
      isUpdate && initialData
        ? categoryService.updateCategory(initialData.id, values)
        : categoryService.createCategory(values),
    onSuccess: () => {
      toast.success(isUpdate ? "Category updated" : "Category created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      void queryClient.invalidateQueries({ queryKey: queryKeys.singers });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Category name" htmlFor="name" required errorId="name-error" error={form.formState.errors.name?.message}>
        <Input id="name" placeholder="e.g. Pop" aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? "name-error" : undefined} {...form.register("name")} />
      </FormField>
      <FormField label="Slug (optional)" htmlFor="slug" errorId="slug-error" error={form.formState.errors.slug?.message}>
        <Input id="slug" placeholder="e.g. pop-music" aria-invalid={Boolean(form.formState.errors.slug)} aria-describedby={form.formState.errors.slug ? "slug-error" : undefined} {...form.register("slug")} />
      </FormField>
      <AdminFormActions entityLabel="category" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
