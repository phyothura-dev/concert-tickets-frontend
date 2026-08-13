'use client';

import { ErrorState } from '@/components/ui/async-state';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState className="mx-auto w-full max-w-6xl" description={error.message || 'The page could not be loaded.'} onRetry={reset} title="Unable to load page" />;
}
