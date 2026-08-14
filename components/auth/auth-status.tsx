"use client";

import { LoaderCircle } from "lucide-react";
import { UserMenu } from "./user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const userQuery = useCurrentUser();
  const { openSignIn } = useAuthModal();

  if (userQuery.isLoading) {
    return <LoaderCircle aria-label="Loading" className="h-4 w-4 animate-spin text-muted-foreground" role="status" />;
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
