"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { createTicketSchema } from "@/lib/api/schemas";
import type { ConcertDto, CreateTicketInput, TicketDto } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { ticketService } from "@/lib/services/ticket.service";
import { useModal } from "@/components/admin/form-modal";

interface TicketFormProps {
  initialData?: TicketDto;
  concerts: ConcertDto[];
}

export function TicketForm({ initialData, concerts }: TicketFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<z.input<typeof createTicketSchema>, unknown, CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      concertId: initialData?.concertId ?? (concerts[0]?.id ?? ""),
      totalStock: initialData?.totalStock ?? 100,
      price: initialData?.price ?? 0,
      type: initialData?.type ?? "NORMAL",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateTicketInput) => {
      if (isUpdate && initialData) {
        return ticketService.updateTicket(initialData.id, values);
      }
      return ticketService.createTicket(values);
    },
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
      <p className="text-sm text-zinc-600">
        Create a concert before adding ticket inventory.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <FormField
        label="Concert"
        htmlFor="concertId"
        errorId="concertId-error"
        error={form.formState.errors.concertId?.message}
      >
        <Controller
          control={form.control}
          name="concertId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="concertId"
                aria-invalid={Boolean(form.formState.errors.concertId)}
                aria-describedby={
                  form.formState.errors.concertId ? "concertId-error" : undefined
                }
              >
                <SelectValue placeholder="Select concert" />
              </SelectTrigger>
              <SelectContent>
                {concerts.map((concert) => (
                  <SelectItem key={concert.id} value={concert.id}>
                    {concert.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField
        label="Total stock"
        htmlFor="totalStock"
        errorId="totalStock-error"
        error={form.formState.errors.totalStock?.message}
      >
        <Input
          id="totalStock"
          type="number"
          min={1}
          aria-invalid={Boolean(form.formState.errors.totalStock)}
          aria-describedby={
            form.formState.errors.totalStock ? "totalStock-error" : undefined
          }
          {...form.register("totalStock")}
        />
      </FormField>
      <FormField
        label="Price"
        htmlFor="price"
        errorId="price-error"
        error={form.formState.errors.price?.message}
      >
        <Input
          id="price"
          type="number"
          min={0}
          aria-invalid={Boolean(form.formState.errors.price)}
          aria-describedby={form.formState.errors.price ? "price-error" : undefined}
          {...form.register("price")}
        />
      </FormField>
      <FormField
        label="Type"
        htmlFor="type"
        errorId="type-error"
        error={form.formState.errors.type?.message}
      >
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="type"
                aria-invalid={Boolean(form.formState.errors.type)}
                aria-describedby={
                  form.formState.errors.type ? "type-error" : undefined
                }
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">NORMAL</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          )}
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
            : (isUpdate ? "Update ticket" : "Create ticket")
          }
        </Button>
      </div>
    </form>
  );
}
