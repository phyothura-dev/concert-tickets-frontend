import { Music } from "lucide-react";
import { ConcertCard } from "./concert-card";
import type { ConcertDto } from "@/lib/api/types";

export function ConcertList({
  concerts,
  startIndex = 0,
}: {
  concerts: ConcertDto[];
  startIndex?: number;
}) {
  if (concerts.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-violet-200 bg-white/80 p-8 text-center shadow-sm">
        <Music className="mb-3 h-8 w-8 text-violet-500" />
        <h2 className="text-lg font-semibold text-slate-950">No concerts yet</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          New concerts will appear here after an admin creates inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {concerts.map((concert, index) => (
        <ConcertCard key={concert.id} concert={concert} index={startIndex + index} />
      ))}
    </div>
  );
}
