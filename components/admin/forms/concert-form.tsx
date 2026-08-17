'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AdminFormActions } from '@/components/admin/admin-form-actions';
import { useModal } from '@/components/admin/form-modal';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { MultiSelectChips } from '@/components/ui/multi-select-chips';
import { toUserMessage } from '@/lib/api/errors';
import { concertInputSchema } from '@/lib/api/schemas';
import type { CategoryDto, ConcertDto, ConcertInput, SingerDto } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { concertService } from '@/lib/services/concert.service';
import { formatDateTimeInput, toIsoDateTime } from '@/lib/utils/format';

interface ConcertFormProps {
  initialData?: ConcertDto;
  categories: CategoryDto[];
  singers: SingerDto[];
}

export function ConcertForm({ initialData, categories, singers }: ConcertFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = Boolean(initialData);
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<ConcertInput>({
    resolver: zodResolver(concertInputSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      venue: initialData?.venue ?? '',
      startsAt: initialData?.startsAt ? formatDateTimeInput(initialData.startsAt) : '',
      categoryIds: initialData?.categoryIds ?? [],
      singerIds: initialData?.singerIds ?? [],
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ConcertInput) => {
      const payload = { ...values, startsAt: toIsoDateTime(values.startsAt) };
      return isUpdate && initialData
        ? concertService.updateConcert(initialData.id, payload, image ?? undefined)
        : concertService.createConcert(payload, image ?? undefined);
    },
    onSuccess: () => {
      toast.success(isUpdate ? 'Concert updated' : 'Concert created');
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField
        label="Concert title"
        htmlFor="title"
        required
        errorId="title-error"
        error={form.formState.errors.title?.message}
      >
        <Input
          id="title"
          placeholder="e.g. Summer Music Festival"
          aria-invalid={Boolean(form.formState.errors.title)}
          aria-describedby={form.formState.errors.title ? 'title-error' : undefined}
          {...form.register('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Venue"
          htmlFor="venue"
          required
          errorId="venue-error"
          error={form.formState.errors.venue?.message}
        >
          <Input
            id="venue"
            placeholder="e.g. Yangon Convention Centre"
            aria-invalid={Boolean(form.formState.errors.venue)}
            aria-describedby={form.formState.errors.venue ? 'venue-error' : undefined}
            {...form.register('venue')}
          />
        </FormField>
        <FormField
          label="Start date and time"
          htmlFor="startsAt"
          required
          errorId="startsAt-error"
          error={form.formState.errors.startsAt?.message}
        >
          <Input
            id="startsAt"
            type="datetime-local"
            step={60}
            aria-invalid={Boolean(form.formState.errors.startsAt)}
            aria-describedby={form.formState.errors.startsAt ? 'startsAt-error' : undefined}
            {...form.register('startsAt')}
          />
        </FormField>
      </div>

      <div className="grid gap-5">
        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormField
              label="Categories"
              htmlFor="categoryIds-chips"
              errorId="categoryIds-error"
              error={form.formState.errors.categoryIds?.message}
            >
              <MultiSelectChips
                id="categoryIds-chips"
                placeholder="Select categories..."
                disabled={mutation.isPending}
                emptyText="No categories available"
                options={categories.map((category) => ({ id: category.id, label: category.name }))}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="singerIds"
          render={({ field }) => (
            <FormField
              label="Performing artists"
              htmlFor="singerIds-chips"
              errorId="singerIds-error"
              error={form.formState.errors.singerIds?.message}
            >
              <MultiSelectChips
                id="singerIds-chips"
                placeholder="Select artists..."
                disabled={mutation.isPending}
                emptyText="No artists available"
                options={singers.map((singer) => ({
                  id: singer.id,
                  label: singer.name,
                  description: singer.title,
                }))}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormField>
          )}
        />
      </div>

      <FormField label="Concert image" htmlFor="concert-image">
        <ImageUpload
          id="concert-image"
          label="Choose concert image"
          value={image}
          existingImageUrl={initialData?.imageUrl}
          disabled={mutation.isPending}
          onChange={setImage}
          onError={(message) => toast.error(message)}
        />
      </FormField>

      <AdminFormActions
        entityLabel="concert"
        isPending={mutation.isPending}
        isUpdate={isUpdate}
        onCancel={() => setOpen(false)}
      />
    </form>
  );
}
