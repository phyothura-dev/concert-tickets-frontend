"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { ConcertDto, CreateTicketInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { adminService } from "@/lib/services/admin.service";

export function CreateTicketForm({ concerts }: { concerts: ConcertDto[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.input<typeof createTicketSchema>, unknown, CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      concertId: concerts[0]?.id ?? "",
      totalStock: 100,
      price: 0,
      type: "NORMAL",
    },
  });

  const mutation = useMutation({
    mutationFn: adminService.createTicket,
    onSuccess: () => {
      toast.success("Ticket inventory created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      router.push("/admin");
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create ticket inventory</CardTitle>
      </CardHeader>
      <CardContent>
        {concerts.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Create a concert before adding ticket inventory.
          </p>
        ) : (
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create ticket"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
