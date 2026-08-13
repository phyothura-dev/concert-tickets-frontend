import { apiFetch } from "@/lib/api/client";
import { envelopeSchema, reservationSchema, paymentSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, Payment, PaymentMethodId, Reservation, ReserveInput } from "@/lib/api/types";

const reservationEnvelope = envelopeSchema(reservationSchema);
const historyEnvelope = envelopeSchema(reservationSchema.array());
const paymentEnvelope = envelopeSchema(paymentSchema);

export const reservationService = {
  async listHistory() {
    const response = await apiFetch<ApiEnvelope<Reservation[]>>("/reservations/me", { cache: "no-store" });
    return historyEnvelope.parse(response).data;
  },
  async getReservation(id: string) {
    const response = await apiFetch<ApiEnvelope<Reservation>>(`/reservations/${id}`, { cache: "no-store" });
    return reservationEnvelope.parse(response).data;
  },
  async reserve(input: ReserveInput) {
    const response = await apiFetch<ApiEnvelope<Reservation>>("/reserve", { method: "POST", body: input });
    return reservationEnvelope.parse(response).data;
  },
  async submitPayment(reservationId: string, paymentMethod: PaymentMethodId, screenshot: File) {
    const body = new FormData();
    body.append("paymentMethod", paymentMethod);
    body.append("screenshot", screenshot);
    const response = await apiFetch<ApiEnvelope<Payment>>(`/reservations/${reservationId}/payment`, {
      method: "POST", body, timeoutMs: 30_000,
    });
    return paymentEnvelope.parse(response).data;
  },
};
