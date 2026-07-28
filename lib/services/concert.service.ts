import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { concertSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, ConcertDto, CreateConcertInput } from "@/lib/api/types";

const concertListEnvelope = envelopeSchema(z.array(concertSchema));
const concertEnvelope = envelopeSchema(concertSchema);

export const concertService = {
  async listConcerts() {
    const response = await apiFetch<ApiEnvelope<ConcertDto[]>>("/concerts", {
      cache: "no-store",
    });
    return concertListEnvelope.parse(response).data;
  },

  async createConcert(input: CreateConcertInput) {
    const response = await apiFetch<ApiEnvelope<ConcertDto>>("/concerts", {
      method: "POST",
      body: input,
    });
    return concertEnvelope.parse(response).data;
  },
  async updateConcert(id: string, input: CreateConcertInput) {
    const response = await apiFetch<ApiEnvelope<ConcertDto>>(`/concerts/${id}`, {
      method: "PUT",
      body: input,
    });
    return concertEnvelope.parse(response).data;
  },

  async deleteConcert(id: string) {
    const response = await apiFetch<ApiEnvelope<void>>(`/concerts/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },
};

