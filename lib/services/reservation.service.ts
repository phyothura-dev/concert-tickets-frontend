import { apiFetch } from "@/lib/api/client";
import {
  directPurchaseResultSchema,
  envelopeSchema,
  legacyPurchaseResultSchema,
  reservationCreatedSchema,
} from "@/lib/api/schemas";
import type {
  ApiEnvelope,
  DirectPurchaseInput,
  DirectPurchaseResult,
  LegacyPurchaseResult,
  PurchaseInput,
  ReservationCreated,
  ReserveInput,
} from "@/lib/api/types";

const reservationEnvelope = envelopeSchema(reservationCreatedSchema);
const purchaseEnvelope = envelopeSchema(legacyPurchaseResultSchema);
const directPurchaseEnvelope = envelopeSchema(directPurchaseResultSchema);

export const reservationService = {
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

