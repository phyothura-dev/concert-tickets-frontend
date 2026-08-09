"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toUserMessage } from "@/lib/api/errors";
import { loginSchema, registerSchema } from "@/lib/api/schemas";
import type { LoginInput } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { authService } from "@/lib/services/auth.service";

export function AuthCredentialsForm({
  mode,
  onSuccess,
}: {
  mode: "signin" | "signup";
  onSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<LoginInput>({
    resolver: zodResolver(mode === "signin" ? loginSchema : registerSchema),
    defaultValues: { email: "", password: "" },
  });
  const mutation = useMutation({
    mutationFn: (credentials: LoginInput) =>
      mode === "signin"
        ? authService.login(credentials)
        : authService.register(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.authUser, user);
      toast.success(mode === "signin" ? "Signed in successfully" : "Registered successfully");
      onSuccess();
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <FormField label="Email address" htmlFor="auth-email" errorId="auth-email-error" error={emailError}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            disabled={mutation.isPending}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "auth-email-error" : undefined}
            className="h-12 rounded-xl bg-muted/50 pl-10"
            {...form.register("email")}
          />
        </div>
      </FormField>

      <FormField label="Password" htmlFor="auth-password" errorId="auth-password-error" error={passwordError}>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="••••••••"
            disabled={mutation.isPending}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "auth-password-error" : undefined}
            className="h-12 rounded-xl bg-muted/50 pl-10 pr-10"
            {...form.register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      <Button type="submit" size="lg" disabled={mutation.isPending} className="mt-1 h-12 w-full rounded-xl">
        {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {mode === "signin" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
