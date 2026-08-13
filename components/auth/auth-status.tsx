"use client";

import { UserMenu } from "./user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/async-state";

export function AuthStatus() {
  const userQuery = useCurrentUser();
  const { openSignIn } = useAuthModal();

  if (userQuery.isLoading) {
    return <LoadingState className="w-10" label="Loading account" size="compact" />;
  }

  if (!userQuery.data) {
    return (
      <Button 
        onClick={openSignIn}
        className="h-9 rounded-full px-5"
      >
        Sign In
      </Button>
    );
  }

  return <UserMenu user={userQuery.data} />;
}
