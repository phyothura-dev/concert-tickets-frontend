"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { useModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toUserMessage } from "@/lib/api/errors";
import { ticketInputSchema } from "@/lib/api/schemas";
import type { ConcertDto, TicketDto, TicketInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { ticketService } from "@/lib/services/ticket.service";
import { formatDate } from "@/lib/utils/format";

interface TicketFormProps {
  initialData?: TicketDto;
  concerts: ConcertDto[];
}

export function TicketForm({ initialData, concerts }: TicketFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = Boolean(initialData);
  const form = useForm<z.input<typeof ticketInputSchema>, unknown, TicketInput>({
    resolver: zodResolver(ticketInputSchema),
    defaultValues: {
      concertId: initialData?.concertId ?? "",
      totalStock: initialData?.totalStock ?? 100,
      price: initialData?.price ?? 0,
      type: initialData?.type ?? "NORMAL",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: TicketInput) =>
      isUpdate && initialData
        ? ticketService.updateTicket(initialData.id, values)
        : ticketService.createTicket(values),
    onSuccess: () => {
      toast.success(isUpdate ? "Ticket inventory updated" : "Ticket inventory created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  if (concerts.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
        Create a concert before adding ticket inventory.{" "}
        <Link href="/admin/concerts" className="font-medium text-brand hover:underline" onClick={() => setOpen(false)}>Go to Concerts</Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Concert" htmlFor="concertId" required errorId="concertId-error" error={form.formState.errors.concertId?.message}>
        <Controller
          control={form.control}
          name="concertId"
          render={({ field }) => (
            <SearchableSelect
              id="concertId"
              options={concerts.map((concert) => ({
                value: concert.id,
                label: `${concert.title} · ${concert.venue} · ${formatDate(concert.startsAt)}`,
              }))}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Search concerts by title, venue, or date"
              aria-invalid={Boolean(form.formState.errors.concertId)}
              aria-describedby={form.formState.errors.concertId ? "concertId-error" : undefined}
            />
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Ticket type" htmlFor="type" required errorId="type-error" error={form.formState.errors.type?.message}>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" aria-invalid={Boolean(form.formState.errors.type)} aria-describedby={form.formState.errors.type ? "type-error" : undefined}>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="Total seats" htmlFor="totalStock" required errorId="totalStock-error" error={form.formState.errors.totalStock?.message}>
          <Input id="totalStock" type="number" min={1} max={500} step={1} placeholder="100" aria-invalid={Boolean(form.formState.errors.totalStock)} aria-describedby={form.formState.errors.totalStock ? "totalStock-error" : undefined} {...form.register("totalStock")} />
        </FormField>
      </div>

      <FormField label="Price (MMK)" htmlFor="price" required errorId="price-error" error={form.formState.errors.price?.message}>
        <Input id="price" type="number" min={0} step={1} placeholder="50000" aria-invalid={Boolean(form.formState.errors.price)} aria-describedby={form.formState.errors.price ? "price-error" : undefined} {...form.register("price")} />
      </FormField>

      <AdminFormActions entityLabel="ticket" isPending={mutation.isPending} isUpdate={isUpdate} onCancel={() => setOpen(false)} />
    </form>
  );
}
