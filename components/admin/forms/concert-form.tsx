'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { toUserMessage } from '@/lib/api/errors';
import { createConcertSchema } from '@/lib/api/schemas';
import type { ConcertDto, CreateConcertInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { concertService } from '@/lib/services/concert.service';
import { useModal } from '@/components/admin/form-modal';
import { AdminFormActions } from '@/components/admin/admin-form-actions';
import { formatDateTimeInput, toIsoDateTime } from '@/lib/utils/format';

interface ConcertFormProps {
  initialData?: ConcertDto;
}

export function ConcertForm({ initialData }: ConcertFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<CreateConcertInput>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      venue: initialData?.venue ?? '',
      startsAt: initialData?.startsAt ? formatDateTimeInput(initialData.startsAt) : '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateConcertInput) => {
      const formattedValues = {
        ...values,
        startsAt: toIsoDateTime(values.startsAt),
      };

      if (isUpdate && initialData) {
        return concertService.updateConcert(initialData.id, formattedValues);
      }
      return concertService.createConcert(formattedValues);
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
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Title" htmlFor="title" errorId="title-error" error={form.formState.errors.title?.message}>
        <Input id="title" aria-invalid={Boolean(form.formState.errors.title)} aria-describedby={form.formState.errors.title ? 'title-error' : undefined} {...form.register('title')} />
      </FormField>
      <FormField label="Venue" htmlFor="venue" errorId="venue-error" error={form.formState.errors.venue?.message}>
        <Input id="venue" aria-invalid={Boolean(form.formState.errors.venue)} aria-describedby={form.formState.errors.venue ? 'venue-error' : undefined} {...form.register('venue')} />
      </FormField>
      <FormField label="Starts at" htmlFor="startsAt" errorId="startsAt-error" error={form.formState.errors.startsAt?.message}>
        <Input
          id="startsAt"
          type="datetime-local"
          aria-invalid={Boolean(form.formState.errors.startsAt)}
          aria-describedby={form.formState.errors.startsAt ? 'startsAt-error' : undefined}
          {...form.register('startsAt')}
        />
      </FormField>
      <AdminFormActions entityLabel="concert" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
