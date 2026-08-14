import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function LoadingState({ className }: { className?: string }) {
  return (
    <p className={cn('flex min-h-[calc(100dvh-8rem)] w-full flex-col items-center justify-center text-sm text-muted-foreground', className)} role="status">
      <LoaderCircle className="mb-4 h-4 w-4 animate-spin" />
      Loading...
    </p>
  );
}
