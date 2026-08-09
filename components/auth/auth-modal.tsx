"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Music2, X } from "lucide-react";
import Image from "next/image";
import { AuthCredentialsForm } from "@/components/auth/auth-credentials-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function AuthModal() {
  const { isOpen, view, openSignIn, openSignUp, closeModal } = useAuthModal();

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-white">
          <div className="grid h-full w-full lg:grid-cols-[1.25fr_1fr]">
            <div className="relative hidden flex-col justify-end overflow-hidden bg-slate-950 p-16 text-white lg:flex">
              <Image
                src="/demo-preview.jpg"
                alt="Concert crowd"
                fill
                priority={false}
                sizes="(min-width: 1024px) 56vw, 0vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="relative z-10 max-w-xl space-y-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                  <Music2 className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold leading-tight tracking-tight">Your next great show starts here.</h2>
                  <p className="text-base font-light leading-relaxed text-white/75">
                    Join music fans who trust Music Concert for authentic tickets, real-time availability, and seamless booking.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center overflow-y-auto bg-surface-alt p-6 sm:p-12">
              <DialogPrimitive.Close
                aria-label="Close"
                className="absolute right-5 top-5 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>

              <div className="w-full max-w-96 space-y-6">
                <div className="mb-2 flex items-center gap-3 lg:hidden">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                    <Music2 className="h-4 w-4" />
                  </span>
                  <span className="text-lg font-bold tracking-tight text-foreground">Music Concert</span>
                </div>

                <div>
                  <DialogPrimitive.Title className="text-3xl font-bold tracking-tight text-foreground">
                    {view === "signin" ? "Welcome back" : "Create account"}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-1.5 text-sm font-light text-muted-foreground">
                    {view === "signin" ? "Sign in to access your tickets" : "Join thousands of music fans"}
                  </DialogPrimitive.Description>
                </div>

                <GoogleSignInButton width={384} onSuccess={closeModal} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface-alt px-3 font-light tracking-wider text-muted-foreground">or continue with email</span>
                  </div>
                </div>

                <AuthCredentialsForm key={view} mode={view} onSuccess={closeModal} />

                <p className="text-center text-sm text-muted-foreground">
                  {view === "signin" ? "Don’t have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={view === "signin" ? openSignUp : openSignIn}
                    className="font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {view === "signin" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
