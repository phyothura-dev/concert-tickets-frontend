"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isAdmin } = useAdminGuard();
  const { openSignIn } = useAuthModal();

  if (isLoading) {
    return <LoadingState className="min-h-screen" />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Please sign in with an admin account to manage inventory.
          </p>
          <div className="flex gap-2">
            <Button onClick={openSignIn}>
              Sign In
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            Admin access required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/">Back to concerts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return children;
}
