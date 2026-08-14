import { Button } from "@/components/ui/button";

export function AdminFormActions({
  isPending,
  isUpdate,
  entityLabel,
  onCancel,
}: {
  isPending: boolean;
  isUpdate: boolean;
  entityLabel: string;
  onCancel: () => void;
}) {
  const verb = isUpdate ? "Update" : "Create";

  return (
    <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-border bg-surface pt-4 sm:flex-row sm:justify-end">
      <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={onCancel} disabled={isPending}>
        Cancel
      </Button>
      <Button className="w-full sm:w-auto" type="submit" disabled={isPending}>
        {isPending ? `${isUpdate ? "Updating" : "Creating"}...` : `${verb} ${entityLabel}`}
      </Button>
    </div>
  );
}
