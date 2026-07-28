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
import { createSingerSchema } from "@/lib/api/schemas";
import type { SingerDto, CreateSingerInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { singerService } from "@/lib/services/singer.service";
import { useModal } from "@/components/admin/form-modal";

interface SingerFormProps {
  initialData?: SingerDto;
}

export function SingerForm({ initialData }: SingerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOpen } = useModal();
  const isUpdate = !!initialData;

  const form = useForm<CreateSingerInput>({
    resolver: zodResolver(createSingerSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      title: initialData?.title ?? "",
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
      toast.success(isUpdate ? "Singer updated" : "Singer created");
      void queryClient.invalidateQueries({ queryKey: queryKeys.singers });
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
            : (isUpdate ? "Update singer" : "Create singer")
          }
        </Button>
      </div>
    </form>
  );
}
