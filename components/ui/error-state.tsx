'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function ErrorState({ message, onRetry, className }: { message: string; onRetry: () => void; className?: string }) {
  return (
    <div className={cn('flex min-h-[calc(100dvh-8rem)] w-full flex-col items-center justify-center text-center', className)} role="alert">
      <p className="text-sm text-danger">{message}</p>
      <Button className="mt-4" onClick={onRetry} variant="outline">
        Try again
      </Button>
    </div>
  );
}
