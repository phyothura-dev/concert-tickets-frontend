"use client";

import { GoogleSignInButton } from "./google-sign-in-button";
import { UserMenu } from "./user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AuthStatus() {
  const userQuery = useCurrentUser();

  if (userQuery.isLoading) {
    return <div className="h-10 w-32 animate-pulse rounded-md bg-zinc-100" />;
  }

  if (!userQuery.data) {
    return <GoogleSignInButton />;
  }

  return <UserMenu user={userQuery.data} />;
}

