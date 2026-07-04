import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string().uuid(),
  concertId: z.string().uuid(),
  totalStock: z.number().int().nonnegative(),
  remainingStock: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  type: z.enum(["VIP", "NORMAL"]),
});

export const concertSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  availableStock: z.number().int().nonnegative(),
  totalStock: z.number().int().nonnegative(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
  name: z.string().nullable(),
  pictureUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  lastLoginAt: z.string(),
});

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

export const authUserResponseSchema = z.object({
  user: userSchema,
});

export const signOutResultSchema = z.object({
  signedOut: z.boolean(),
});

export const createConcertSchema = z.object({
  title: z.string().min(1, "title is required").max(500, "title is too long"),
  venue: z.string().min(1, "venue is required").max(500, "venue is too long"),
  startsAt: z.string().min(1, "startsAt is required"),
});

export const createTicketSchema = z.object({
  concertId: z.string().uuid("concertId must be a valid UUID"),
  totalStock: z.coerce
    .number()
    .int("totalStock must be an integer")
    .min(1, "totalStock must be a positive integer")
    .max(1_000_000, "totalStock is too large"),
  price: z.coerce
    .number()
    .int("price must be an integer")
    .min(0, "price must be non-negative"),
  type: z.enum(["VIP", "NORMAL"]),
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

export function envelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.literal("success").optional(),
    message: z.string(),
    data: dataSchema,
  });
}

