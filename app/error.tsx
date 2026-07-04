"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-zinc-950">Unable to load page</h2>
      <p className="mt-2 text-sm text-zinc-600">{error.message}</p>
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

