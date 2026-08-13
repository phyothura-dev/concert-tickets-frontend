'use client';

import type { ReactNode } from 'react';
import { CircleAlert, LoaderCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

type StateSize = 'compact' | 'default';

export function LoadingState({ label = 'Loading...', size = 'default', className }: { label?: string; size?: StateSize; className?: string }) {
  if (size === 'compact') {
    return (
      <span aria-label={label} aria-live="polite" className={cn('inline-flex h-10 items-center justify-center text-brand', className)} role="status">
        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
      </span>
    );
  }

  return (
    <div aria-live="polite" className={cn('flex min-h-40 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-sm', className)} role="status">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <LoaderCircle aria-hidden="true" className="h-6 w-6 animate-spin" />
      </span>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  retryLabel = 'Try again',
  action,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-live="assertive"
      className={cn('flex min-h-40 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-sm', className)}
      role="alert"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
        <CircleAlert aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {onRetry || action ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {onRetry ? (
            <Button onClick={onRetry} type="button" variant="outline">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {retryLabel}
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
