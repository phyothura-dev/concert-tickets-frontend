"use client";

import { LogIn } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { toUserMessage } from "@/lib/api/errors";
import { authService } from "@/lib/services/auth.service";
import { queryKeys } from "@/lib/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; width?: number },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ width = 220 }: { width?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.authUser, user);
      toast.success("Signed in successfully");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  useEffect(() => {
    if (!env.googleClientId) return;

    const initializeButton = () => {
      if (!containerRef.current || !window.google?.accounts.id) return;

      window.google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: (response) => {
          if (!response.credential) {
            toast.error("Google did not return an identity token.");
            return;
          }
          signInMutation.mutate(response.credential);
        },
      });

      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        width: width,
      });
    };


    if (window.google?.accounts.id) {
      initializeButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeButton;
    document.head.appendChild(script);
  }, [signInMutation]);

  if (!env.googleClientId) {
    return (
      <Button disabled variant="outline">
        <LogIn className="h-4 w-4" />
        Google not configured
      </Button>
    );
  }

  return (
    <div className="min-h-10">
      <div ref={containerRef} />
    </div>
  );
}
