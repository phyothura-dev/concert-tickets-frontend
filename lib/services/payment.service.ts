import { apiFetch } from "@/lib/api/client";
import { envelopeSchema, paymentConfigSchema, paymentListSchema, paymentSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, Payment, PaymentConfig, PaymentList } from "@/lib/api/types";
import { env } from "@/config/env";

export const paymentService = {
  async getConfig() {
    const response = await apiFetch<ApiEnvelope<PaymentConfig>>("/payments/config", { cache: "no-store" });
    return envelopeSchema(paymentConfigSchema).parse(response).data;
  },
  async list(options: { status?: Payment["status"]; page?: number } = {}) {
    const query = new URLSearchParams();
    if (options.status) query.set("status", options.status);
    query.set("page", String(options.page ?? 1));
    query.set("limit", "20");
    const response = await apiFetch<ApiEnvelope<PaymentList>>(`/payments?${query.toString()}`, { cache: "no-store" });
    return envelopeSchema(paymentListSchema).parse(response).data;
  },
  async review(id: string, input: { decision: "APPROVE" } | { decision: "REJECT"; reason: string }) {
    const response = await apiFetch<ApiEnvelope<Payment>>(`/payments/${id}/review`, {
      method: "PATCH", body: input,
    });
    return envelopeSchema(paymentSchema).parse(response).data;
  },
  screenshotUrl(id: string) {
    return `${env.apiBaseUrl}/payments/${id}/screenshot`;
  },
};
