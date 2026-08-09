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
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? `${isUpdate ? "Updating" : "Creating"}...` : `${verb} ${entityLabel}`}
      </Button>
    </div>
  );
}
