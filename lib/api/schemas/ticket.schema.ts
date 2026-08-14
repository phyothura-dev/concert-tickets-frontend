import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string().uuid(),
  concertId: z.string().uuid(),
  totalStock: z.number().int().nonnegative(),
  remainingStock: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  type: z.enum(["VIP", "NORMAL"]),
});

export const ticketInputSchema = z.object({
  concertId: z.string().uuid("Please select a concert"),
  totalStock: z.coerce
    .number()
    .int("Total seats must be an integer")
    .min(1, "Total seats must be at least 1")
    .max(500, "Total seats cannot exceed 500"),
  price: z.coerce
    .number()
    .int("Price must be an integer")
    .min(0, "Price cannot be negative"),
  type: z.enum(["VIP", "NORMAL"]),
});
