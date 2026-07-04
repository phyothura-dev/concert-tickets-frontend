"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toUserMessage } from "@/lib/api/errors";
import { createConcertSchema } from "@/lib/api/schemas";
import type { CreateConcertInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { adminService } from "@/lib/services/admin.service";

export function CreateConcertForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<CreateConcertInput>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: {
      title: "",
      venue: "",
      startsAt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: adminService.createConcert,
    onSuccess: () => {
      toast.success("Concert created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      router.push("/admin");
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create concert</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate({
              ...values,
              startsAt: new Date(values.startsAt).toISOString(),
            }),
          )}
        >
          <FormField
            label="Title"
            htmlFor="title"
            errorId="title-error"
            error={form.formState.errors.title?.message}
          >
            <Input
              id="title"
              aria-invalid={Boolean(form.formState.errors.title)}
              aria-describedby={form.formState.errors.title ? "title-error" : undefined}
              {...form.register("title")}
            />
          </FormField>
          <FormField
            label="Venue"
            htmlFor="venue"
            errorId="venue-error"
            error={form.formState.errors.venue?.message}
          >
            <Input
              id="venue"
              aria-invalid={Boolean(form.formState.errors.venue)}
              aria-describedby={form.formState.errors.venue ? "venue-error" : undefined}
              {...form.register("venue")}
            />
          </FormField>
          <FormField
            label="Starts at"
            htmlFor="startsAt"
            errorId="startsAt-error"
            error={form.formState.errors.startsAt?.message}
          >
            <Input
              id="startsAt"
              type="datetime-local"
              aria-invalid={Boolean(form.formState.errors.startsAt)}
              aria-describedby={
                form.formState.errors.startsAt ? "startsAt-error" : undefined
              }
              {...form.register("startsAt")}
            />
          </FormField>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create concert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
