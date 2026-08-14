import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { concertSchema, deletedResultSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, ConcertDto, ConcertInput, DeletedResult } from "@/lib/api/types";

const concertListEnvelope = envelopeSchema(z.array(concertSchema));
const concertEnvelope = envelopeSchema(concertSchema);
const deletedEnvelope = envelopeSchema(deletedResultSchema);

export type ConcertFilters = {
  search?: string;
  venue?: string;
  categoryId?: string;
};

export const concertService = {
  async listConcerts(filters: ConcertFilters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.venue) params.set("venue", filters.venue);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    const query = params.toString();
    const response = await apiFetch<ApiEnvelope<ConcertDto[]>>(`/concerts${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });
    return concertListEnvelope.parse(response).data;
  },

  async createConcert(input: ConcertInput) {
    const response = await apiFetch<ApiEnvelope<ConcertDto>>("/concerts", {
      method: "POST",
      body: input,
    });
    return concertEnvelope.parse(response).data;
  },
  async getConcert(id: string) {
    const response = await apiFetch<ApiEnvelope<ConcertDto>>(`/concerts/${id}`, {
      cache: "no-store",
    });
    return concertEnvelope.parse(response).data;
  },

  async updateConcert(id: string, input: ConcertInput) {
    const response = await apiFetch<ApiEnvelope<ConcertDto>>(`/concerts/${id}`, {
      method: "PATCH",
      body: input,
    });
    return concertEnvelope.parse(response).data;
  },

  async deleteConcert(id: string) {
    const response = await apiFetch<ApiEnvelope<DeletedResult>>(`/concerts/${id}`, {
      method: "DELETE",
    });
    return deletedEnvelope.parse(response).data;
  },
};
