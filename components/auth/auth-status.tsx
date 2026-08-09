"use client";

import { UserMenu } from "./user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const userQuery = useCurrentUser();
  const { openSignIn } = useAuthModal();

  if (userQuery.isLoading) {
    return <div className="h-10 w-32 animate-pulse rounded-md bg-zinc-100" />;
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

