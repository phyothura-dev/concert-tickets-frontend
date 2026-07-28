import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { userSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, UserDto, CreateUserInput } from "@/lib/api/types";

const userListEnvelope = envelopeSchema(z.array(userSchema));
const userEnvelope = envelopeSchema(userSchema);

export const userService = {
  async listUsers() {
    const response = await apiFetch<ApiEnvelope<UserDto[]>>("/users", {
      cache: "no-store",
    });
    return userListEnvelope.parse(response).data;
  },

  async createUser(input: CreateUserInput) {
    const response = await apiFetch<ApiEnvelope<UserDto>>("/users", {
      method: "POST",
      body: input,
    });
    return userEnvelope.parse(response).data;
  },

  async updateUser(id: string, input: CreateUserInput) {
    const response = await apiFetch<ApiEnvelope<UserDto>>(`/users/${id}`, {
      method: "PUT",
      body: input,
    });
    return userEnvelope.parse(response).data;
  },

  async deleteUser(id: string) {
    const response = await apiFetch<ApiEnvelope<void>>(`/users/${id}`, {
      method: "DELETE",
    });
    return response.data;
  }
};
