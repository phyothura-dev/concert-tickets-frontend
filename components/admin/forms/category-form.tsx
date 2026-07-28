"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toUserMessage } from "@/lib/api/errors";
import { createCategorySchema } from "@/lib/api/schemas";
import type { CategoryDto, CreateCategoryInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { categoryService } from "@/lib/services/category.service";
import { useModal } from "@/components/admin/form-modal";

interface CategoryFormProps {
  initialData?: CategoryDto;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateCategoryInput) => {
      if (isUpdate && initialData) {
        return categoryService.updateCategory(initialData.id, values);
      }
      return categoryService.createCategory(values);
    },
    onSuccess: () => {
      toast.success(isUpdate ? "Category updated" : "Category created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
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
        label="Slug"
        htmlFor="slug"
        errorId="slug-error"
        error={form.formState.errors.slug?.message}
      >
        <Input
          id="slug"
          aria-invalid={Boolean(form.formState.errors.slug)}
          aria-describedby={form.formState.errors.slug ? "slug-error" : undefined}
          {...form.register("slug")}
        />
      </FormField>

      <div className="flex justify-end pt-4 gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setOpen(false)}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending 
            ? (isUpdate ? "Updating..." : "Creating...") 
            : (isUpdate ? "Update category" : "Create category")
          }
        </Button>
      </div>
    </form>
  );
}
