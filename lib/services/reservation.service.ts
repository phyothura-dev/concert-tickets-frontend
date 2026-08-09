import { apiFetch } from "@/lib/api/client";
import {
  directPurchaseResultSchema,
  envelopeSchema,
  legacyPurchaseResultSchema,
  reservationCreatedSchema,
  reservationHistorySchema,
} from "@/lib/api/schemas";
import type {
  ApiEnvelope,
  DirectPurchaseInput,
  DirectPurchaseResult,
  LegacyPurchaseResult,
  PurchaseInput,
  ReservationCreated,
  ReservationHistory,
  ReserveInput,
} from "@/lib/api/types";

const reservationEnvelope = envelopeSchema(reservationCreatedSchema);
const purchaseEnvelope = envelopeSchema(legacyPurchaseResultSchema);
const directPurchaseEnvelope = envelopeSchema(directPurchaseResultSchema);
const reservationHistoryEnvelope = envelopeSchema(reservationHistorySchema.array());

export const reservationService = {
  async listHistory() {
    const response = await apiFetch<ApiEnvelope<ReservationHistory[]>>(
      "/reservations/me",
      { cache: "no-store" },
    );
    return reservationHistoryEnvelope.parse(response).data;
  },

  async reserve(input: ReserveInput) {
    const response = await apiFetch<ApiEnvelope<ReservationCreated>>("/reserve", {
      method: "POST",
      body: input,
    });
    return reservationEnvelope.parse(response).data;
  },

  async purchase(input: PurchaseInput) {
    const response = await apiFetch<ApiEnvelope<LegacyPurchaseResult>>("/purchase", {
      method: "POST",
      body: input,
    });
    return purchaseEnvelope.parse(response).data;
  },

  async purchasePessimistic(input: DirectPurchaseInput) {
    const response = await apiFetch<ApiEnvelope<DirectPurchaseResult>>(
      "/purchase/pessimistic",
      {
        method: "POST",
        body: input,
      },
    );
    return directPurchaseEnvelope.parse(response).data;
  },
};
