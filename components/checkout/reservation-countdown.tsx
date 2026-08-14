"use client";

import { Clock } from "lucide-react";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { formatCountdown } from "@/lib/utils/format";

function getRemainingSeconds(expiresAt: Date) {
  return Math.max(
    0,
    Math.ceil(differenceInMilliseconds(expiresAt, new Date()) / 1000),
  );
}

export function ReservationCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire: () => void;
}) {
  const expirationDate = useMemo(() => parseISO(expiresAt), [expiresAt]);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(expirationDate),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = getRemainingSeconds(expirationDate);
      setRemainingSeconds(next);
      if (next <= 0) {
        window.clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expirationDate, onExpire]);

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
