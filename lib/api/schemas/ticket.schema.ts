import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string().uuid(),
  concertId: z.string().uuid(),
  totalStock: z.number().int().nonnegative(),
  remainingStock: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  type: z.enum(["VIP", "NORMAL"]),
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
