"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { AuthModalProvider } from "./auth-modal-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthModalProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AuthModalProvider>
    </QueryProvider>
  );
}

