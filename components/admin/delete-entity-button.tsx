"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toUserMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/keys";
import { categoryService } from "@/lib/services/category.service";
import { concertService } from "@/lib/services/concert.service";
import { singerService } from "@/lib/services/singer.service";
import { ticketService } from "@/lib/services/ticket.service";

type DeletableEntity = "concert" | "ticket" | "category" | "singer";

const descriptions: Record<DeletableEntity, string> = {
  concert: "This also removes its ticket inventory and reservations. This cannot be undone.",
  ticket: "Ticket inventory cannot be deleted while pending reservations exist.",
  category: "Concerts and singers using this category will become uncategorized.",
  singer: "This removes the singer from associated concerts.",
};

function deleteEntity(entity: DeletableEntity, id: string) {
  switch (entity) {
    case "concert":
      return concertService.deleteConcert(id);
    case "ticket":
      return ticketService.deleteTicket(id);
    case "category":
      return categoryService.deleteCategory(id);
    case "singer":
      return singerService.deleteSinger(id);
  }
}

export function DeleteEntityButton({
  entity,
  id,
  label,
}: {
  entity: DeletableEntity;
  id: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteEntity(entity, id),
    onSuccess: () => {
      const keys =
        entity === "concert" || entity === "ticket"
          ? [queryKeys.concerts, queryKeys.tickets]
          : entity === "category"
            ? [queryKeys.categories, queryKeys.concerts, queryKeys.singers]
            : [queryKeys.singers, queryKeys.concerts];
      keys.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
      toast.success(`${label} deleted`);
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label={`Delete ${label}`}
        className="transition-colors hover:text-danger"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {label}?</DialogTitle>
          <DialogDescription>{descriptions[entity]}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
