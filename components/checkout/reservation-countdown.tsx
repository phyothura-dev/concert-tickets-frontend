"use client";

import { Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatCountdown } from "@/lib/utils/format";

export function ReservationCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire: () => void;
}) {
  const expiresAtMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000)),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setRemainingSeconds(next);
      if (next <= 0) {
        window.clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAtMs, onExpire]);

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      role="status"
      className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
    >
      <Clock className="h-4 w-4" />
      Hold expires in {formatCountdown(remainingSeconds)}
    </div>
  );
}
