'use client';

import Link from 'next/link';
import { Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { useAdminGuard } from '@/hooks/use-admin-guard';
import { useAuthModal } from '@/providers/auth-modal-provider';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isAdmin } = useAdminGuard();
  const { openSignIn } = useAuthModal();

  if (isLoading) {
    return <LoadingState className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-surface-alt p-4">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Sign in required</CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              Please sign in with an admin account to manage inventory and events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full" onClick={openSignIn}>
              Sign In
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to site</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-surface-alt p-4">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Admin access required</CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              You do not have administrative permissions to view or manage this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to concerts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
