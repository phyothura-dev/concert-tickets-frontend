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
        className="h-9 rounded-full bg-violet-600 px-5 text-white hover:bg-violet-700 font-medium text-sm transition-all cursor-pointer"
      >
        Sign In
      </Button>
    );
  }

  return <UserMenu user={userQuery.data} />;
}


