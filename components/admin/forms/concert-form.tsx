'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AdminFormActions } from '@/components/admin/admin-form-actions';
import { useModal } from '@/components/admin/form-modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
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

type MultiSelectOption = {
  id: string;
  label: string;
  description?: string;
};

function MultiSelectField({
  label,
  name,
  options,
  selectedIds,
  onChange,
  error,
  disabled,
}: {
  label: string;
  name: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
  disabled: boolean;
}) {
  const selectId = `${name}-select`;
  const errorId = `${name}-error`;
  const selectedOptions = options.filter((option) => selectedIds.includes(option.id));
  const availableOptions = options.filter((option) => !selectedIds.includes(option.id));

  function addOption(optionId: string) {
    if (!selectedIds.includes(optionId)) {
      onChange([...selectedIds, optionId]);
    }
  }

  return (
    <FormField label={label} htmlFor={selectId} errorId={errorId} error={error}>
      <Select value="" onValueChange={addOption} disabled={disabled || availableOptions.length === 0}>
        <SelectTrigger id={selectId} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
          <span>{selectedIds.length} selected</span>
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.description ? `${option.label} — ${option.description}` : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOptions.length > 0 ? (
        <div className="flex min-h-10 flex-wrap gap-2 rounded-md border border-dashed bg-muted/30 p-2" aria-label={`Selected ${label.toLowerCase()}`}>
          {selectedOptions.map((option) => (
            <span key={option.id} className="inline-flex min-h-8 max-w-full items-center gap-1 rounded-md border bg-surface pl-3 pr-1 text-sm">
              <span className="truncate">{option.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                disabled={disabled}
                aria-label={`Remove ${option.label}`}
                onClick={() => onChange(selectedIds.filter((id) => id !== option.id))}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </span>
          ))}
        </div>
      ) : null}
    </FormField>
  );
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
      return isUpdate && initialData ? concertService.updateConcert(initialData.id, payload, image ?? undefined) : concertService.createConcert(payload, image ?? undefined);
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
      <FormField label="Concert title" htmlFor="title" required errorId="title-error" error={form.formState.errors.title?.message}>
        <Input
          id="title"
          placeholder="e.g. Summer Music Festival"
          aria-invalid={Boolean(form.formState.errors.title)}
          aria-describedby={form.formState.errors.title ? 'title-error' : undefined}
          {...form.register('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Venue" htmlFor="venue" required errorId="venue-error" error={form.formState.errors.venue?.message}>
          <Input
            id="venue"
            placeholder="e.g. Yangon Convention Centre"
            aria-invalid={Boolean(form.formState.errors.venue)}
            aria-describedby={form.formState.errors.venue ? 'venue-error' : undefined}
            {...form.register('venue')}
          />
        </FormField>
        <FormField label="Start date and time" htmlFor="startsAt" required errorId="startsAt-error" error={form.formState.errors.startsAt?.message}>
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

      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <MultiSelectField
              disabled={mutation.isPending}
              error={form.formState.errors.categoryIds?.message}
              label="Categories"
              name="categoryIds"
              onChange={field.onChange}
              options={categories.map((category) => ({ id: category.id, label: category.name }))}
              selectedIds={field.value ?? []}
            />
          )}
        />

        <Controller
          control={form.control}
          name="singerIds"
          render={({ field }) => (
            <MultiSelectField
              disabled={mutation.isPending}
              error={form.formState.errors.singerIds?.message}
              label="Performing artists"
              name="singerIds"
              onChange={field.onChange}
              options={singers.map((singer) => ({ id: singer.id, label: singer.name, description: singer.title }))}
              selectedIds={field.value ?? []}
            />
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
      <AdminFormActions entityLabel="concert" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
