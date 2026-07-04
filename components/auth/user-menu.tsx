"use client";

import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toUserMessage } from "@/lib/api/errors";
import type { UserDto } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { authService } from "@/lib/services/auth.service";

export function UserMenu({ user }: { user: UserDto }) {
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.authUser, null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.authUser });
      toast.success("Signed out");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="max-w-52 justify-start">
          <UserRound className="h-4 w-4 shrink-0" />
          <span className="truncate">{user.name ?? user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.role === "ADMIN" ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            logoutMutation.mutate();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

