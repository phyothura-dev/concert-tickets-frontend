import { z } from "zod";

export const concertSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  availableStock: z.number().int().nonnegative(),
  totalStock: z.number().int().nonnegative(),
  singers: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
});

export const createConcertSchema = z.object({
  title: z.string().min(1, "title is required").max(500, "title is too long"),
  venue: z.string().min(1, "venue is required").max(500, "venue is too long"),
  startsAt: z.string().min(1, "startsAt is required"),
});
