import { z } from "zod";

export const paymentMethodIdSchema = z.enum(["KBZPAY", "WAVEPAY"]);

export const seatSchema = z.object({
  id: z.string().uuid(),
  ticketId: z.string().uuid(),
  label: z.string(),
  sequence: z.number().int().positive(),
  status: z.enum(["AVAILABLE", "HELD", "SOLD"]),
});

export const paymentSummarySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PENDING_REVIEW", "APPROVED", "REJECTED", "EXPIRED"]),
  paymentMethod: paymentMethodIdSchema,
  rejectionReason: z.string().nullable(),
  submittedAt: z.string(),
  reviewedAt: z.string().nullable(),
});

export const reservationSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
  status: z.enum(["PENDING", "UNDER_REVIEW", "PURCHASED", "REJECTED", "EXPIRED"]),
  unitPrice: z.number().int().nullable(),
  totalAmount: z.number().int().nullable(),
  expiresAt: z.string(),
  createdAt: z.string(),
  concert: z.object({
    id: z.string().uuid(), title: z.string(), venue: z.string(), startsAt: z.string(),
  }),
  ticket: z.object({
    id: z.string().uuid(), type: z.enum(["VIP", "NORMAL"]), price: z.number().int(),
  }).nullable(),
  seats: z.array(z.object({ id: z.string().uuid(), label: z.string() })),
  payment: paymentSummarySchema.nullable(),
});

export const paymentConfigSchema = z.object({
  currency: z.literal("MMK"),
  methods: z.array(z.object({
    id: paymentMethodIdSchema,
    name: z.string(),
  })).min(1),
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PENDING_REVIEW", "APPROVED", "REJECTED", "EXPIRED"]),
  paymentMethod: paymentMethodIdSchema,
  mimeType: z.string(),
  sizeBytes: z.number().int(),
  rejectionReason: z.string().nullable(),
  submittedAt: z.string(),
  reviewedAt: z.string().nullable(),
  reservation: reservationSchema,
  user: z.object({ id: z.string().uuid(), email: z.string(), name: z.string().nullable() }).nullable(),
});

export const paymentListSchema = z.object({
  items: z.array(paymentSchema), total: z.number().int(), page: z.number().int(), limit: z.number().int(),
});

export const reserveSchema = z.object({
  ticketId: z.string().uuid(),
  seatIds: z.array(z.string().uuid()).min(1).max(5),
});
