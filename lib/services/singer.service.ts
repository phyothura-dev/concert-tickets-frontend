import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { singerSchema, deletedResultSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, SingerDto, SingerInput, DeletedResult } from "@/lib/api/types";

const singerListEnvelope = envelopeSchema(z.array(singerSchema));
const singerEnvelope = envelopeSchema(singerSchema);
const deletedEnvelope = envelopeSchema(deletedResultSchema);

export const singerService = {
  async listSingers() {
    const response = await apiFetch<ApiEnvelope<SingerDto[]>>("/singers", {
      cache: "no-store",
    });
    return singerListEnvelope.parse(response).data;
  },

  async createSinger(input: SingerInput) {
    const response = await apiFetch<ApiEnvelope<SingerDto>>("/singers", {
      method: "POST",
      body: input,
    });
    return singerEnvelope.parse(response).data;
  },

  async updateSinger(id: string, input: SingerInput) {
    const response = await apiFetch<ApiEnvelope<SingerDto>>(`/singers/${id}`, {
      method: "PATCH",
      body: input,
    });
    return singerEnvelope.parse(response).data;
  },

  async deleteSinger(id: string) {
    const response = await apiFetch<ApiEnvelope<DeletedResult>>(`/singers/${id}`, {
      method: "DELETE",
    });
    return deletedEnvelope.parse(response).data;
  }
};
