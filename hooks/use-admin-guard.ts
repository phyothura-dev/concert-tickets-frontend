"use client";

import { useCurrentUser } from "./use-current-user";

export function useAdminGuard() {
  const userQuery = useCurrentUser();

  return {
    ...userQuery,
    isAdmin: userQuery.data?.role === "ADMIN",
  };
}

