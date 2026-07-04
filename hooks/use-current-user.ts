"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/keys";
import { authService } from "@/lib/services/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.authUser,
    queryFn: authService.getCurrentUser,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 1;
    },
  });
}

