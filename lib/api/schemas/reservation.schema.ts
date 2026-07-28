import { z } from "zod";

export const reservationCreatedSchema = z.object({
  reservationId: z.string().uuid(),
  expiresAt: z.string(),
});

export const legacyPurchaseResultSchema = z.object({
  reservationId: z.string().uuid(),
  status: z.literal("PURCHASED"),
});

export const directPurchaseResultSchema = z.object({
  reservationId: z.string().uuid(),
  concertId: z.string().uuid(),
  quantity: z.number().int().positive(),
  remainingStock: z.number().int().nonnegative(),
  method: z.enum(["OPTIMISTIC", "PESSIMISTIC"]),
});

export const reserveSchema = z.object({
  concertId: z.string().uuid("concertId must be a valid UUID"),
  quantity: z.coerce
    .number()
    .int("quantity must be an integer")
    .min(1, "quantity must be between 1 and 5")
    .max(5, "quantity must be between 1 and 5"),
  holdSeconds: z.coerce
    .number()
    .int()
    .min(10, "holdSeconds must be between 10 and 3600")
    .max(3600, "holdSeconds must be between 10 and 3600")
    .optional(),
});

export const purchaseSchema = z.object({
  reservationId: z.string().uuid("reservationId must be a valid UUID"),
});

export const directPurchaseSchema = z.object({
  concertId: z.string().uuid("concertId must be a valid UUID"),
  quantity: z.coerce
    .number()
    .int("quantity must be an integer")
    .min(1, "quantity must be between 1 and 5")
    .max(5, "quantity must be between 1 and 5"),
});
