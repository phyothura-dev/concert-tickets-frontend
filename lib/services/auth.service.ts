import { apiFetch } from "@/lib/api/client";
import { authUserResponseSchema, envelopeSchema, signOutResultSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, AuthUserResponse, SignOutResult } from "@/lib/api/types";

const authEnvelope = envelopeSchema(authUserResponseSchema);
const signOutEnvelope = envelopeSchema(signOutResultSchema);

export const authService = {
  async signInWithGoogle(idToken: string) {
    const response = await apiFetch<ApiEnvelope<AuthUserResponse>>("/auth/google", {
      method: "POST",
      body: { idToken },
    });
    return authEnvelope.parse(response).data.user;
  },

  async getCurrentUser() {
    const response = await apiFetch<ApiEnvelope<AuthUserResponse>>("/auth/me", {
      cache: "no-store",
    });
    return authEnvelope.parse(response).data.user;
  },

  async logout() {
    const response = await apiFetch<ApiEnvelope<SignOutResult>>("/auth/logout", {
      method: "POST",
    });
    return signOutEnvelope.parse(response).data;
  },
};

