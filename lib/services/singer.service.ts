import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { singerSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, SingerDto, CreateSingerInput } from "@/lib/api/types";

const singerListEnvelope = envelopeSchema(z.array(singerSchema));
const singerEnvelope = envelopeSchema(singerSchema);

export const singerService = {
  async listSingers() {
    const response = await apiFetch<ApiEnvelope<SingerDto[]>>("/singers", {
      cache: "no-store",
    });
    return singerListEnvelope.parse(response).data;
  },

  async createSinger(input: CreateSingerInput) {
    const response = await apiFetch<ApiEnvelope<SingerDto>>("/singers", {
      method: "POST",
      body: input,
    });
    return singerEnvelope.parse(response).data;
  },

  async updateSinger(id: string, input: CreateSingerInput) {
    const response = await apiFetch<ApiEnvelope<SingerDto>>(`/singers/${id}`, {
      method: "PUT",
      body: input,
    });
    return singerEnvelope.parse(response).data;
  },

  async deleteSinger(id: string) {
    const response = await apiFetch<ApiEnvelope<void>>(`/singers/${id}`, {
      method: "DELETE",
    });
    return response.data;
  }
};
