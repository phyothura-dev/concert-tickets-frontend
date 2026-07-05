"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Music2, X, Loader2 } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GoogleSignInButton } from "./google-sign-in-button";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { authService } from "@/lib/services/auth.service";
import { loginSchema, registerSchema } from "@/lib/api/schemas";
import { queryKeys } from "@/lib/query/keys";
import { toUserMessage } from "@/lib/api/errors";
import type { LoginInput, RegisterInput } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

export function AuthModal() {
  const { isOpen, view, openSignIn, openSignUp, closeModal } = useAuthModal();
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  // Sign In Form
  const signInForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Sign Up Form
  const signUpForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  // Reset state when modal closes or view changes
  const resetForms = useCallback(() => {
    signInForm.reset();
    signUpForm.reset();
    setShowPassword(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) {
      resetForms();
    }
  }, [isOpen, resetForms]);

  // Mutations
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.authUser, user);
      toast.success("Signed in successfully");
      closeModal();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.authUser, user);
      toast.success("Registered successfully");
      closeModal();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });

  const onSignInSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  const onSignUpSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex w-screen h-screen bg-white overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        >
          <div className="grid w-full h-full lg:grid-cols-[1.25fr_1fr]">

            {/* Left Pane - Cinematic background (Desktop only) */}
            <div className="relative hidden lg:flex flex-col justify-end p-16 text-white overflow-hidden bg-slate-950">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/demo-preview.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="relative z-10 space-y-5 max-w-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/30">
                  <Music2 className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight leading-tight">
                    Your next great show starts here.
                  </h2>
                  <p className="text-white/75 text-base leading-relaxed font-light">
                    Join 980,000+ fans who trust Music Concert for authentic tickets, real-time availability, and seamless booking.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Pane - Form */}
            <div className="relative flex flex-col justify-center items-center p-6 sm:p-12 bg-[#faf9fe] overflow-y-auto">

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all z-10 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-full max-w-[384px] space-y-6">

                {/* Logo - mobile only */}
                <div className="lg:hidden flex items-center gap-3 mb-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                    <Music2 className="h-4 w-4" />
                  </span>
                  <span className="text-lg font-bold tracking-tight text-slate-950">Music Concert</span>
                </div>

                {/* Heading */}
                <div>
                  <DialogPrimitive.Title className="text-3xl font-bold tracking-tight text-slate-950">
                    {view === "signin" ? "Welcome back" : "Create account"}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-slate-500 mt-1.5 font-light">
                    {view === "signin"
                      ? "Sign in to access your tickets"
                      : "Join thousands of music fans"}
                  </DialogPrimitive.Description>
                </div>

                {/* Google Button */}
                <div className="w-full">
                  <GoogleSignInButton width={384} />
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#faf9fe] px-3 text-slate-400 font-light tracking-wider">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Sign In Form */}
                {view === "signin" && (
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-800">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          disabled={isPending}
                          placeholder="you@email.com"
                          autoComplete="email"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          {...signInForm.register("email")}
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-xs text-red-500">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-800">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          disabled={isPending}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          {...signInForm.register("password")}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-xs text-red-500">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Sign In
                    </button>
                  </form>
                )}

                {/* Sign Up Form */}
                {view === "signup" && (
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-800">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          disabled={isPending}
                          placeholder="you@email.com"
                          autoComplete="email"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          {...signUpForm.register("email")}
                        />
                      </div>
                      {signUpForm.formState.errors.email && (
                        <p className="text-xs text-red-500">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-800">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          disabled={isPending}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          {...signUpForm.register("password")}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-xs text-red-500">{signUpForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      {registerMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Create Account
                    </button>
                  </form>
                )}

                {/* View Switcher */}
                <p className="text-center text-sm text-slate-500">
                  {view === "signin" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={openSignUp}
                        className="text-violet-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 focus:outline-none"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={openSignIn}
                        className="text-violet-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 focus:outline-none"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>

              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
