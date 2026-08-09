'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toUserMessage } from '@/lib/api/errors';
import { createSingerSchema } from '@/lib/api/schemas';
import type { CategoryDto, SingerDto, CreateSingerInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { singerService } from '@/lib/services/singer.service';
import { useModal } from '@/components/admin/form-modal';
import { AdminFormActions } from '@/components/admin/admin-form-actions';

interface SingerFormProps {
  initialData?: SingerDto;
  categories: CategoryDto[];
}

export function SingerForm({ initialData, categories }: SingerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<CreateSingerInput>({
    resolver: zodResolver(createSingerSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      title: initialData?.title ?? '',
      categoryId: initialData?.categoryId ?? categories[0]?.id ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateSingerInput) => {
      if (isUpdate && initialData) {
        return singerService.updateSinger(initialData.id, values);
      }
      return singerService.createSinger(values);
    },
    onSuccess: () => {
      toast.success(isUpdate ? 'Singer updated' : 'Singer created');
      void queryClient.invalidateQueries({ queryKey: queryKeys.singers });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Create a category before adding a singer.
      </p>
    );
  }

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
          aria-describedby={form.formState.errors.name ? 'name-error' : undefined}
          {...form.register('name')}
        />
      </FormField>
      <FormField
        label="Title"
        htmlFor="title"
        errorId="title-error"
        error={form.formState.errors.title?.message}
      >
        <Input
          id="title"
          aria-invalid={Boolean(form.formState.errors.title)}
          aria-describedby={form.formState.errors.title ? 'title-error' : undefined}
          {...form.register('title')}
        />
      </FormField>
      <FormField
        label="Category"
        htmlFor="categoryId"
        errorId="categoryId-error"
        error={form.formState.errors.categoryId?.message}
      >
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="categoryId"
                aria-invalid={Boolean(form.formState.errors.categoryId)}
                aria-describedby={
                  form.formState.errors.categoryId ? 'categoryId-error' : undefined
                }
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <AdminFormActions
        entityLabel="singer"
        isPending={mutation.isPending}
        isUpdate={isUpdate}
        onCancel={() => setOpen(false)}
      />
    </form>
  );
}
