import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h1 className="text-xl font-semibold text-zinc-950">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-600">
        The page or concert you are looking for does not exist.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Back to concerts</Link>
      </Button>
    </div>
  );
}

